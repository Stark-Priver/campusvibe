import { NextResponse, type NextRequest } from "next/server"

const PROTECTED_ROUTES = ["/dashboard"]
const AUTH_ROUTES = ["/login", "/register"]

export async function middleware(request: NextRequest) {
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set("x-pathname", request.nextUrl.pathname)

  const response = NextResponse.next({
    request: { headers: requestHeaders },
  })

  const token = request.cookies.get("auth-token")?.value
  const hasAuthCookie = Boolean(token)

  const pathname = request.nextUrl.pathname

  if (PROTECTED_ROUTES.some(r => pathname.startsWith(r)) && !hasAuthCookie) {
    const loginUrl = new URL("/login", request.url)
    loginUrl.searchParams.set("redirect", pathname)
    return NextResponse.redirect(loginUrl)
  }

  if (AUTH_ROUTES.some(r => pathname.startsWith(r)) && hasAuthCookie) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  response.headers.set("x-pathname", pathname)
  return response
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|manifest.json|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)).*)",
  ],
}

