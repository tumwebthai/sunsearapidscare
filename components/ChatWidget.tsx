'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { usePathname } from 'next/navigation'

interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp: string
}

const WELCOME_MESSAGE = `สวัสดีค่ะ! 🙏 ดิฉันน้องแซน ผู้ช่วยออนไลน์ของ SunSeaRapidsCare ค่ะ

ยินดีให้บริการเรื่อง:
🚐 เช่ารถตู้ VIP พร้อมคนขับ
✈️ รับส่งสนามบิน
🏖️ ทัวร์ท่องเที่ยวทั่วไทย

สอบถามได้เลยค่ะ!`

const QUICK_REPLIES = [
  '🚐 ดูรถทั้งหมด',
  '✈️ ราคารับส่งสนามบิน',
  '💰 ราคาเช่ารายวัน',
  '📋 วิธีจอง',
]

const STORAGE_KEY = 'ssrc-chat-messages'
const SESSION_KEY = 'ssrc-chat-session'

function getSessionId(): string {
  if (typeof window === 'undefined') return ''
  let sid = sessionStorage.getItem(SESSION_KEY)
  if (!sid) {
    sid = crypto.randomUUID()
    sessionStorage.setItem(SESSION_KEY, sid)
  }
  return sid
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })
}

/* ── SVG Icons ── */
const ChatBubbleSVG = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
)

const SendSVG = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13" />
    <polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
)

const CloseSVG = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
)

export default function ChatWidget() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showQuickReplies, setShowQuickReplies] = useState(true)
  const [lastSentTime, setLastSentTime] = useState(0)
  const [keyboardHeight, setKeyboardHeight] = useState(0)
  const chatEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const chatBodyRef = useRef<HTMLDivElement>(null)

  // Don't render on admin pages
  if (pathname.startsWith('/admin')) return null

  // Load messages from sessionStorage
  useEffect(() => {
    const saved = sessionStorage.getItem(STORAGE_KEY)
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        setMessages(parsed)
        if (parsed.length > 0) setShowQuickReplies(false)
      } catch { /* ignore */ }
    }
  }, [])

  // Auto scroll
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300)
    }
  }, [isOpen])

  // iOS keyboard detection via visualViewport API
  useEffect(() => {
    if (!isOpen) return
    const vv = window.visualViewport
    if (!vv) return

    const handleResize = () => {
      const kbHeight = window.innerHeight - vv.height
      setKeyboardHeight(kbHeight > 50 ? kbHeight : 0)
      // Auto-scroll chat to bottom when keyboard opens
      if (kbHeight > 50) {
        setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100)
      }
    }

    vv.addEventListener('resize', handleResize)
    vv.addEventListener('scroll', handleResize)
    return () => {
      vv.removeEventListener('resize', handleResize)
      vv.removeEventListener('scroll', handleResize)
    }
  }, [isOpen])

  const saveMessages = useCallback((msgs: Message[]) => {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(msgs))
  }, [])

  const handleSubmit = useCallback(async (text?: string) => {
    const msg = (text || inputValue).trim()
    if (!msg || isLoading) return
    if (msg.length > 500) return

    // Rate limit: 2s between messages
    if (Date.now() - lastSentTime < 2000) return

    setLastSentTime(Date.now())
    setInputValue('')
    setShowQuickReplies(false)

    const userMsg: Message = { role: 'user', content: msg, timestamp: new Date().toISOString() }
    const updatedMessages = [...messages, userMsg]
    setMessages(updatedMessages)
    saveMessages(updatedMessages)
    setIsLoading(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedMessages.map((m) => ({ role: m.role, content: m.content })),
          session_id: getSessionId(),
          page_url: window.location.pathname,
        }),
      })

      const data = await res.json()
      const aiMsg: Message = { role: 'assistant', content: data.response, timestamp: new Date().toISOString() }
      const finalMessages = [...updatedMessages, aiMsg]
      setMessages(finalMessages)
      saveMessages(finalMessages)
    } catch {
      const errMsg: Message = {
        role: 'assistant',
        content: 'ขออภัยค่ะ ระบบขัดข้อง กรุณาติดต่อผ่าน LINE @sunsearapidscare ค่ะ 🙏',
        timestamp: new Date().toISOString(),
      }
      const finalMessages = [...updatedMessages, errMsg]
      setMessages(finalMessages)
      saveMessages(finalMessages)
    } finally {
      setIsLoading(false)
    }
  }, [inputValue, isLoading, lastSentTime, messages, saveMessages])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="chat-fab"
          style={{
            position: 'fixed',
            right: 20,
            bottom: 20,
            width: 60,
            height: 60,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #B9973E, #E5C97A)',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 8px 32px rgba(198,167,94,0.4)',
            zIndex: 9998,
            transition: 'transform 0.2s, box-shadow 0.2s',
          }}
        >
          <ChatBubbleSVG />
          {/* Green dot badge */}
          <span style={{
            position: 'absolute',
            top: 2,
            right: 2,
            width: 12,
            height: 12,
            borderRadius: '50%',
            background: '#22C55E',
            border: '2px solid #B9973E',
          }} />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div
          className="chat-window"
          style={{
            position: 'fixed',
            right: 20,
            bottom: 20,
            width: 380,
            height: keyboardHeight > 0 ? `calc(100% - ${keyboardHeight}px)` : 520,
            borderRadius: 20,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 25px 80px rgba(0,0,0,0.5)',
            zIndex: 9999,
            animation: 'chatSlideUp 0.3s ease forwards',
            top: keyboardHeight > 0 ? 0 : undefined,
          }}
        >
          {/* Header */}
          <div style={{
            background: '#0B1C2D',
            padding: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            borderBottom: '1px solid rgba(198,167,94,0.15)',
            flexShrink: 0,
          }}>
            {/* Avatar */}
            <div style={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #B9973E, #E5C97A)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 16,
              fontWeight: 700,
              color: '#0B1C2D',
              flexShrink: 0,
            }}>
              ซ
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ color: '#FFFFFF', fontWeight: 700, fontSize: 14 }}>น้องแซน</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#22C55E' }} />
                <span style={{ fontSize: 11, color: '#22C55E' }}>ออนไลน์</span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              style={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                border: 'none',
                background: 'transparent',
                color: '#9CA3AF',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'background 0.2s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)' }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
            >
              <CloseSVG />
            </button>
          </div>

          {/* Chat Area */}
          <div
            ref={chatBodyRef}
            style={{
            flex: 1,
            overflowY: 'auto',
            background: '#0F1B2E',
            padding: 16,
            scrollBehavior: 'smooth',
            WebkitOverflowScrolling: 'touch',
          }}>
            {/* Welcome message (always shown) */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
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
                  padding: '12px 16px',
                  maxWidth: 280,
                  fontSize: 13,
                  lineHeight: 1.6,
                  whiteSpace: 'pre-line',
                }}>
                  {WELCOME_MESSAGE}
                </div>
              </div>
            </div>

            {/* Quick Replies */}
            {showQuickReplies && messages.length === 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16, paddingLeft: 32 }}>
                {QUICK_REPLIES.map((text) => (
                  <button
                    key={text}
                    onClick={() => handleSubmit(text)}
                    style={{
                      background: 'transparent',
                      border: '1px solid rgba(198,167,94,0.5)',
                      borderRadius: 20,
                      padding: '8px 16px',
                      fontSize: 13,
                      color: '#C6A75E',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(198,167,94,0.1)'
                      e.currentTarget.style.borderColor = '#C6A75E'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent'
                      e.currentTarget.style.borderColor = 'rgba(198,167,94,0.5)'
                    }}
                  >
                    {text}
                  </button>
                ))}
              </div>
            )}

            {/* Messages */}
            {messages.map((msg, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
                  gap: 8,
                  marginBottom: 12,
                }}
              >
                {msg.role === 'assistant' && (
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
                )}
                <div>
                  <div style={{
                    background: msg.role === 'user'
                      ? 'linear-gradient(135deg, rgba(185,151,62,0.3), rgba(229,201,122,0.2))'
                      : '#1A2F45',
                    color: '#FFFFFF',
                    borderRadius: msg.role === 'user' ? '16px 0 16px 16px' : '0 16px 16px 16px',
                    padding: '12px 16px',
                    maxWidth: 280,
                    fontSize: 13,
                    lineHeight: 1.6,
                    whiteSpace: 'pre-line',
                    wordBreak: 'break-word',
                  }}>
                    {msg.content}
                  </div>
                  <div style={{
                    fontSize: 10,
                    color: '#6B7280',
                    marginTop: 4,
                    textAlign: msg.role === 'user' ? 'right' : 'left',
                    paddingLeft: msg.role === 'assistant' ? 4 : 0,
                    paddingRight: msg.role === 'user' ? 4 : 0,
                  }}>
                    {formatTime(msg.timestamp)}
                  </div>
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {isLoading && (
              <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
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
                <div style={{
                  background: '#1A2F45',
                  borderRadius: '0 16px 16px 16px',
                  padding: '12px 20px',
                  display: 'flex',
                  gap: 5,
                  alignItems: 'center',
                }}>
                  <span className="typing-dot" style={{ animationDelay: '0s' }} />
                  <span className="typing-dot" style={{ animationDelay: '0.2s' }} />
                  <span className="typing-dot" style={{ animationDelay: '0.4s' }} />
                </div>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Input Area */}
          <div className="chat-input-area" style={{
            background: '#12263A',
            padding: keyboardHeight > 0 ? '8px 16px' : '12px 16px',
            paddingBottom: keyboardHeight > 0 ? 8 : undefined,
            display: 'flex',
            gap: 12,
            alignItems: 'center',
            borderTop: '1px solid rgba(198,167,94,0.1)',
            flexShrink: 0,
          }}>
            <input
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value.slice(0, 500))}
              onKeyDown={handleKeyDown}
              onFocus={() => {
                // iOS: scroll to bottom when input focused
                setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 300)
              }}
              placeholder="พิมพ์ข้อความ..."
              disabled={isLoading}
              style={{
                flex: 1,
                background: '#1A2F45',
                border: 'none',
                borderRadius: 24,
                padding: '12px 20px',
                color: '#FFFFFF',
                fontSize: 16, // 16px prevents iOS auto-zoom
                outline: 'none',
              }}
            />
            <button
              onClick={() => handleSubmit()}
              disabled={!inputValue.trim() || isLoading}
              style={{
                width: 44,
                height: 44,
                minWidth: 44,
                minHeight: 44,
                borderRadius: '50%',
                background: !inputValue.trim() || isLoading
                  ? 'rgba(198,167,94,0.3)'
                  : 'linear-gradient(135deg, #B9973E, #E5C97A)',
                border: 'none',
                cursor: !inputValue.trim() || isLoading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                transition: 'all 0.2s',
                WebkitTapHighlightColor: 'transparent',
              }}
            >
              <SendSVG />
            </button>
          </div>
        </div>
      )}

      {/* CSS */}
      <style>{`
        .chat-fab {
          animation: chatPulse 3s infinite;
        }
        .chat-fab:hover {
          transform: scale(1.1) !important;
          box-shadow: 0 12px 40px rgba(198,167,94,0.5) !important;
        }
        @keyframes chatPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.08); }
        }
        @keyframes chatSlideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .typing-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #9CA3AF;
          animation: typingBounce 1.2s infinite;
          display: inline-block;
        }
        @keyframes typingBounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-6px); }
        }
        /* Mobile: Bottom nav offset */
        @media (max-width: 640px) {
          .chat-fab {
            bottom: 80px !important;
          }
          .chat-window {
            top: 0 !important;
            left: 0 !important;
            right: 0 !important;
            bottom: 0 !important;
            width: 100% !important;
            height: 100dvh !important;
            border-radius: 0 !important;
          }
        }
        /* iOS safe area: keep input above home bar */
        @supports (padding-bottom: env(safe-area-inset-bottom)) {
          .chat-input-area {
            padding-bottom: calc(8px + env(safe-area-inset-bottom)) !important;
          }
        }
      `}</style>
    </>
  )
}
