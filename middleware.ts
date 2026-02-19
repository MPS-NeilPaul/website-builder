import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export const config = {
  matcher: [
    /*
     * Match all paths except for:
     * 1. /api routes
     * 2. /_next (Next.js internals)
     * 3. /_static (inside /public)
     * 4. all root files inside /public (e.g. favicon.ico, images)
     */
    "/((?!api/|_next/|_static/|_vercel|[\\w-]+\\.\\w+).*)",
  ],
};

export default function middleware(req: NextRequest) {
  const url = req.nextUrl;
  
  // 1. Get hostname of request (e.g. bakery.localhost:3000 or mybakery.com)
  const hostname = req.headers.get("host") || "";

  // 2. Strip the port if we are running locally so the routing is clean
  const cleanHostname = hostname.split(":")[0];

  // 3. Define the main platform domain 
  // (You will change "nexus.com" to your actual production domain later)
  const appDomain = process.env.NODE_ENV === "production" ? "nexus.com" : "localhost";

  // 4. MAIN SAAS ROUTING
  // If the user is visiting localhost, www.localhost, nexus.com, or www.nexus.com,
  // let them pass through to the main Landing Page, Login, or Dashboard.
  if (cleanHostname === appDomain || cleanHostname === `www.${appDomain}`) {
    return NextResponse.next();
  }

  // 5. TENANT ROUTING (The Magic)
  // If the request hits here, it is a subdomain (bakery.localhost) or a custom domain.
  // We silently rewrite the URL to a dedicated hidden folder: /site/[domain]/[path]
  // The user's browser URL stays exactly the same (e.g., bakery.com/about)
  return NextResponse.rewrite(new URL(`/site/${cleanHostname}${url.pathname}`, req.url));
}