# BendungStore — Wildcard Subdomain System
## crystalevansbookstore.bendung.com — Auto-Generated Store URLs

---

## How It Works

```
Client signs up for BendungStore
          ↓
System generates: crystalevansbookstore.bendung.com
          ↓
DNS wildcard *.bendung.com → points to Railway
          ↓
Middleware reads subdomain → finds store in Medusa
          ↓
Storefront loads that store's products + branding
          ↓
Client shares their link → customers shop
```

---

## File Locations in Your GitHub Repo

```
mellisa2023/medusajs-2.0-for-railway-boilerplate/
├── storefront/src/
│   ├── middleware.ts                          ← REPLACE existing file
│   └── lib/
│       └── store-lookup.ts                   ← ADD new file
└── backend/src/
    └── api/store/bendung-stores/
        └── route.ts                          ← ADD new file
```

---

## Step 1 — DNS Wildcard Record

Go to your domain registrar for bendung.com and add:

| Type  | Name | Value                          | TTL  |
|-------|------|-------------------------------|------|
| CNAME | *    | your-app.up.railway.app        | Auto |
| CNAME | @    | your-app.up.railway.app        | Auto |

The `*` is the wildcard — it catches EVERY subdomain automatically.
You only do this ONCE and it covers every store forever.

---

## Step 2 — Add Custom Domain in Railway

1. Railway → Storefront service → Settings → Networking
2. Click **Add Custom Domain**
3. Add: `*.bendung.com`
4. Add: `bendung.com`
5. Railway generates free SSL for every subdomain automatically ✅

---

## Step 3 — Add Environment Variables in Railway

Railway → Backend service → Variables:
```
BASE_DOMAIN = bendung.com
```

Railway → Storefront service → Variables:
```
NEXT_PUBLIC_BASE_DOMAIN   = bendung.com
NEXT_PUBLIC_DEFAULT_REGION = us
```

---

## Step 4 — Add Files to GitHub

### File 1: Replace middleware.ts
Location: `storefront/src/middleware.ts`
→ Replace entire file with `middleware.ts` from this ZIP

### File 2: Add store-lookup.ts
Location: `storefront/src/lib/store-lookup.ts`
→ Upload `store-lookup.ts` from this ZIP

### File 3: Add API route
Location: `backend/src/api/store/bendung-stores/route.ts`
→ Create the folder path and upload `bendung-stores-route.ts`

---

## Step 5 — Create Your First Store

Once deployed, run `create-store.js` to register a client store:

```bash
# Set your backend URL
export MEDUSA_BACKEND_URL=https://your-backend.up.railway.app

# Run it
node create-store.js
```

Or call the API directly:

```bash
curl -X POST https://your-backend.up.railway.app/store/bendung-stores \
  -H "Content-Type: application/json" \
  -d '{
    "customer_id": "cus_01JXXXXX",
    "store_name": "Crystal Evans Book Store",
    "plan": "starter"
  }'
```

Response:
```json
{
  "success": true,
  "store": {
    "handle": "crystalevansbookstore",
    "name": "Crystal Evans Book Store",
    "url": "https://crystalevansbookstore.bendung.com",
    "plan": "starter"
  },
  "message": "Your store is live at https://crystalevansbookstore.bendung.com"
}
```

---

## Handle Generation Examples

| Store Name               | Auto-Generated Subdomain                    |
|--------------------------|---------------------------------------------|
| Crystal Evans Book Store | crystalevansbookstore.bendung.com           |
| Island Style Boutique    | islandstyleboutique.bendung.com             |
| JA Tech Hub              | jatechhub.bendung.com                       |
| Kingston Grocery         | kingstongrocery.bendung.com                 |
| Trini Fashion House      | trinifashionhouse.bendung.com               |
| Caribbean Call Center    | caribbeancallcenter.bendung.com             |

---

## What Each Plan Gets

| Plan     | Price  | Subdomain | Products | AI Agents | Commission |
|----------|--------|-----------|----------|-----------|------------|
| Starter  | $20/mo | ✅        | 50       | ❌        | 10%        |
| Partner  | $49/mo | ✅        | 500      | ✅        | 20%        |
| Director | $99/mo | ✅        | Unlimited| ✅        | 25%        |

---

## Custom Domain Upgrade (Optional)

If a client wants their OWN domain (e.g. `crystalevans.com`) instead of a subdomain:

1. They point their domain CNAME to `crystalevansbookstore.bendung.com`
2. You add it as a custom domain in Railway
3. Railway issues SSL automatically

Charge extra for this — it's a premium feature.

---

*BendungStore. Simple. Affordable. Powerful.*
