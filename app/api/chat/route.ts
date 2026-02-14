import { NextResponse } from 'next/server'
import { generateAIResponse } from '@/lib/ai-engine'
import { sendTelegramNotification } from '@/lib/telegram'
import { supabaseAdmin } from '@/lib/supabase-admin'

function detectLanguage(text: string): string {
  if (/[\u0E00-\u0E7F]/.test(text)) return 'th'
  if (/[\u4E00-\u9FFF]/.test(text)) return 'zh'
  if (/[\u3040-\u309F\u30A0-\u30FF]/.test(text)) return 'ja'
  if (/[\uAC00-\uD7AF]/.test(text)) return 'ko'
  return 'en'
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { messages, session_id, page_url } = body

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ response: 'ข้อความไม่ถูกต้อง' }, { status: 400 })
    }

    const lastMessage = messages[messages.length - 1]
    if (!lastMessage?.content || lastMessage.content.length > 500) {
      return NextResponse.json({ response: 'ข้อความยาวเกินไป กรุณาพิมพ์ไม่เกิน 500 ตัวอักษร' }, { status: 400 })
    }

    if (messages.length > 50) {
      return NextResponse.json({
        response: 'บทสนทนายาวเกินไปค่ะ กรุณาติดต่อทีมงานผ่าน LINE @sunsearapidscare ค่ะ 🙏',
      })
    }

    // Build history (exclude last message)
    const history = messages.slice(0, -1).map((m: { role: string; content: string }) => ({
      role: m.role as 'user' | 'assistant',
      content: m.content,
    }))

    const result = await generateAIResponse({
      message: lastMessage.content,
      history,
      sessionId: session_id || 'unknown',
    })

    // Fire-and-forget: Telegram notification
    sendTelegramNotification({
      type: 'chat',
      data: {
        customer_message: lastMessage.content,
        ai_response: result.response,
        page_url: page_url || '/',
        language: detectLanguage(lastMessage.content),
      },
    })

    // Fire-and-forget: Save to chat_logs
    supabaseAdmin
      .from('chat_logs')
      .insert({
        session_id: session_id || 'unknown',
        channel: 'web',
        customer_message: lastMessage.content,
        ai_response: result.response,
        language: detectLanguage(lastMessage.content),
        page_url: page_url || '/',
      })
      .then(({ error }) => { if (error) console.error('Chat log insert error:', error) })

    return NextResponse.json({ response: result.response })
  } catch (err) {
    console.error('Chat API error:', err)
    return NextResponse.json({
      response: 'ขออภัยค่ะ ระบบขัดข้อง กรุณาติดต่อผ่าน LINE @sunsearapidscare ค่ะ 🙏',
    })
  }
}
