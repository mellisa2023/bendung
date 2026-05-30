// =============================================
// backend/src/api/store/bendung-stores/route.ts
// Add to: backend/src/api/store/bendung-stores/
// =============================================
// Endpoints:
//   GET  /store/bendung-stores/:handle  → get store by subdomain
//   POST /store/bendung-stores          → register a new store (creates subdomain)
// =============================================

import type { MedusaRequest, MedusaResponse } from "@medusajs/medusa"

// In production, store this in your database via a Medusa module
// For now, uses Medusa customer metadata as storage
// You can upgrade to a full custom module later

// ---- GET /store/bendung-stores/:handle ----
export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const handle = req.params?.handle

  if (!handle) {
    return res.status(400).json({ error: "Store handle required" })
  }

  try {
    const customerService = req.scope.resolve("customerModuleService")

    // Find customer whose metadata.store_handle matches
    const { customers } = await customerService.listAndCount(
      { metadata: { store_handle: handle } },
      { take: 1 }
    )

    if (!customers || customers.length === 0) {
      return res.status(404).json({ error: "Store not found" })
    }

    const owner = customers[0]
    const meta = owner.metadata || {}

    const store = {
      handle: meta.store_handle,
      name: meta.store_name || `${owner.first_name}'s Store`,
      owner_name: `${owner.first_name} ${owner.last_name || ""}`.trim(),
      description: meta.store_description || "",
      logo_url: meta.store_logo || null,
      banner_url: meta.store_banner || null,
      primary_color: meta.store_color || "#5cb85c",
      accent_color: meta.store_accent || "#0d2b18",
      subdomain: `${handle}.${process.env.BASE_DOMAIN || "bendung.com"}`,
      plan: meta.plan || "starter",
      active: meta.store_active !== false
    }

    return res.json({ store })

  } catch (err) {
    console.error("Store lookup error:", err)
    return res.status(500).json({ error: "Store lookup failed" })
  }
}

// ---- POST /store/bendung-stores ----
// Registers a new BendungStore and generates its subdomain
export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const {
    customer_id,
    store_name,
    store_handle,
    plan = "starter",
    description = "",
    primary_color = "#5cb85c"
  } = req.body as any

  if (!customer_id || !store_name || !store_handle) {
    return res.status(400).json({
      error: "customer_id, store_name, and store_handle are required"
    })
  }

  // Validate handle format (letters and numbers only)
  if (!/^[a-z0-9]+$/.test(store_handle)) {
    return res.status(400).json({
      error: "Store handle must be lowercase letters and numbers only"
    })
  }

  try {
    const customerService = req.scope.resolve("customerModuleService")

    // Check handle isn't already taken
    const { customers: existing } = await customerService.listAndCount(
      { metadata: { store_handle } },
      { take: 1 }
    )

    if (existing && existing.length > 0) {
      return res.status(409).json({
        error: `The subdomain "${store_handle}.bendung.com" is already taken`
      })
    }

    // Update customer metadata with store info
    await customerService.update(customer_id, {
      metadata: {
        store_handle,
        store_name,
        store_description: description,
        store_color: primary_color,
        store_active: true,
        plan,
        store_created_at: new Date().toISOString()
      }
    })

    const baseDomain = process.env.BASE_DOMAIN || "bendung.com"
    const storeUrl = `https://${store_handle}.${baseDomain}`

    return res.status(201).json({
      success: true,
      store: {
        handle: store_handle,
        name: store_name,
        url: storeUrl,
        plan
      },
      message: `Your store is live at ${storeUrl}`
    })

  } catch (err) {
    console.error("Store creation error:", err)
    return res.status(500).json({ error: "Store creation failed" })
  }
}
