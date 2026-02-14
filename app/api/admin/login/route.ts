import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const { password } = await request.json()

  if (password === process.env.ADMIN_PASSWORD) {
    // สร้าง token แบบง่าย (timestamp + random)
    const token = `admin-session-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`

    const response = NextResponse.json({ success: true, token })
    response.cookies.set('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24, // 24 ชั่วโมง
    })

    return response
  }

  return NextResponse.json({ success: false }, { status: 401 })
}
