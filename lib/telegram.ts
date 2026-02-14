const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
const CHAT_ID = process.env.TELEGRAM_CHAT_ID

function formatThaiDate(): string {
  return new Date().toLocaleString('th-TH', {
    timeZone: 'Asia/Bangkok',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function escapeHtml(text: string): string {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

interface ChatNotification {
  customer_message: string
  ai_response: string
  page_url?: string
  language?: string
}

interface BookingNotification {
  reference_number: string
  customer_name: string
  customer_phone: string
  service_type: string
  pickup_location: string
  dropoff_location: string
  travel_date: string
  travel_time: string
  vehicle_name: string
  estimated_price: number
}

export function sendTelegramNotification({
  type,
  data,
}: {
  type: 'chat'
  data: ChatNotification
} | {
  type: 'booking'
  data: BookingNotification
}): void {
  if (!BOT_TOKEN || !CHAT_ID) return

  let text = ''

  if (type === 'chat') {
    const d = data as ChatNotification
    text = [
      `🌐 <b>Web แชทใหม่</b>`,
      `⏰ ${formatThaiDate()}`,
      ``,
      `👤 <b>ลูกค้า:</b>`,
      escapeHtml(d.customer_message),
      ``,
      `🤖 <b>น้องแซน:</b>`,
      escapeHtml(d.ai_response.substring(0, 500)),
      ``,
      `🌐 ภาษา: ${d.language || 'th'} | 📱 ${d.page_url || '/'}`,
    ].join('\n')
  } else {
    const d = data as BookingNotification
    text = [
      `📋 <b>Booking ใหม่!</b> #${escapeHtml(d.reference_number)}`,
      `⏰ ${formatThaiDate()}`,
      `👤 ${escapeHtml(d.customer_name)} | 📞 ${escapeHtml(d.customer_phone)}`,
      `🚐 ${escapeHtml(d.service_type)}: ${escapeHtml(d.pickup_location)} → ${escapeHtml(d.dropoff_location)}`,
      `📅 ${escapeHtml(d.travel_date)} ${escapeHtml(d.travel_time)}`,
      `🚗 ${escapeHtml(d.vehicle_name)} | 💰 ฿${d.estimated_price.toLocaleString()}`,
    ].join('\n')
  }

  // Fire-and-forget
  fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: CHAT_ID,
      text,
      parse_mode: 'HTML',
    }),
  }).catch((err) => {
    console.error('Telegram notification error:', err)
  })
}
