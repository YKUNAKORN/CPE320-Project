import { NextResponse } from 'next/server'
import { VerifyJWT } from './lib/auth/jwt'
import { RequiresAuth, HasPermission, CreateUnauthorizedResponse, CreateForbiddenResponse, Role } from './lib/auth/permission'

export function middleware(request) {
  const path = request.nextUrl.pathname
  const method = request.method
  console.log('Middleware Debug:', {
    path,
    method,
    cookies: Object.fromEntries(request.cookies.entries()),
    headers: Object.fromEntries(request.headers.entries())
  })
  // authentication check
  if (RequiresAuth(path)) {
    // get token from cookie
    const authToken = request.cookies.get('auth-token')?.value
    if (!authToken) {
      return CreateUnauthorizedResponse('Authentication required')
    }
    // valid token and decode claims check
    const { success, decoded, error } = VerifyJWT(authToken)
    if (!success) {
      return CreateUnauthorizedResponse('Invalid token: ' + error)
    }
    // check user ID in claims
    if (!decoded.userId) {
      return CreateUnauthorizedResponse('Invalid token: missing user ID')
    }
    // get role from cliams
    const userRole = decoded.role || Role.GUEST
    if (!HasPermission(path, method, userRole)) { // access permission
      return CreateForbiddenResponse('You do not have permission to access this resource')
    }
    // add claims data into headers for API used
    const requestHeaders = new Headers(request.headers)
    requestHeaders.set('x-user-id', decoded.userId)
    requestHeaders.set('x-user-role', userRole)
    requestHeaders.set('x-user-email', decoded.email || '') 
    
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    })
  }
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/api/user/:path*'
  ]
}