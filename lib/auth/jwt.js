import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN 

export function GenerateJWT(id, role, addtionalClaims = {}) {
    const payload = { id, role, ...addtionalClaims, iat: Math.floor(Date.now() / 1000) }
    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN})
}

export function VerifyJWT(token) {
    try {
        const decoded = jwt.verify(token, JWT_SECRET)
        return { success: true, decoded, error: null }
    } catch (error) {
        return { success: false, decoded: null, error: error.message}
    }
}

export function DecodeJWT(token) {
    try {
        const decoded = jwt.decode(token, { complete: true })
        return { success: true, decoded, error: null }
    } catch (error) {
        return { success: false, decoded: null, error: error.message }
    }
}

export function ExtractUserClaims(token) {
    const { success, decoded, error } = VerifyJWT(token)
    if (!success) {
        return { id: null, role:null, error}
    }
    return { id: decoded.id, role: decoded.role, claims: decoded, error: null }
}

export function IsTokenValid(token) {
    return VerifyJWT(token).success
}