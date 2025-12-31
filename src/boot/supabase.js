import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || process.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY

console.log('Supabase URL:', supabaseUrl)
console.log('Supabase Key Present:', !!supabaseKey)

export const supabase = createClient(supabaseUrl, supabaseKey)

export default ({ app }) => {
  app.config.globalProperties.$supabase = supabase
}
