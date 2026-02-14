import { createClient, SupabaseClient } from '@supabase/supabase-js'

// Supabase Admin client — ใช้ service_role key สำหรับฝั่ง server เท่านั้น
// ห้ามใช้ฝั่ง client เด็ดขาด เพราะ service_role มีสิทธิ์เข้าถึงข้อมูลทั้งหมด
// Lazy-init เพื่อไม่ให้ crash ตอน build (env vars ยังไม่มี)

let _supabaseAdmin: SupabaseClient | null = null

export function getSupabaseAdmin(): SupabaseClient {
  if (!_supabaseAdmin) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (!url || !key) {
      throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
    }
    _supabaseAdmin = createClient(url, key)
  }
  return _supabaseAdmin
}

// Backward-compatible export (getter)
export const supabaseAdmin = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    return (getSupabaseAdmin() as unknown as Record<string | symbol, unknown>)[prop]
  },
})
