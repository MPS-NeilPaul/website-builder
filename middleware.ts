import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export const config = {
  matcher: ["/((?!api/|_next/|_static/|_vercel|[\\w-]+\\.\\w+).*)"],
};

export default function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const hostname = req.headers.get("host") || "";

  // 1. Strip port if it exists (converts 'localhost:3000' to 'localhost')
  const currentHost = hostname.replace(/:3000$/, "");

  // 2. Define your main platform domain
  const appDomain = "localhost";

  // 3. LOGIC BYPASS: If we are on the root domain (localhost), 
  // do NOT rewrite. Let it find /dashboard in the app folder.
  if (currentHost === appDomain) {
    return NextResponse.next();
  }

  // 4. MULTI-TENANT REWRITE: For subdomains (like bakery.localhost)
  // We rewrite to the internal dynamic path /[hostname]/[path]
  return NextResponse.rewrite(new URL(`/${hostname}${url.pathname}`, req.url));
}