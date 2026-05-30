// =============================================
// storefront/src/middleware.ts
// REPLACE your existing middleware.ts with this
// =============================================
// This reads the subdomain from the URL and:
// 1. Finds the matching store in Medusa
// 2. Loads that store's products + branding
// 3. Serves the right storefront
// =============================================

import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const MAIN_DOMAIN = process.env.NEXT_PUBLIC_BASE_DOMAIN || "bendung.com"
const DEFAULT_REGION = process.env.NEXT_PUBLIC_DEFAULT_REGION || "us"

export async function middleware(request: NextRequest) {
  const url = request.nextUrl.clone()
  const hostname = request.headers.get("host") || ""

  // Strip port for local dev (e.g. localhost:3000)
  const host = hostname.replace(/:.*/, "")

  // ---- EXTRACT SUBDOMAIN ----
  // crystalevansbookstore.bendung.com → "crystalevansbookstore"
  // bendung.com or www.bendung.com → null (main site)
  let subdomain: string | null = null

  if (host.endsWith(`.${MAIN_DOMAIN}`)) {
    const sub = host.replace(`.${MAIN_DOMAIN}`, "")
    if (sub && sub !== "www" && sub !== "app" && sub !== "admin") {
      subdomain = sub
    }
  }

  // Local dev: support subdomain.localhost
  if (host.endsWith(".localhost")) {
    const sub = host.replace(".localhost", "")
    if (sub && sub !== "www") {
      subdomain = sub
    }
  }

  // ---- MAIN SITE — no subdomain ----
  if (!subdomain) {
    // Redirect root to main landing page or default store
    if (url.pathname === "/") {
      return NextResponse.next()
    }
    return NextResponse.next()
  }

  // ---- SUBDOMAIN STORE ----
  // Pass subdomain as header so pages can use it
  const response = NextResponse.rewrite(
    new URL(`/${DEFAULT_REGION}${url.pathname}${url.search}`, request.url)
  )

  // Pass store handle to all page components via header
  response.headers.set("x-store-handle", subdomain)
  response.headers.set("x-store-domain", host)

  return response
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|images|assets).*)"
  ]
}
