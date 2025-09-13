import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET

if (!JWT_SECRET) {
  console.warn('WARNING: JWT_SECRET not set in environment variables. Using insecure default secret.')
}

export function CreateJWT(user) {
  if (!JWT_SECRET) {
    throw new Error('JWT_SECRET not configured in your .env.local')
  }
  const payload = {
    userId: user.id,
    role: user.position,
    email: user.email,
    iat: Math.floor(Date.now() / 1000), 
  }
  return jwt.sign(payload, JWT_SECRET, { 
    expiresIn: '24h',
    algorithm: 'HS256'
  })
}

export function VerifyJWT(token) {
  if (!JWT_SECRET) {
    return { success: false, decoded: null, error: 'JWT_SECRET not configured in your .env.local' }
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET, { algorithms: ['HS256'] })
    const currentTime = Math.floor(Date.now() / 1000)
    
    if (decoded.exp && decoded.exp < currentTime) {
      return { success: false, decoded: null, error: 'Token expired' }
    }
    return { success: true, decoded, error: null }
  } catch (error) {
    return { success: false, decoded: null, error: error.message }
  }
}

export function DecodeJWT(token) {
  try {
    const decoded = jwt.decode(token)
    return { success: true, decoded, error: null }
  } catch (error) {
    return { success: false, decoded: null, error: error.message }
  }
}

export function IsTokenValid(token) {
  const { success } = VerifyJWT(token)
  return success
}