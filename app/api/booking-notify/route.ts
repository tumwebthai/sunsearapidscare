import { NextResponse } from 'next/server'
import { sendTelegramNotification } from '@/lib/telegram'

export async function POST(request: Request) {
  const body = await request.json()
  console.log('📋 New booking:', body)

  // Fire-and-forget Telegram notification
  sendTelegramNotification({
    type: 'booking',
    data: {
      reference_number: body.reference_number || 'N/A',
      customer_name: body.customer_name || 'ไม่ระบุ',
      customer_phone: body.customer_phone || '-',
      service_type: body.service_type || '-',
      pickup_location: body.pickup_location || '-',
      dropoff_location: body.dropoff_location || '-',
      travel_date: body.travel_date || '-',
      travel_time: body.travel_time || '-',
      vehicle_name: body.vehicle_name || '-',
      estimated_price: body.estimated_price || 0,
    },
  })

  return NextResponse.json({ success: true })
}
