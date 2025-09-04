import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    {
      cookies: {
        get(name) {
          return cookieStore.get(name)?.value
        },
        set(name, value, options) {
          try {
            cookieStore.set(name, value, options)
          } catch (error) {
            // This is expected behavior when called from SSR context
            console.warn('Failed to set cookie:', name, error.message)
          }
        },
        remove(name, options) {
          try {
            cookieStore.set(name, '', {
              ...options,
              maxAge: 0,
              expires: new Date(0)
            })
          } catch (error) {
            // This will be handled by middleware on next request
            console.warn('Failed to remove cookie:', name, error.message)
          }
        },
      },
    }
  )
}