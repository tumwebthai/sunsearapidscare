import type { Metadata } from 'next'
import { SITE_NAME, SITE_URL, PHONE_RAW } from '@/lib/data'
import Navbar from '@/components/Navbar'
import Breadcrumb from '@/components/Breadcrumb'
import Footer from '@/components/Footer'
import StickyBottomNav from '@/components/StickyBottomNav'

export const metadata: Metadata = {
  title: `รับส่งสนามบินหาดใหญ่ | ${SITE_NAME}`,
  description: 'บริการรถรับส่งสนามบินหาดใหญ่ พร้อมคนขับ รถเก๋ง เริ่ม ฿700 รถตู้ เริ่ม ฿900 วันเดย์หาดใหญ่-สงขลา เริ่ม ฿1,900 ตรงเวลา ปลอดภัย',
  keywords: 'รับส่งสนามบินหาดใหญ่, หาดใหญ่ airport transfer, รถรับส่งสนามบิน HDY, รถเก๋งหาดใหญ่, รถตู้หาดใหญ่, วันเดย์สงขลา',
  openGraph: {
    title: `รับส่งสนามบินหาดใหญ่ | ${SITE_NAME}`,
    description: 'บริการรถรับส่งสนามบินหาดใหญ่ พร้อมคนขับ รถเก๋ง เริ่ม ฿700 รถตู้ เริ่ม ฿900 ตรงเวลา ปลอดภัย',
    url: `${SITE_URL}/hatyai-airport-transfer`,
    type: 'website',
    locale: 'th_TH',
    siteName: SITE_NAME,
  },
  alternates: { canonical: `${SITE_URL}/hatyai-airport-transfer` },
}

const ROUTES = [
  { service: 'สนามบิน → หาดใหญ่ (รถเก๋ง)', price: '700', note: '' },
  { service: 'สนามบิน → หาดใหญ่ (รถตู้)', price: '900', note: '' },
  { service: 'วันเดย์ หาดใหญ่-สงขลา รถเก๋ง (ไม่รวมน้ำมัน) 10 ชม.', price: '1,900', note: 'ไม่รวมน้ำมัน' },
  { service: 'วันเดย์ หาดใหญ่-สงขลา รถตู้ (ไม่รวมน้ำมัน) 10 ชม.', price: '2,400', note: 'ไม่รวมน้ำมัน' },
  { service: 'วันเดย์ หาดใหญ่-สงขลา รถเก๋ง (รวมน้ำมัน) 10 ชม.', price: '2,600', note: 'รวมน้ำมัน' },
  { service: 'วันเดย์ หาดใหญ่-สงขลา รถตู้ (รวมน้ำมัน) 10 ชม.', price: '3,200', note: 'รวมน้ำมัน' },
]

const STEPS = [
  { num: '1', title: 'แจ้งรายละเอียด', desc: 'แจ้งวันเวลา เที่ยวบิน จำนวนผู้โดยสาร จุดรับ-ส่ง ผ่าน LINE หรือโทร' },
  { num: '2', title: 'ยืนยันการจอง', desc: 'รับใบเสนอราคา ยืนยันการจอง มัดจำ 30% ที่เหลือจ่ายวันเดินทาง' },
  { num: '3', title: 'รับข้อมูลคนขับ', desc: 'ได้รับชื่อคนขับ เบอร์โทร ทะเบียนรถ 24 ชม. ก่อนเดินทาง' },
  { num: '4', title: 'คนขับรอรับ', desc: 'คนขับถึงล่วงหน้า 15-20 นาที พร้อมป้ายชื่อรอรับที่จุดนัดหมาย' },
]

const FAQ = [
  { q: 'คนขับจะรอรับที่ไหน?', a: 'คนขับจะรอพร้อมป้ายชื่อที่ประตูทางออกผู้โดยสารขาเข้า สนามบินหาดใหญ่ (HDY)' },
  { q: 'ถ้าเที่ยวบินดีเลย์ คิดค่าใช้จ่ายเพิ่มไหม?', a: 'ไม่คิดเพิ่มครับ เราติดตามเที่ยวบินแบบ Real-time คนขับจะปรับเวลารอรับตามเวลาลงจริง' },
  { q: 'จองรถรับส่งสนามบินล่วงหน้ากี่วัน?', a: 'แนะนำจองล่วงหน้าอย่างน้อย 1 วัน หากเร่งด่วนสอบถามได้ตลอด 24 ชม.' },
  { q: 'วันเดย์ "ไม่รวมน้ำมัน" กับ "รวมน้ำมัน" ต่างกันอย่างไร?', a: 'แบบไม่รวมน้ำมัน คือจ่ายเฉพาะค่ารถ+คนขับ ลูกค้าเติมน้ำมันเอง เหมาะกับคนที่ไม่ได้ขับไกลมาก แบบรวมน้ำมัน ราคาเหมาจ่ายทุกอย่าง สะดวกกว่า' },
  { q: 'วันเดย์ไปสงขลาไปไหนได้บ้าง?', a: 'ไปได้ทั่วหาดใหญ่-สงขลา เช่น ตลาดกิมหยง สะพานติณสูลานนท์ เกาะยอ หาดสมิหลา ภายใน 10 ชม.' },
  { q: 'มีบริการรับส่งตอนดึกหรือเช้ามืดไหม?', a: 'มีครับ ให้บริการ 24 ชั่วโมง ไม่ว่าจะเที่ยวบินดึกหรือเช้ามืด คนขับพร้อมรอรับทุกเวลา' },
]

export default function HatyaiAirportTransferPage() {
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
    name: 'บริการรับส่งสนามบินหาดใหญ่ — SunSeaRapidsCare',
    description: 'บริการรถรับส่งสนามบินหาดใหญ่ พร้อมคนขับ ราคาเหมาจ่าย ตรงเวลา ปลอดภัย',
    provider: { '@type': 'LocalBusiness', name: SITE_NAME, url: SITE_URL },
    areaServed: { '@type': 'City', name: 'Hat Yai' },
    serviceType: 'Airport Transfer',
  }

  return (
    <main style={{ background: 'var(--navy-900)', minHeight: '100vh' }}>
      <Navbar />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }} />

      <div style={{ paddingTop: 80 }}>
        <Breadcrumb items={[{ label: 'รับส่งสนามบิน', href: '/airport-transfer' }, { label: 'หาดใหญ่' }]} />

        <section style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 24px 120px' }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <span style={{ color: '#C6A75E', fontSize: 13, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', display: 'block', marginBottom: 12 }}>Hat Yai Airport Transfer</span>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 700, color: '#FFFFFF', margin: 0 }}>
              บริการรถรับส่ง<span className="gold-shimmer">สนามบินหาดใหญ่</span> พร้อมคนขับ
            </h1>
            <p style={{ color: '#9CA3AF', fontSize: 16, marginTop: 12, maxWidth: 600, margin: '12px auto 0' }}>
              รถเก๋งและรถตู้ ราคาเหมาจ่าย ตรงเวลา ป้ายชื่อรอรับ
            </p>
            <div style={{ width: 60, height: 3, background: 'linear-gradient(90deg, #B9973E, #E5C97A)', margin: '20px auto 0', borderRadius: 2 }} />
          </div>

          {/* Pricing Table */}
          <div style={{ marginBottom: 60, overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0, minWidth: 500 }}>
              <thead>
                <tr>
                  {['บริการ / เส้นทาง', 'หมายเหตุ', 'ราคา'].map((h, i) => (
                    <th key={i} style={{ padding: '16px 20px', background: '#12263A', color: '#C6A75E', fontSize: 13, fontWeight: 700, textAlign: 'left', borderBottom: '2px solid rgba(198,167,94,0.2)', ...(i === 0 ? { borderRadius: '12px 0 0 0' } : i === 2 ? { borderRadius: '0 12px 0 0' } : {}) }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ROUTES.map((r, i) => (
                  <tr key={i} style={{ background: i % 2 === 0 ? 'rgba(18,38,58,0.5)' : 'transparent' }}>
                    <td style={{ padding: '14px 20px', fontSize: 14, color: '#F5F5F5', fontWeight: 600 }}>{r.service}</td>
                    <td style={{ padding: '14px 20px', fontSize: 13, color: r.note === 'รวมน้ำมัน' ? '#10B981' : '#9CA3AF', fontWeight: 600 }}>{r.note || '-'}</td>
                    <td style={{ padding: '14px 20px', fontSize: 14 }}>
                      <span style={{ color: '#C6A75E', fontWeight: 700, fontSize: 18 }}>฿{r.price}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p style={{ fontSize: 13, color: '#9CA3AF', marginTop: 12, textAlign: 'center', lineHeight: 1.7 }}>
              รับส่งสนามบิน: ราคารวมค่าน้ำมันและค่าจอดรถแล้ว | วันเดย์: ดูหมายเหตุรวม/ไม่รวมน้ำมัน
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
              จองรถรับส่งสนามบินหาดใหญ่วันนี้
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
