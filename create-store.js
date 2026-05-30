// =============================================
// create-store.js
// Run this to register a new BendungStore
// and generate its subdomain automatically
// =============================================
// Usage:
//   node create-store.js
// =============================================

const BACKEND_URL = process.env.MEDUSA_BACKEND_URL ||
  "https://your-backend.up.railway.app"

// ---- HELPER: Generate handle from store name ----
function generateHandle(storeName) {
  return storeName
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "")
    .slice(0, 63)
}

// ---- CREATE A NEW STORE ----
async function createStore({
  customerId,
  storeName,
  plan = "starter",
  description = "",
  primaryColor = "#5cb85c"
}) {
  const handle = generateHandle(storeName)

  console.log(`\n🌿 Creating BendungStore...`)
  console.log(`   Store Name: ${storeName}`)
  console.log(`   Subdomain:  ${handle}.bendung.com`)
  console.log(`   Plan:       ${plan}`)

  const res = await fetch(`${BACKEND_URL}/store/bendung-stores`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      customer_id: customerId,
      store_name: storeName,
      store_handle: handle,
      plan,
      description,
      primary_color: primaryColor
    })
  })

  const data = await res.json()

  if (!res.ok) {
    console.error(`\n❌ Error: ${data.error}`)
    return null
  }

  console.log(`\n✅ Store created successfully!`)
  console.log(`   Live URL: ${data.store.url}`)
  console.log(`   Handle:   ${data.store.handle}`)
  console.log(`   Plan:     ${data.store.plan}`)
  return data.store
}

// ---- TEST EXAMPLES ----
// These show how to create stores for your clients
async function runExamples() {
  // Example 1: Book store
  await createStore({
    customerId: "cus_REPLACE_WITH_REAL_ID",
    storeName: "Crystal Evans Book Store",
    plan: "starter",
    description: "Caribbean fiction and non-fiction books"
  })
  // Creates: crystalevansbookstore.bendung.com

  // Example 2: Fashion store
  await createStore({
    customerId: "cus_REPLACE_WITH_REAL_ID_2",
    storeName: "Island Style Boutique",
    plan: "partner",
    primaryColor: "#e91e8c"
  })
  // Creates: islandstyleboutique.bendung.com

  // Example 3: Tech store
  await createStore({
    customerId: "cus_REPLACE_WITH_REAL_ID_3",
    storeName: "JA Tech Hub",
    plan: "director"
  })
  // Creates: jatechhub.bendung.com
}

runExamples()

module.exports = { createStore, generateHandle }
