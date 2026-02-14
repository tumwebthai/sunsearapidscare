import type { Metadata } from 'next'
import { ROUTES, SITE_NAME, SITE_URL, LINE_URL, PHONE, PHONE_RAW } from '@/lib/data'
import Navbar from '@/components/Navbar'
import Breadcrumb from '@/components/Breadcrumb'
import Footer from '@/components/Footer'
import StickyBottomNav from '@/components/StickyBottomNav'

export const metadata: Metadata = {
  title: `รับส่งสนามบิน สุวรรณภูมิ ดอนเมือง | ${SITE_NAME}`,
  description: 'บริการรับส่งสนามบิน สุวรรณภูมิ ดอนเมือง ราคาเหมาจ่าย Sedan 1,000 บาท VAN 1,500 บาท ตรงเวลา ป้ายชื่อรอรับ GPS Tracking',
  keywords: 'รับส่งสนามบิน, airport transfer, สุวรรณภูมิ, ดอนเมือง, รถรับส่งสนามบิน, transfer bangkok airport',
  openGraph: {
    title: `รับส่งสนามบิน | ${SITE_NAME}`,
    description: 'บริการรับส่งสนามบิน สุวรรณภูมิ ดอนเมือง ราคาเหมาจ่าย ตรงเวลา ปลอดภัย',
    url: `${SITE_URL}/airport-transfer`,
    type: 'website',
    locale: 'th_TH',
    siteName: SITE_NAME,
  },
  alternates: { canonical: `${SITE_URL}/airport-transfer` },
}

const STEPS = [
  { num: '1', title: 'แจ้งรายละเอียด', desc: 'แจ้งวันเวลา เที่ยวบิน จำนวนผู้โดยสาร จุดรับ-ส่ง ผ่าน LINE หรือโทร' },
  { num: '2', title: 'ยืนยันการจอง', desc: 'รับใบเสนอราคา ยืนยันการจอง มัดจำ 30% ที่เหลือจ่ายวันเดินทาง' },
  { num: '3', title: 'รับข้อมูลคนขับ', desc: 'ได้รับชื่อคนขับ เบอร์โทร ทะเบียนรถ 24 ชม. ก่อนเดินทาง' },
  { num: '4', title: 'คนขับรอรับ', desc: 'คนขับถึงล่วงหน้า 15-20 นาที พร้อมป้ายชื่อรอรับที่จุดนัดหมาย' },
]

const AIRPORT_FAQ = [
  { q: 'คนขับจะรอรับที่ไหน?', a: 'คนขับจะรอพร้อมป้ายชื่อที่ประตูทางออกผู้โดยสารขาเข้า ชั้น 2 (สุวรรณภูมิ) หรือชั้น 1 (ดอนเมือง)' },
  { q: 'ถ้าเที่ยวบินดีเลย์ คิดค่าใช้จ่ายเพิ่มไหม?', a: 'ไม่คิดเพิ่มครับ เราติดตามเที่ยวบินแบบ Real-time คนขับจะปรับเวลารอรับตามเวลาลงจริง' },
  { q: 'จองรถรับส่งสนามบินล่วงหน้ากี่วัน?', a: 'แนะนำจองล่วงหน้าอย่างน้อย 1 วัน หากเร่งด่วนสอบถามได้ตลอด 24 ชม.' },
  { q: 'ราคารวมค่าทางด่วนไหม?', a: 'รวมทุกอย่างครับ ค่าน้ำมัน ค่าทางด่วน ค่าจอดรถ น้ำดื่ม ไม่มีค่าใช้จ่ายแฝง' },
]

export default function AirportTransferPage() {
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: AIRPORT_FAQ.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  }

  const serviceJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'บริการรับส่งสนามบิน — SunSeaRapidsCare',
    description: 'บริการรับส่งสนามบิน สุวรรณภูมิ ดอนเมือง ราคาเหมาจ่าย ตรงเวลา ปลอดภัย',
    provider: {
      '@type': 'LocalBusiness',
      name: SITE_NAME,
      url: SITE_URL,
    },
    areaServed: { '@type': 'City', name: 'Bangkok' },
    serviceType: 'Airport Transfer',
  }

  return (
    <main style={{ background: 'var(--navy-900)', minHeight: '100vh' }}>
      <Navbar />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }} />

      <div style={{ paddingTop: 80 }}>
        <Breadcrumb items={[{ label: 'รับส่งสนามบิน' }]} />

        <section style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 24px 120px' }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <span style={{ color: '#C6A75E', fontSize: 13, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', display: 'block', marginBottom: 12 }}>Airport Transfer</span>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 700, color: '#FFFFFF', margin: 0 }}>
              รับส่ง<span className="gold-shimmer">สนามบิน</span>
            </h1>
            <p style={{ color: '#9CA3AF', fontSize: 16, marginTop: 12, maxWidth: 600, margin: '12px auto 0' }}>
              ราคาเหมาจ่าย ไม่มีค่าใช้จ่ายแฝง ตรงเวลา ป้ายชื่อรอรับ
            </p>
            <div style={{ width: 60, height: 3, background: 'linear-gradient(90deg, #B9973E, #E5C97A)', margin: '20px auto 0', borderRadius: 2 }} />
          </div>

          {/* Pricing Table */}
          <div style={{ marginBottom: 60, overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0, minWidth: 600 }}>
              <thead>
                <tr>
                  {['เส้นทาง', '', 'ระยะเวลา', 'Sedan', 'VAN VIP'].map((h, i) => (
                    <th key={i} style={{ padding: '16px 20px', background: '#12263A', color: '#C6A75E', fontSize: 13, fontWeight: 700, textAlign: 'left', borderBottom: '2px solid rgba(198,167,94,0.2)', ...(i === 0 ? { borderRadius: '12px 0 0 0' } : i === 4 ? { borderRadius: '0 12px 0 0' } : {}) }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ROUTES.map((r, i) => (
                  <tr key={i} style={{ background: i % 2 === 0 ? 'rgba(18,38,58,0.5)' : 'transparent' }}>
                    <td style={{ padding: '14px 20px', fontSize: 14, color: '#F5F5F5', fontWeight: 600 }}>{r.from}</td>
                    <td style={{ padding: '14px 8px', fontSize: 14, color: '#9CA3AF' }}>→</td>
                    <td style={{ padding: '14px 20px', fontSize: 14, color: '#F5F5F5' }}>{r.to}</td>
                    <td style={{ padding: '14px 20px', fontSize: 14, color: '#9CA3AF' }}>
                      <span style={{ color: '#FFFFFF', fontWeight: 600 }}>฿{r.sedan}</span>
                    </td>
                    <td style={{ padding: '14px 20px', fontSize: 14 }}>
                      <span style={{ color: '#C6A75E', fontWeight: 700 }}>฿{r.van}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p style={{ fontSize: 12, color: '#9CA3AF', marginTop: 12, textAlign: 'center' }}>
              * ราคารวมค่าน้ำมัน ทางด่วน ค่าจอดรถ น้ำดื่ม ไม่มีค่าใช้จ่ายเพิ่มเติม | เส้นทางอื่นสอบถามได้
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
              {AIRPORT_FAQ.map((f, i) => (
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
              จองรถรับส่งสนามบินวันนี้
            </h2>
            <p style={{ color: '#9CA3AF', fontSize: 15, marginBottom: 28, maxWidth: 500, margin: '0 auto 28px' }}>
              แจ้งเที่ยวบิน วันเวลา จำนวนคน เราจัดให้ทันที
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <a
                href="/booking"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  background: 'linear-gradient(135deg, #B9973E, #E5C97A)',
                  color: '#0B1C2D',
                  padding: '16px 40px',
                  borderRadius: 50,
                  fontSize: 16,
                  fontWeight: 700,
                  textDecoration: 'none',
                  boxShadow: '0 4px 20px rgba(198,167,94,0.3)',
                }}
              >
                📋 จองรถรับส่ง
              </a>
              <a
                href={`tel:${PHONE_RAW}`}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  border: '1px solid rgba(198,167,94,0.3)',
                  color: '#C6A75E',
                  padding: '16px 40px',
                  borderRadius: 50,
                  fontSize: 16,
                  fontWeight: 600,
                  textDecoration: 'none',
                }}
              >
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
