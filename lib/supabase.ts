import { createClient } from '@supabase/supabase-js'

// ดึง URL และ Anon Key จาก Environment Variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// สร้าง Supabase client สำหรับใช้งานทั่วไป (ฝั่ง client และ server)
export const supabase = createClient(supabaseUrl, supabaseAnonKey)
