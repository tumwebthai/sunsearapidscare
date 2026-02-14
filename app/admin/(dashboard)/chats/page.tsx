'use client'

import { useState, useEffect, useCallback } from 'react'

interface ChatLog {
  id: string
  session_id: string
  channel: string
  customer_message: string
  ai_response: string
  language: string
  page_url: string
  created_at: string
}

interface ChatSession {
  session_id: string
  channel: string
  language: string
  page_url: string
  first_message: string
  last_message_at: string
  first_message_at: string
  message_count: number
  messages: ChatLog[]
}

interface Stats {
  total_today: number
  total_all: number
  by_channel: Record<string, number>
}

const CHANNEL_ICONS: Record<string, string> = {
  web: '🌐',
  line: '💚',
  facebook: '🔵',
}

const LANG_LABELS: Record<string, string> = {
  th: 'TH',
  en: 'EN',
  zh: 'ZH',
  ja: 'JA',
  ko: 'KO',
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleString('th-TH', {
    timeZone: 'Asia/Bangkok',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function formatTimeShort(iso: string): string {
  return new Date(iso).toLocaleTimeString('th-TH', {
    timeZone: 'Asia/Bangkok',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const cardStyle: React.CSSProperties = {
  background: '#12263A',
  borderRadius: 16,
  border: '1px solid rgba(198,167,94,0.08)',
  padding: 20,
}

export default function ChatsPage() {
  const [sessions, setSessions] = useState<ChatSession[]>([])
  const [stats, setStats] = useState<Stats>({ total_today: 0, total_all: 0, by_channel: {} })
  const [loading, setLoading] = useState(true)
  const [selectedSession, setSelectedSession] = useState<ChatSession | null>(null)
  const [channelFilter, setChannelFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [langFilter, setLangFilter] = useState('all')

  const fetchChats = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (channelFilter !== 'all') params.set('channel', channelFilter)
      if (searchQuery) params.set('search', searchQuery)

      const res = await fetch(`/api/admin/chats?${params}`)
      if (res.ok) {
        const data = await res.json()
        setSessions(data.sessions || [])
        setStats(data.stats || { total_today: 0, total_all: 0, by_channel: {} })
      }
    } catch (err) {
      console.error('Failed to fetch chats:', err)
    }
    setLoading(false)
  }, [channelFilter, searchQuery])

  useEffect(() => {
    fetchChats()
  }, [fetchChats])

  const filteredSessions = langFilter === 'all'
    ? sessions
    : sessions.filter((s) => s.language === langFilter)

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 700, color: '#FFFFFF', marginBottom: 4 }}>
          Chat Logs
        </h1>
        <p style={{ fontSize: 14, color: '#9CA3AF' }}>ประวัติการสนทนาจาก AI Chatbot</p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 24 }}>
        <div style={cardStyle}>
          <div style={{ fontSize: 12, color: '#9CA3AF', marginBottom: 4 }}>แชทวันนี้</div>
          <div style={{ fontSize: 28, fontWeight: 700, color: '#C6A75E' }}>{stats.total_today}</div>
          <div style={{ fontSize: 11, color: '#6B7280' }}>sessions</div>
        </div>
        <div style={cardStyle}>
          <div style={{ fontSize: 12, color: '#9CA3AF', marginBottom: 4 }}>แชททั้งหมด</div>
          <div style={{ fontSize: 28, fontWeight: 700, color: '#FFFFFF' }}>{stats.total_all}</div>
          <div style={{ fontSize: 11, color: '#6B7280' }}>sessions</div>
        </div>
        <div style={cardStyle}>
          <div style={{ fontSize: 12, color: '#9CA3AF', marginBottom: 8 }}>แยกตามช่องทาง</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
            {Object.entries(stats.by_channel).map(([ch, count]) => (
              <span key={ch} style={{ fontSize: 13, color: '#9CA3AF' }}>
                {CHANNEL_ICONS[ch] || '📱'} {ch.toUpperCase()} <span style={{ color: '#FFFFFF', fontWeight: 600 }}>{count}</span>
              </span>
            ))}
            {Object.keys(stats.by_channel).length === 0 && (
              <span style={{ fontSize: 12, color: '#6B7280' }}>ยังไม่มีข้อมูล</span>
            )}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div style={{ ...cardStyle, marginBottom: 24, display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
        <select
          value={channelFilter}
          onChange={(e) => setChannelFilter(e.target.value)}
          style={{
            background: '#1A2F45',
            border: '1px solid rgba(198,167,94,0.3)',
            borderRadius: 10,
            padding: '8px 14px',
            color: '#FFFFFF',
            fontSize: 13,
            outline: 'none',
          }}
        >
          <option value="all">All Channels</option>
          <option value="web">🌐 Web</option>
          <option value="line">💚 LINE</option>
          <option value="facebook">🔵 Facebook</option>
        </select>

        <select
          value={langFilter}
          onChange={(e) => setLangFilter(e.target.value)}
          style={{
            background: '#1A2F45',
            border: '1px solid rgba(198,167,94,0.3)',
            borderRadius: 10,
            padding: '8px 14px',
            color: '#FFFFFF',
            fontSize: 13,
            outline: 'none',
          }}
        >
          <option value="all">All Languages</option>
          <option value="th">🇹🇭 TH</option>
          <option value="en">🇬🇧 EN</option>
          <option value="zh">🇨🇳 ZH</option>
          <option value="ja">🇯🇵 JA</option>
          <option value="ko">🇰🇷 KO</option>
        </select>

        <input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="ค้นหาข้อความ..."
          style={{
            flex: 1,
            minWidth: 200,
            background: '#1A2F45',
            border: '1px solid rgba(198,167,94,0.3)',
            borderRadius: 10,
            padding: '8px 14px',
            color: '#FFFFFF',
            fontSize: 13,
            outline: 'none',
          }}
          onKeyDown={(e) => e.key === 'Enter' && fetchChats()}
        />

        <button
          onClick={fetchChats}
          style={{
            padding: '8px 20px',
            background: 'linear-gradient(135deg, #B9973E, #E5C97A)',
            border: 'none',
            borderRadius: 10,
            color: '#0B1C2D',
            fontSize: 13,
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          ค้นหา
        </button>
      </div>

      {/* Loading */}
      {loading && (
        <div style={{ textAlign: 'center', padding: 48 }}>
          <div style={{ fontSize: 24, color: '#C6A75E', animation: 'pulse 1.5s infinite' }}>⏳</div>
          <p style={{ fontSize: 14, color: '#9CA3AF', marginTop: 8 }}>กำลังโหลด...</p>
        </div>
      )}

      {/* 2-Column Layout */}
      {!loading && (
        <div className="chat-logs-layout" style={{ display: 'grid', gridTemplateColumns: '360px 1fr', gap: 16, minHeight: 500 }}>
          {/* Left: Session List */}
          <div style={{ ...cardStyle, padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '16px 16px 12px', borderBottom: '1px solid rgba(198,167,94,0.08)' }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: '#9CA3AF' }}>
                {filteredSessions.length} บทสนทนา
              </span>
            </div>
            <div style={{ flex: 1, overflowY: 'auto' }}>
              {filteredSessions.length === 0 && (
                <div style={{ padding: 32, textAlign: 'center', color: '#6B7280', fontSize: 13 }}>
                  ยังไม่มีบทสนทนา
                </div>
              )}
              {filteredSessions.map((session) => {
                const isActive = selectedSession?.session_id === session.session_id
                return (
                  <button
                    key={session.session_id}
                    onClick={() => setSelectedSession(session)}
                    style={{
                      width: '100%',
                      padding: '14px 16px',
                      background: isActive ? '#1A2F45' : 'transparent',
                      borderLeft: isActive ? '3px solid #C6A75E' : '3px solid transparent',
                      border: 'none',
                      borderBottom: '1px solid rgba(198,167,94,0.05)',
                      cursor: 'pointer',
                      textAlign: 'left',
                      display: 'flex',
                      gap: 10,
                      alignItems: 'flex-start',
                      transition: 'background 0.15s',
                    }}
                  >
                    <span style={{ fontSize: 16, flexShrink: 0, marginTop: 2 }}>
                      {CHANNEL_ICONS[session.channel] || '📱'}
                    </span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{
                        fontSize: 13,
                        color: isActive ? '#FFFFFF' : '#D1D5DB',
                        fontWeight: isActive ? 600 : 400,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}>
                        {session.first_message?.substring(0, 60) || 'ไม่มีข้อความ'}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
                        <span style={{ fontSize: 11, color: '#6B7280' }}>
                          {formatTime(session.last_message_at)}
                        </span>
                        <span style={{
                          fontSize: 10,
                          background: 'rgba(198,167,94,0.15)',
                          color: '#C6A75E',
                          padding: '1px 6px',
                          borderRadius: 8,
                        }}>
                          {session.message_count} msg
                        </span>
                        <span style={{
                          fontSize: 10,
                          background: 'rgba(99,102,241,0.15)',
                          color: '#818CF8',
                          padding: '1px 6px',
                          borderRadius: 8,
                        }}>
                          {LANG_LABELS[session.language] || session.language}
                        </span>
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Right: Conversation Detail */}
          <div style={{ ...cardStyle, display: 'flex', flexDirection: 'column' }}>
            {!selectedSession ? (
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 12 }}>
                <span style={{ fontSize: 48, opacity: 0.3 }}>💬</span>
                <p style={{ fontSize: 14, color: '#6B7280' }}>เลือกบทสนทนาเพื่อดูรายละเอียด</p>
              </div>
            ) : (
              <>
                {/* Session Info */}
                <div style={{
                  padding: '12px 16px',
                  borderBottom: '1px solid rgba(198,167,94,0.08)',
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 16,
                  fontSize: 12,
                  color: '#9CA3AF',
                  flexShrink: 0,
                }}>
                  <span>{CHANNEL_ICONS[selectedSession.channel]} {selectedSession.channel.toUpperCase()}</span>
                  <span>🕐 เริ่ม {formatTime(selectedSession.first_message_at)}</span>
                  <span>💬 {selectedSession.message_count} ข้อความ</span>
                  <span>🌐 {LANG_LABELS[selectedSession.language] || selectedSession.language}</span>
                  <span>📱 {selectedSession.page_url}</span>
                </div>

                {/* Messages */}
                <div style={{ flex: 1, overflowY: 'auto', padding: 16 }}>
                  {selectedSession.messages.map((msg, i) => (
                    <div key={i}>
                      {/* Customer Message */}
                      <div style={{ display: 'flex', flexDirection: 'row-reverse', gap: 8, marginBottom: 8 }}>
                        <div>
                          <div style={{
                            background: 'linear-gradient(135deg, rgba(185,151,62,0.3), rgba(229,201,122,0.2))',
                            color: '#FFFFFF',
                            borderRadius: '16px 0 16px 16px',
                            padding: '10px 14px',
                            maxWidth: 400,
                            fontSize: 13,
                            lineHeight: 1.6,
                            whiteSpace: 'pre-line',
                            wordBreak: 'break-word',
                          }}>
                            {msg.customer_message}
                          </div>
                          <div style={{ fontSize: 10, color: '#6B7280', textAlign: 'right', marginTop: 2 }}>
                            {formatTimeShort(msg.created_at)}
                          </div>
                        </div>
                      </div>

                      {/* AI Response */}
                      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
                        <div style={{
                          width: 24,
                          height: 24,
                          borderRadius: '50%',
                          background: 'linear-gradient(135deg, #B9973E, #E5C97A)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: 10,
                          fontWeight: 700,
                          color: '#0B1C2D',
                          flexShrink: 0,
                          marginTop: 2,
                        }}>
                          ซ
                        </div>
                        <div>
                          <div style={{
                            background: '#1A2F45',
                            color: '#FFFFFF',
                            borderRadius: '0 16px 16px 16px',
                            padding: '10px 14px',
                            maxWidth: 400,
                            fontSize: 13,
                            lineHeight: 1.6,
                            whiteSpace: 'pre-line',
                            wordBreak: 'break-word',
                          }}>
                            {msg.ai_response}
                          </div>
                          <div style={{ fontSize: 10, color: '#6B7280', marginTop: 2 }}>
                            🤖 น้องแซน
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 900px) {
          .chat-logs-layout {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  )
}
