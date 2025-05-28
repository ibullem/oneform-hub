import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Check if the request is for admin routes (except login)
  if (request.nextUrl.pathname.startsWith("/admin") && !request.nextUrl.pathname.includes("/admin/auth")) {
    // In a real application, you might want to verify the JWT token here
    // For now, we'll let the client-side handle authentication
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*"],
}
