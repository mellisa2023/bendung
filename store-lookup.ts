// =============================================
// storefront/src/lib/store-lookup.ts
// Fetches store data from Medusa by subdomain
// =============================================

const MEDUSA_BACKEND = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000"

export interface BendungStore {
  handle: string           // e.g. "crystalevansbookstore"
  name: string             // e.g. "Crystal Evans Book Store"
  owner_name: string       // e.g. "Crystal Evans"
  description: string
  logo_url?: string
  banner_url?: string
  primary_color?: string   // hex e.g. "#5cb85c"
  accent_color?: string
  subdomain: string        // full URL e.g. "crystalevansbookstore.bendung.com"
  plan: "starter" | "partner" | "director"
  active: boolean
}

// Cache store lookups for 60 seconds to avoid hammering the API
const storeCache = new Map<string, { data: BendungStore; expires: number }>()

export async function getStoreByHandle(handle: string): Promise<BendungStore | null> {
  // Check cache first
  const cached = storeCache.get(handle)
  if (cached && cached.expires > Date.now()) {
    return cached.data
  }

  try {
    // Fetch from Medusa custom endpoint (built in Step 4)
    const res = await fetch(
      `${MEDUSA_BACKEND}/store/bendung-stores/${handle}`,
      {
        headers: { "Content-Type": "application/json" },
        next: { revalidate: 60 } // Next.js cache for 60s
      }
    )

    if (!res.ok) {
      console.warn(`Store not found for handle: ${handle}`)
      return null
    }

    const { store } = await res.json()

    // Cache it
    storeCache.set(handle, {
      data: store,
      expires: Date.now() + 60_000
    })

    return store
  } catch (err) {
    console.error(`Store lookup failed for ${handle}:`, err)
    return null
  }
}

// Generate the full subdomain URL for a store
export function getStoreUrl(handle: string): string {
  const domain = process.env.NEXT_PUBLIC_BASE_DOMAIN || "bendung.com"
  return `https://${handle}.${domain}`
}

// Generate a handle from a store name
// "Crystal Evans Book Store" → "crystalevansbookstore"
export function generateHandle(storeName: string): string {
  return storeName
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "")
    .slice(0, 63) // max subdomain length
}
