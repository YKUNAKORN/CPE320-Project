import { NextResponse } from 'next/server'
import { DecodeJWT, VerifyJWT } from './lib/auth/jwt'
import { requiresAuth, hasPermission, createUnauthorizedResponse, createForbiddenResponse, ROLES } from './lib/auth/permission'
 
const allowedOrigins = ['https://acme.com', 'https://my-app.org']
 
const corsOptions = {
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}
 
export function middleware(request) {
  const origin = request.headers.get('origin') ?? ''
  const isAllowedOrigin = allowedOrigins.includes(origin)
  const isPreflight = request.method === 'OPTIONS'
 
  if (isPreflight) {
    const preflightHeaders = {
      ...(isAllowedOrigin && { 'Access-Control-Allow-Origin': origin }),
      ...corsOptions,
    }
    return NextResponse.json({}, { headers: preflightHeaders })
  }
  
  const path = request.nextUrl.pathname
  const method = request.method
  
  if (requiresAuth(path)) {
    const authToken = request.cookies.get('auth-token')?.value
    
    if (!authToken) {
      return createUnauthorizedResponse('Authentication required')
    }
    
    const { success, decoded, error } = VerifyJWT(authToken)
    
    if (!success) {
      return createUnauthorizedResponse('Invalid token: ' + error)
    }
    
    const userRole = decoded.role || ROLES.GUEST
    
    if (!hasPermission(path, method, userRole)) {
      return createForbiddenResponse('You do not have permission to access this resource')
    }
  }
 
  const response = NextResponse.next()
 
  if (isAllowedOrigin) {
    response.headers.set('Access-Control-Allow-Origin', origin)
  }
 
  Object.entries(corsOptions).forEach(([key, value]) => {
    response.headers.set(key, value)
  })
 
  return response
}
 
export const config = {
  matcher: '/api/:path*',
}