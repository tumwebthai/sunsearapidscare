import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

// Public API — ดึงเฉพาะ tracking IDs (ไม่ต้อง auth)
export async function GET() {
  const keys = ['ga4_measurement_id', 'gtm_container_id', 'facebook_pixel_id', 'line_tag_id']

  const { data, error } = await supabaseAdmin
    .from('site_settings')
    .select('key, value')
    .in('key', keys)

  if (error) return NextResponse.json({})

  const result: Record<string, string> = {}
  for (const row of data || []) {
    if (row.value) result[row.key] = row.value
  }
  return NextResponse.json(result)
}
