import { NextResponse } from 'next/server'

export const ROLES = {
  ADMIN: 'admin',
  USER: 'user',
  GUEST: 'guest'
}

export const API_PERMISSIONS = {
  '/api/user/note': {
    GET: [ROLES.ADMIN, ROLES.USER],
    POST: [ROLES.ADMIN, ROLES.USER]
  },
  '/api/user/note/:id': {
    GET: [ROLES.ADMIN, ROLES.USER],
    PUT: [ROLES.ADMIN, ROLES.USER],
    DELETE: [ROLES.ADMIN, ROLES.USER]
  },
  
  '/api/auth/login': {
    POST: [ROLES.GUEST, ROLES.USER, ROLES.ADMIN]
  },
  '/api/auth/register': {
    POST: [ROLES.GUEST, ROLES.USER, ROLES.ADMIN]
  },
  '/api/auth/logout': {
    POST: [ROLES.USER, ROLES.ADMIN]
  }
}

export function requiresAuth(path) {
  const publicPaths = [
    '/api/auth/login',
    '/api/auth/register'
  ]
  
  return !publicPaths.some(publicPath => path.startsWith(publicPath))
}

export function hasPermission(path, method, role) {
  const exactPathPermission = API_PERMISSIONS[path]
  if (exactPathPermission) {
    const allowedRoles = exactPathPermission[method]
    return allowedRoles?.includes(role) || false
  }
  
  for (const [permissionPath, methodPermissions] of Object.entries(API_PERMISSIONS)) {
    if (permissionPath.includes(':id')) {
      const basePathPattern = permissionPath.replace(':id', '\\w+')
      const regex = new RegExp(`^${basePathPattern}$`.replace(/\//g, '\\/'))
      
      if (regex.test(path)) {
        const allowedRoles = methodPermissions[method]
        return allowedRoles?.includes(role) || false
      }
    }
  }
  
  return false
}

export function createUnauthorizedResponse(message = 'Unauthorized') {
  return NextResponse.json(
    { success: false, message },
    { status: 401 }
  )
}

export function createForbiddenResponse(message = 'Forbidden') {
  return NextResponse.json(
    { success: false, message },
    { status: 403 }
  )
}