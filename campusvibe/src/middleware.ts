import { NextResponse, type NextRequest } from "next/server"
import { createServerClient } from "@supabase/ssr"

const PROTECTED_ROUTES = ["/dashboard"]
const AUTH_ROUTES = ["/login", "/register"]

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Forward the pathname as a header so Server Components can read it
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set("x-pathname", pathname)

  // Build the base "pass-through" response that carries our custom header
  let supabaseResponse = NextResponse.next({
    request: { headers: requestHeaders },
  })
  supabaseResponse.headers.set("x-pathname", pathname)

  // If Supabase env vars are not configured yet, skip auth checks entirely
  // (avoids redirect loops during development before Supabase is set up)
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ""
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ""

  if (
    !supabaseUrl ||
    !supabaseKey ||
    supabaseUrl.includes("your-project-ref") ||
    supabaseUrl === ""
  ) {
    return supabaseResponse
  }

  // Create Supabase client wired to request/response cookies
  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet) {
        // Apply cookie mutations to the request for downstream use
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value)
        )
        // Rebuild the response so cookie Set-Cookie headers are included
        supabaseResponse = NextResponse.next({
          request: { headers: requestHeaders },
        })
        supabaseResponse.headers.set("x-pathname", pathname)
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        )
      },
    },
  })

  // Refresh the session — this is the official Supabase SSR pattern.
  // IMPORTANT: Always use getUser() not getSession() for security.
  let user = null
  try {
    const { data, error } = await supabase.auth.getUser()
    if (!error) {
      user = data.user
    }
  } catch {
    // Network error, Supabase down, or invalid credentials in .env
    // Fall through — treat as unauthenticated but DON'T redirect (avoid loops)
    return supabaseResponse
  }

  const isProtected = PROTECTED_ROUTES.some((r) => pathname.startsWith(r))
  const isAuthPage = AUTH_ROUTES.some((r) => pathname.startsWith(r))

  // Unauthenticated user trying to access a protected page → send to login
  if (isProtected && !user) {
    const loginUrl = new URL("/login", request.url)
    loginUrl.searchParams.set("redirect", pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Authenticated user visiting login/register → send to dashboard
  if (isAuthPage && user) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    /*
     * Match all paths EXCEPT:
     * - _next/static  (static files)
     * - _next/image   (image optimisation)
     * - All static assets in /public (png, jpg, svg, ico, etc.)
     * - Chrome DevTools well-known path
     */
    "/((?!_next/static|_next/image|favicon\\.ico|favicon\\.svg|apple-touch-icon\\.png|icon-192\\.png|icon-512\\.png|icon\\.svg|manifest\\.json|sitemap\\.xml|robots\\.txt|\\.well-known|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff|woff2|ttf|otf)).*)",
  ],
}
