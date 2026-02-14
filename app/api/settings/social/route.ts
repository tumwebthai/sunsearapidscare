import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { SOCIAL_SETTINGS_KEYS } from '@/lib/social'

// Public API — ดึง social media URLs (ไม่ต้อง auth)
export async function GET() {
  const { data, error } = await supabaseAdmin
    .from('site_settings')
    .select('key, value')
    .in('key', SOCIAL_SETTINGS_KEYS)

  if (error) return NextResponse.json({})

  const result: Record<string, string> = {}
  for (const row of data || []) {
    if (row.value) result[row.key] = row.value
  }

  return NextResponse.json(result, {
    headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300' },
  })
}
