import { cookies } from 'next/headers'
import { IsTokenValid, VerifyJWT } from './jwt.js'

const COOKIE_NAME = 'auth-token'
const COOKIE_OPTIONS = { 
    httpOnly: true, 
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 24 * 60 * 60
}

export async function SetJWTinCookie(token) {
    try {
        const cookieStore = cookies()
        cookieStore.set(COOKIE_NAME, token, COOKIE_OPTIONS)
        return { success: true, error: null }
    } catch (error) {
        return { success: false, error: error.message }
    }
}

export async function GetJWTfromCookie() {
    try {
        const cookieStore = cookies()
        const token = cookieStore.get(COOKIE_NAME)
        if (!token) {
            return { token: null, error: 'Token not found' }
        }
        return { token: token.value, error: null }
    } catch (error) {
        return { token: null, error: error.message }
    }
}

export async function ClearJWTCookie() {
    try {
        const cookieStore = cookies()
        cookieStore.delete(COOKIE_NAME)
        return { success: true, error: null }
    } catch (error) {
        return { success: false, error: error.message }
    }
}

export async function GetVerifyTokenfromCookie() {
    const { token, error } = await GetJWTfromCookie()
    if (!token || error) {
        return { token: null, decoded: null, error: error || 'Token not found' }
    }
    const { success, decoded, error: verifyError } = VerifyJWT(token)
    if (!success) {
        return { token: null, decoded: null, error: verifyError }
    }
    return { token, decoded, error: null }
}

export async function ISAuthenticated() {
    const { token, error } = await GetJWTfromCookie()
    if (!token || error) {
        return false
    }
    return IsTokenValid(token)
}

export async function SetCustomCookie(token, customOptions = {}) {
    try {
        const cookieStore = cookies()
        const options = { ...COOKIE_OPTIONS, ...customOptions }
        cookieStore.set(COOKIE_NAME, token, options)
        return { success: true, error: null }
    } catch (error) {
        return { success: false, error: error.message }
    }
}