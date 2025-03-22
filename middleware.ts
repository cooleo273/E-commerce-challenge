import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyAdminAuth } from './lib/auth'

export async function middleware(request: NextRequest) {
  // Check if the path starts with /admin but is not the login page
  if (request.nextUrl.pathname.startsWith('/admin') && 
      !request.nextUrl.pathname.startsWith('/admin/login')) {
    
    const session = await verifyAdminAuth(request)
    
    if (!session) {
      // Redirect to login if not authenticated
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
  }

  return NextResponse.next()
}

// Configure which routes to run middleware on
export const config = {
  matcher: [
    '/admin/:path*',
    // Add other protected paths here
  ]
}