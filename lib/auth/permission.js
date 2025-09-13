import { NextResponse } from 'next/server'

export const Role = {
  ADMIN: 'admin',
  DOCTOR: 'doctor',
  PATIENT: 'patient',
  GUEST: 'guest'
}

const AUTH_REQUIRED_PATHS = [
  '/api/user',
  '/api/user/note',
  '/api/auth/logout'
]

const ROLE_HIERARCHY = {
  [Role.ADMIN]: [Role.DOCTOR, Role.PATIENT, Role.GUEST],
  [Role.DOCTOR]: [Role.PATIENT, Role.GUEST],
  [Role.PATIENT]: [Role.GUEST],
  [Role.GUEST]: []
}

const PERMISSIONS = {
  '/api/user/note': {
    GET: [Role.ADMIN, Role.DOCTOR, Role.PATIENT],
    POST: [Role.ADMIN, Role.DOCTOR],
    PUT: [Role.ADMIN, Role.DOCTOR],
    DELETE: [Role.ADMIN]
  },
  '/api/user': {
    GET: [Role.ADMIN, Role.DOCTOR, Role.PATIENT],
    POST: [Role.ADMIN],
    PUT: [Role.ADMIN, Role.DOCTOR, Role.PATIENT],
    DELETE: [Role.ADMIN]
  }
}

export function RequiresAuth(path) {
  return AUTH_REQUIRED_PATHS.some(authPath => path.startsWith(authPath))
}

function RoleHasPrivilegeOver(role1, role2) {
  return role1 === role2 || ROLE_HIERARCHY[role1]?.includes(role2)
}

export function HasPermission(path, method, userRole) {
  const matchedPath = Object.keys(PERMISSIONS).find(permPath => path === permPath || path.startsWith(`${permPath}/`))
  if (!matchedPath) return true
  const allowedRoles = PERMISSIONS[matchedPath][method]
  if (!allowedRoles || allowedRoles.length === 0) return false 
  return allowedRoles.some(role => RoleHasPrivilegeOver(userRole, role))
}

export function CreateUnauthorizedResponse(message = 'Unauthorized') {
  return NextResponse.json(
    { success: false, message }, { status: 401, headers: { 'WWW-Authenticate': 'Bearer' } }
  )
}

export function CreateForbiddenResponse(message = 'Forbidden') {
  return NextResponse.json(
    { success: false, message }, { status: 403 }
  )
}