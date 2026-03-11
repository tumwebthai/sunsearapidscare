import type { Metadata } from 'next'
import { SITE_NAME, SITE_URL, PHONE_RAW } from '@/lib/data'
import Navbar from '@/components/Navbar'
import Breadcrumb from '@/components/Breadcrumb'
import Footer from '@/components/Footer'
import StickyBottomNav from '@/components/StickyBottomNav'

export const metadata: Metadata = {
  title: `รับส่งสนามบินเชียงใหม่ | ${SITE_NAME}`,
  description: 'บริการรถรับส่งสนามบินเชียงใหม่ พร้อมคนขับ รถตู้ VIP ราคาเหมาจ่าย เริ่มต้น ฿900 นิมมาน โอลด์ทาวน์ แม่ริม สะเมิง ม่อนแจ่ม ตรงเวลา ปลอดภัย',
  keywords: 'รับส่งสนามบินเชียงใหม่, เชียงใหม่ airport transfer, รถรับส่งสนามบิน CNX, รถตู้เชียงใหม่, รับส่งนิมมาน, รับส่งม่อนแจ่ม',
  openGraph: {
    title: `รับส่งสนามบินเชียงใหม่ | ${SITE_NAME}`,
    description: 'บริการรถรับส่งสนามบินเชียงใหม่ พร้อมคนขับ ราคาเหมาจ่าย เริ่มต้น ฿900 ตรงเวลา ปลอดภัย',
    url: `${SITE_URL}/chiangmai-airport-transfer`,
    type: 'website',
    locale: 'th_TH',
    siteName: SITE_NAME,
  },
  alternates: { canonical: `${SITE_URL}/chiangmai-airport-transfer` },
}

const ROUTES = [
  { to: 'นิมมาน / โอลด์ทาวน์ / ช้างคลาน / ไนท์บาซาร์', price: '900' },
  { to: 'ซุปเปอร์ไฮเวย์ / สันติธรรม / วัดดอนจั่น / ช้างม่อย', price: '900' },
  { to: 'ศูนย์ราชการ / แม่ริม (ไม่ถึงแม่สา)', price: '1,000' },
  { to: 'สะเมิง / วีรันดา / ฟลอร่า / คลิก', price: '1,300' },
  { to: 'แม่ริม-แม่สา / ม่อนแจ่ม', price: '1,500' },
]

const STEPS = [
  { num: '1', title: 'แจ้งรายละเอียด', desc: 'แจ้งวันเวลา เที่ยวบิน จำนวนผู้โดยสาร จุดรับ-ส่ง ผ่าน LINE หรือโทร' },
  { num: '2', title: 'ยืนยันการจอง', desc: 'รับใบเสนอราคา ยืนยันการจอง มัดจำ 30% ที่เหลือจ่ายวันเดินทาง' },
  { num: '3', title: 'รับข้อมูลคนขับ', desc: 'ได้รับชื่อคนขับ เบอร์โทร ทะเบียนรถ 24 ชม. ก่อนเดินทาง' },
  { num: '4', title: 'คนขับรอรับ', desc: 'คนขับถึงล่วงหน้า 15-20 นาที พร้อมป้ายชื่อรอรับที่จุดนัดหมาย' },
]

const FAQ = [
  { q: 'คนขับจะรอรับที่ไหน?', a: 'คนขับจะรอพร้อมป้ายชื่อที่ประตูทางออกผู้โดยสารขาเข้า สนามบินเชียงใหม่ (CNX)' },
  { q: 'ถ้าเที่ยวบินดีเลย์ คิดค่าใช้จ่ายเพิ่มไหม?', a: 'ไม่คิดเพิ่มครับ เราติดตามเที่ยวบินแบบ Real-time คนขับจะปรับเวลารอรับตามเวลาลงจริง' },
  { q: 'จองรถรับส่งสนามบินล่วงหน้ากี่วัน?', a: 'แนะนำจองล่วงหน้าอย่างน้อย 1 วัน หากเร่งด่วนสอบถามได้ตลอด 24 ชม.' },
  { q: 'ราคารวมค่าอะไรบ้าง?', a: 'ราคาเหมาจ่าย รวมค่าน้ำมัน ค่าจอดรถ คนขับ ไม่มีค่าใช้จ่ายแฝง' },
  { q: 'รถตู้ใช้รุ่นอะไร?', a: 'รถตู้ VIP ให้บริการโดยซัพพลายเออร์ท้องถิ่นที่ได้มาตรฐาน สะอาด ปลอดภัย' },
  { q: 'มีบริการรับส่งตอนดึกหรือเช้ามืดไหม?', a: 'มีครับ ให้บริการ 24 ชั่วโมง ไม่ว่าจะเที่ยวบินดึกหรือเช้ามืด คนขับพร้อมรอรับทุกเวลา' },
]

export default function ChiangmaiAirportTransferPage() {
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  }

  const serviceJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'บริการรับส่งสนามบินเชียงใหม่ — SunSeaRapidsCare',
    description: 'บริการรถรับส่งสนามบินเชียงใหม่ พร้อมคนขับ ราคาเหมาจ่าย ตรงเวลา ปลอดภัย',
    provider: { '@type': 'LocalBusiness', name: SITE_NAME, url: SITE_URL },
    areaServed: { '@type': 'City', name: 'Chiang Mai' },
    serviceType: 'Airport Transfer',
  }

  return (
    <main style={{ background: 'var(--navy-900)', minHeight: '100vh' }}>
      <Navbar />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }} />

      <div style={{ paddingTop: 80 }}>
        <Breadcrumb items={[{ label: 'รับส่งสนามบิน', href: '/airport-transfer' }, { label: 'เชียงใหม่' }]} />

        <section style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 24px 120px' }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <span style={{ color: '#C6A75E', fontSize: 13, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', display: 'block', marginBottom: 12 }}>Chiang Mai Airport Transfer</span>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 700, color: '#FFFFFF', margin: 0 }}>
              บริการรถรับส่ง<span className="gold-shimmer">สนามบินเชียงใหม่</span> พร้อมคนขับ
            </h1>
            <p style={{ color: '#9CA3AF', fontSize: 16, marginTop: 12, maxWidth: 600, margin: '12px auto 0' }}>
              รถตู้ VIP ราคาเหมาจ่าย ไม่มีค่าใช้จ่ายแฝง ตรงเวลา ป้ายชื่อรอรับ
            </p>
            <div style={{ width: 60, height: 3, background: 'linear-gradient(90deg, #B9973E, #E5C97A)', margin: '20px auto 0', borderRadius: 2 }} />
          </div>

          {/* Pricing Table */}
          <div style={{ marginBottom: 60, overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0, minWidth: 500 }}>
              <thead>
                <tr>
                  {['เส้นทาง', 'ปลายทาง', 'ราคา (รถตู้)'].map((h, i) => (
                    <th key={i} style={{ padding: '16px 20px', background: '#12263A', color: '#C6A75E', fontSize: 13, fontWeight: 700, textAlign: 'left', borderBottom: '2px solid rgba(198,167,94,0.2)', ...(i === 0 ? { borderRadius: '12px 0 0 0' } : i === 2 ? { borderRadius: '0 12px 0 0' } : {}) }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ROUTES.map((r, i) => (
                  <tr key={i} style={{ background: i % 2 === 0 ? 'rgba(18,38,58,0.5)' : 'transparent' }}>
                    <td style={{ padding: '14px 20px', fontSize: 14, color: '#F5F5F5', fontWeight: 600 }}>สนามบินเชียงใหม่ (CNX)</td>
                    <td style={{ padding: '14px 20px', fontSize: 14, color: '#F5F5F5' }}>{r.to}</td>
                    <td style={{ padding: '14px 20px', fontSize: 14 }}>
                      <span style={{ color: '#C6A75E', fontWeight: 700, fontSize: 18 }}>฿{r.price}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p style={{ fontSize: 13, color: '#9CA3AF', marginTop: 12, textAlign: 'center', lineHeight: 1.7 }}>
              ราคารวมค่าน้ำมัน ค่าทางด่วน และค่าจอดรถแล้ว | ไม่มีค่าใช้จ่ายเพิ่มเติม
            </p>
          </div>

          {/* Booking Steps */}
          <div style={{ marginBottom: 60 }}>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 700, color: '#FFFFFF', textAlign: 'center', marginBottom: 40 }}>
              ขั้นตอนการจอง
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 20 }}>
              {STEPS.map((s, i) => (
                <div key={i} className="card-navy" style={{ padding: 28, textAlign: 'center' }}>
                  <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'linear-gradient(135deg, #B9973E, #E5C97A)', color: '#0B1C2D', fontSize: 20, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                    {s.num}
                  </div>
                  <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 17, fontWeight: 700, color: '#FFFFFF', marginBottom: 8 }}>{s.title}</h3>
                  <p style={{ fontSize: 13, color: '#9CA3AF', lineHeight: 1.7 }}>{s.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* FAQ */}
          <div style={{ marginBottom: 60 }}>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 700, color: '#FFFFFF', textAlign: 'center', marginBottom: 32 }}>
              คำถามที่พบบ่อย
            </h2>
            <div style={{ maxWidth: 800, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 8 }}>
              {FAQ.map((f, i) => (
                <details key={i} className="faq-card" style={{ padding: '18px 24px' }}>
                  <summary style={{ fontSize: 15, fontWeight: 600, color: '#FFFFFF', cursor: 'pointer', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    {f.q}
                    <span style={{ color: '#C6A75E', fontSize: 18, marginLeft: 12 }}>+</span>
                  </summary>
                  <p style={{ fontSize: 14, color: '#9CA3AF', lineHeight: 1.7, marginTop: 12 }}>{f.a}</p>
                </details>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div style={{ textAlign: 'center', padding: '48px 24px', background: '#12263A', borderRadius: 18, border: '1px solid rgba(198,167,94,0.1)' }}>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 700, color: '#FFFFFF', marginBottom: 12 }}>
              จองรถรับส่งสนามบินเชียงใหม่วันนี้
            </h2>
            <p style={{ color: '#9CA3AF', fontSize: 15, marginBottom: 28, maxWidth: 500, margin: '0 auto 28px' }}>
              แจ้งเที่ยวบิน วันเวลา จำนวนคน เราจัดให้ทันที
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <a href="/booking" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'linear-gradient(135deg, #B9973E, #E5C97A)', color: '#0B1C2D', padding: '16px 40px', borderRadius: 50, fontSize: 16, fontWeight: 700, textDecoration: 'none', boxShadow: '0 4px 20px rgba(198,167,94,0.3)' }}>
                📋 จองรถรับส่ง
              </a>
              <a href={`tel:${PHONE_RAW}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, border: '1px solid rgba(198,167,94,0.3)', color: '#C6A75E', padding: '16px 40px', borderRadius: 50, fontSize: 16, fontWeight: 600, textDecoration: 'none' }}>
                📞 โทรเลย
              </a>
            </div>
          </div>
        </section>
      </div>

      <Footer />
      <StickyBottomNav />
    </main>
  )
}
