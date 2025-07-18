
import { createClient as createSupabaseClient } from '@supabase/supabase-js'

// IMPORTANT: Create a .env.local file in your project root
// and add your Supabase URL and Anon Key there.
// NEXT_PUBLIC_SUPABASE_URL=YOUR_SUPABASE_URL
// NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export function createClient() {
    if (!supabaseUrl || !supabaseAnonKey) {
        throw new Error('Missing Supabase URL or Anon Key in .env.local')
    }
    
    return createSupabaseClient(supabaseUrl, supabaseAnonKey)
}
