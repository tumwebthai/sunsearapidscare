import type { Metadata } from 'next'
import { FLEET, ROUTES, SITE_NAME, SITE_URL, LINE_URL, PHONE, PHONE_RAW, WHATSAPP_URL } from '@/lib/data'
import Navbar from '@/components/Navbar'
import Breadcrumb from '@/components/Breadcrumb'
import Footer from '@/components/Footer'
import StickyBottomNav from '@/components/StickyBottomNav'
import BookingForm from './BookingForm'

export const metadata: Metadata = {
  title: `จองรถตู้ VIP พร้อมคนขับ | จองด่วนหรือออนไลน์ | ${SITE_NAME}`,
  description: 'จองเช่ารถตู้ VIP พร้อมคนขับ รับส่งสนามบิน ท่องเที่ยวทั่วไทย จองง่ายผ่านเว็บ ตอบกลับภายใน 30 นาที ราคาโปร่งใส',
  keywords: 'จองรถตู้ VIP, จองรถรับส่งสนามบิน, เช่ารถตู้พร้อมคนขับ, booking van VIP',
  openGraph: {
    title: `จองรถตู้ VIP ออนไลน์ | ${SITE_NAME}`,
    description: 'จองง่ายผ่านเว็บ ตอบกลับภายใน 30 นาที',
    url: `${SITE_URL}/booking`,
    type: 'website',
    locale: 'th_TH',
    siteName: SITE_NAME,
  },
  alternates: { canonical: `${SITE_URL}/booking` },
}

export default function BookingPage() {
  return (
    <main style={{ background: 'var(--navy-900)', minHeight: '100vh' }}>
      <Navbar />
      <div style={{ paddingTop: 80 }}>
        <Breadcrumb items={[{ label: 'จองรถ' }]} />
        <BookingForm
          fleet={FLEET}
          routes={ROUTES}
          lineUrl={LINE_URL}
          phone={PHONE}
          phoneRaw={PHONE_RAW}
          whatsappUrl={WHATSAPP_URL}
        />
      </div>
      <Footer />
      <StickyBottomNav />
    </main>
  )
}
