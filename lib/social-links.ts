import { supabaseAdmin } from '@/lib/supabase-admin'
import { SOCIAL_SETTINGS_KEYS, mergeSocialLinks } from '@/lib/social'
import type { SocialLink } from '@/lib/social'

/** Server-side: fetch social URLs from Supabase and merge with metadata */
export async function getSocialLinks(): Promise<SocialLink[]> {
  try {
    const { data } = await supabaseAdmin
      .from('site_settings')
      .select('key, value')
      .in('key', SOCIAL_SETTINGS_KEYS)

    const urls: Record<string, string> = {}
    for (const row of data || []) {
      if (row.value) urls[row.key] = row.value
    }

    return mergeSocialLinks(urls)
  } catch {
    // Fallback to defaults if Supabase not available
    return mergeSocialLinks({})
  }
}
