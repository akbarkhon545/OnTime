import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(req: NextRequest) {
  const { nextUrl } = req
  const token = req.cookies.get("authjs.session-token") || req.cookies.get("__Secure-authjs.session-token")

  const isApiAuthRoute = nextUrl.pathname.startsWith("/api/auth")
  const isApiRoute = nextUrl.pathname.startsWith("/api/")
  const isPublicRoute = ["/", "/login", "/register"].includes(nextUrl.pathname)
  const isStaticRoute = nextUrl.pathname.startsWith("/_next") || nextUrl.pathname.includes("favicon")

  // Skip auth routes, API routes, and static files
  if (isApiAuthRoute || isStaticRoute) {
    return NextResponse.next()
  }

  // API routes need auth check via headers (handled in route handlers)
  if (isApiRoute) {
    return NextResponse.next()
  }

  // Redirect to login if not authenticated and not on a public route
  if (!token && !isPublicRoute) {
    return NextResponse.redirect(new URL("/login", nextUrl))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}
