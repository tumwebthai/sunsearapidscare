import { createClient } from '@supabase/supabase-js'

// Supabase Admin client — ใช้ service_role key สำหรับฝั่ง server เท่านั้น
// ห้ามใช้ฝั่ง client เด็ดขาด เพราะ service_role มีสิทธิ์เข้าถึงข้อมูลทั้งหมด
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)
