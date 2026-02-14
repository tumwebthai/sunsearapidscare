import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { supabaseAdmin } from '@/lib/supabase-admin'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  // Auth check
  const cookieStore = await cookies()
  const token = cookieStore.get('admin_token')?.value
  if (token !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const channel = searchParams.get('channel') || 'all'
  const search = searchParams.get('search') || ''
  const limit = Math.min(parseInt(searchParams.get('limit') || '100'), 500)

  try {
    // Get all chat logs
    let query = supabaseAdmin
      .from('chat_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit)

    if (channel !== 'all') {
      query = query.eq('channel', channel)
    }

    if (search) {
      query = query.or(`customer_message.ilike.%${search}%,ai_response.ilike.%${search}%`)
    }

    const { data: logs, error } = await query

    if (error) throw error

    // Group by session
    const sessionMap = new Map<string, {
      session_id: string
      channel: string
      language: string
      page_url: string
      first_message: string
      last_message_at: string
      first_message_at: string
      message_count: number
      messages: typeof logs
    }>()

    for (const log of logs || []) {
      const sid = log.session_id
      if (!sessionMap.has(sid)) {
        sessionMap.set(sid, {
          session_id: sid,
          channel: log.channel,
          language: log.language || 'th',
          page_url: log.page_url || '/',
          first_message: log.customer_message,
          last_message_at: log.created_at,
          first_message_at: log.created_at,
          message_count: 0,
          messages: [],
        })
      }
      const session = sessionMap.get(sid)!
      session.message_count++
      session.messages.push(log)
      // Track first and last message times
      if (log.created_at < session.first_message_at) {
        session.first_message_at = log.created_at
        session.first_message = log.customer_message
      }
      if (log.created_at > session.last_message_at) {
        session.last_message_at = log.created_at
      }
    }

    // Sort messages within each session by time ascending
    Array.from(sessionMap.values()).forEach((session) => {
      session.messages.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
    })

    const sessions = Array.from(sessionMap.values())
      .sort((a, b) => new Date(b.last_message_at).getTime() - new Date(a.last_message_at).getTime())

    // Stats
    const today = new Date().toISOString().split('T')[0]
    const todaySessions = new Set<string>()
    const channelCounts: Record<string, number> = {}

    for (const log of logs || []) {
      if (log.created_at?.startsWith(today)) {
        todaySessions.add(log.session_id)
      }
      channelCounts[log.channel] = (channelCounts[log.channel] || 0) + 1
    }

    return NextResponse.json({
      sessions,
      stats: {
        total_today: todaySessions.size,
        total_all: sessions.length,
        by_channel: channelCounts,
      },
    })
  } catch (err) {
    console.error('Admin chats error:', err)
    return NextResponse.json({ error: 'Failed to fetch chats' }, { status: 500 })
  }
}
