import type { Metadata } from 'next'
import { FLEET, SITE_NAME, SITE_URL, LINE_URL } from '@/lib/data'
import Navbar from '@/components/Navbar'
import Breadcrumb from '@/components/Breadcrumb'
import Footer from '@/components/Footer'
import StickyBottomNav from '@/components/StickyBottomNav'
import FleetClient from './FleetClient'

export const metadata: Metadata = {
  title: `รถของเรา | ${SITE_NAME} — เลือกรถ VIP และรถเก๋งที่เหมาะกับคุณ`,
  description: 'เลือกรถตู้ VIP และรถเก๋ง Sedan พร้อมคนขับ Toyota Commuter, Hyundai H1, Alphard, Majesty, Staria, Honda Accord, Toyota Camry ราคาเริ่ม 1,200 บาท รวมน้ำมัน ทางด่วน คนขับ',
  keywords: 'เช่ารถตู้ VIP, เช่ารถเก๋งพร้อมคนขับ, Toyota Commuter, Hyundai H1, Alphard, Majesty, Staria, Honda Accord, Toyota Camry, รถตู้พร้อมคนขับ, รถเก๋งรับส่งสนามบิน',
  openGraph: {
    title: `รถของเรา | ${SITE_NAME}`,
    description: 'เลือกรถตู้ VIP และรถเก๋ง Sedan พร้อมคนขับ 8 รุ่น ราคาเริ่ม 1,200 บาท',
    url: `${SITE_URL}/fleet`,
    type: 'website',
    locale: 'th_TH',
    siteName: SITE_NAME,
  },
  alternates: { canonical: `${SITE_URL}/fleet` },
}

export default function FleetPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'รถตู้ VIP พร้อมคนขับ — SunSeaRapidsCare',
    numberOfItems: FLEET.length,
    itemListElement: FLEET.map((v, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: `${SITE_URL}/fleet/${v.slug}`,
      name: `${v.name} (${v.type})`,
    })),
  }

  return (
    <main style={{ background: 'var(--navy-900)', minHeight: '100vh' }}>
      <Navbar />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div style={{ paddingTop: 80 }}>
        <Breadcrumb items={[{ label: 'รถของเรา' }]} />

        <section style={{ padding: '40px 24px 120px', maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <span style={{ color: '#C6A75E', fontSize: 13, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', display: 'block', marginBottom: 12 }}>Our Fleet</span>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 700, color: '#FFFFFF', margin: 0 }}>
              เลือกรถ<span className="gold-shimmer">ที่เหมาะกับคุณ</span>
            </h1>
            <p style={{ color: '#9CA3AF', fontSize: 16, marginTop: 12, maxWidth: 600, margin: '12px auto 0' }}>
              รถทุกคันตรวจสภาพทุกเช้า คนขับผ่านการอบรม ราคารวมทุกอย่าง
            </p>
            <div style={{ width: 60, height: 3, background: 'linear-gradient(90deg, #B9973E, #E5C97A)', margin: '20px auto 0', borderRadius: 2 }} />
          </div>

          <FleetClient fleet={FLEET} lineUrl={LINE_URL} />
        </section>
      </div>

      <Footer />
      <StickyBottomNav />
    </main>
  )
}
