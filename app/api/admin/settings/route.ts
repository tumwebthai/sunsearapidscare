import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { supabaseAdmin } from '@/lib/supabase-admin'

function checkAuth() {
  const token = cookies().get('admin_token')?.value
  if (!token) return false
  return true
}

// GET — ดึง settings ทั้งหมดเป็น key-value object
export async function GET() {
  if (!checkAuth()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data, error } = await supabaseAdmin.from('site_settings').select('key, value')
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const settings: Record<string, string> = {}
  for (const row of data || []) {
    settings[row.key] = row.value
  }
  return NextResponse.json(settings)
}

// PUT — อัพเดทหลาย key พร้อมกัน (upsert)
export async function PUT(request: Request) {
  if (!checkAuth()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body: Record<string, string> = await request.json()
  const rows = Object.entries(body).map(([key, value]) => ({ key, value }))

  const { error } = await supabaseAdmin
    .from('site_settings')
    .upsert(rows, { onConflict: 'key' })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
