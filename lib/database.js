import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

// Load env for .env.local
dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_KEY

console.log('Supabase URL:', supabaseUrl) // Debug log
console.log('Supabase Key:', supabaseKey ? 'Loaded' : 'Not loaded') // Debug log

export function InitializeSupabase() {
  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing Supabase URL or Key in environment variables')
  }
  try {
    const supabase = createClient(supabaseUrl, supabaseKey)
    return supabase
  } catch (error) {
    console.error('Error initializing Supabase client:', error)
    return null
  }
  
}
