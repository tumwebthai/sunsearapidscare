import type { Metadata } from 'next'
import { SITE_NAME, SITE_URL, LINE_URL, PHONE, PHONE_RAW } from '@/lib/data'
import Navbar from '@/components/Navbar'
import Breadcrumb from '@/components/Breadcrumb'
import Footer from '@/components/Footer'
import StickyBottomNav from '@/components/StickyBottomNav'

export const metadata: Metadata = {
  title: `เกี่ยวกับเรา | ${SITE_NAME} — มาตรฐานระดับพรีเมียม`,
  description: 'SunSeaRapidsCare บริการเช่ารถตู้ VIP พร้อมคนขับมืออาชีพ มาตรฐานระดับพรีเมียม ปลอดภัย ตรงเวลา ราคาโปร่งใส ก่อตั้งโดยทีมงานผู้เชี่ยวชาญด้านการเดินทาง',
  openGraph: {
    title: `เกี่ยวกับเรา | ${SITE_NAME}`,
    description: 'มาตรฐานระดับพรีเมียม ปลอดภัย ตรงเวลา ราคาโปร่งใส',
    url: `${SITE_URL}/about`,
    type: 'website',
    locale: 'th_TH',
    siteName: SITE_NAME,
  },
  alternates: { canonical: `${SITE_URL}/about` },
}

const STANDARDS = [
  { icon: '⏰', title: 'ตรงเวลาเสมอ', desc: 'คนขับถึงจุดนัดหมายล่วงหน้า 15-20 นาที พร้อมป้ายชื่อรอรับ ไม่เคยมีประวัติสาย' },
  { icon: '👔', title: 'คนขับมืออาชีพ', desc: 'แต่งกายสุภาพ ผ่านการอบรม Service Mind มีระบบให้คะแนนหลังจบงาน ตรวจประวัติอาชญากรรม' },
  { icon: '✨', title: 'รถสะอาดทุกคัน', desc: 'ตรวจสภาพรถและห้องโดยสารทุกเช้า แอร์เย็นฉ่ำ ไม่มีกลิ่น รถอายุไม่เกิน 3 ปี' },
  { icon: '🛡️', title: 'ปลอดภัย 100%', desc: 'ประกันภัยชั้น 1 ทุกที่นั่ง GPS Tracking ตลอดเส้นทาง Zero Tolerance เรื่องแอลกอฮอล์' },
  { icon: '📱', title: 'แจ้งข้อมูลล่วงหน้า', desc: 'ส่งชื่อคนขับ เบอร์โทร ทะเบียนรถ ให้ 24 ชม. ก่อนเดินทาง ติดตามรถ Real-time' },
  { icon: '🤫', title: 'เคารพความเป็นส่วนตัว', desc: 'ไม่ชวนคุยเรื่องส่วนตัว ไม่เปิดเพลงดัง รักษาความลับลูกค้า ม่านกั้นพร้อม (Executive)' },
]

const VALUES = [
  { title: 'ความปลอดภัย', desc: 'เราให้ความสำคัญกับความปลอดภัยเป็นอันดับ 1 ทุกคันมีประกัน GPS และคนขับผ่านการตรวจสอบ' },
  { title: 'ความตรงเวลา', desc: 'เวลาของคุณมีค่า เราไม่เคยทำให้ลูกค้ารอ คนขับถึงล่วงหน้าเสมอ' },
  { title: 'ราคาโปร่งใส', desc: 'ราคาเหมาจ่าย รวมทุกอย่าง ไม่มีค่าใช้จ่ายแฝง ไม่มีเซอร์ไพรส์ตอนจ่ายเงิน' },
  { title: 'บริการด้วยใจ', desc: 'ทุกรายละเอียดเราใส่ใจ ตั้งแต่น้ำดื่มเย็น ผ้าเย็น จนถึงการช่วยยกกระเป๋า' },
]

const STATS = [
  { num: '5,000+', label: 'ทริปสำเร็จ' },
  { num: '4.9★', label: 'คะแนนรีวิว' },
  { num: '99.8%', label: 'ตรงเวลา' },
  { num: '24/7', label: 'พร้อมให้บริการ' },
]

export default function AboutPage() {
  const orgJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
    description: 'บริการเช่ารถตู้ VIP พร้อมคนขับมืออาชีพ รับส่งสนามบิน ท่องเที่ยวทั่วไทย',
    telephone: PHONE,
    areaServed: { '@type': 'Country', name: 'Thailand' },
  }

  return (
    <main style={{ background: 'var(--navy-900)', minHeight: '100vh' }}>
      <Navbar />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }} />

      <div style={{ paddingTop: 80 }}>
        <Breadcrumb items={[{ label: 'เกี่ยวกับเรา' }]} />

        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 24px 120px' }}>
          {/* Hero */}
          <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <span style={{ color: '#C6A75E', fontSize: 13, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', display: 'block', marginBottom: 12 }}>About Us</span>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 700, color: '#FFFFFF', margin: 0 }}>
              เกี่ยวกับ<span className="gold-shimmer">{SITE_NAME}</span>
            </h1>
            <div style={{ width: 60, height: 3, background: 'linear-gradient(90deg, #B9973E, #E5C97A)', margin: '20px auto 0', borderRadius: 2 }} />
          </div>

          {/* Story */}
          <div style={{ maxWidth: 800, margin: '0 auto 60px', textAlign: 'center' }}>
            <p style={{ fontSize: 17, color: '#F5F5F5', lineHeight: 1.9, marginBottom: 16 }}>
              <strong style={{ color: '#C6A75E' }}>SunSeaRapidsCare</strong> ก่อตั้งขึ้นจากความเชื่อที่ว่า <em>&quot;ทุกการเดินทางควรเป็นประสบการณ์ที่ดี&quot;</em>
            </p>
            <p style={{ fontSize: 15, color: '#9CA3AF', lineHeight: 1.8 }}>
              เราเริ่มต้นจากทีมงานเล็กๆ ที่หลงใหลในการให้บริการ สู่ผู้ให้บริการรถตู้ VIP พร้อมคนขับ ที่ลูกค้าไว้วางใจมากที่สุดรายหนึ่งในกรุงเทพฯ ด้วยประสบการณ์กว่า 5,000 ทริป เราเข้าใจว่าลูกค้าต้องการมากกว่าแค่รถ — ต้องการความสบายใจ ความปลอดภัย และการบริการที่ใส่ใจทุกรายละเอียด
            </p>
          </div>

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 80 }} className="about-stats-grid">
            {STATS.map((s, i) => (
              <div key={i} style={{ textAlign: 'center', padding: 24, background: '#12263A', borderRadius: 14, border: '1px solid rgba(198,167,94,0.1)' }}>
                <div style={{ fontSize: 32, fontWeight: 700, color: '#C6A75E', fontFamily: "'Playfair Display', serif" }}>{s.num}</div>
                <div style={{ fontSize: 13, color: '#9CA3AF', marginTop: 4 }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Standards */}
          <section style={{ marginBottom: 80 }}>
            <div style={{ textAlign: 'center', marginBottom: 40 }}>
              <span style={{ color: '#C6A75E', fontSize: 13, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', display: 'block', marginBottom: 12 }}>Our Standards</span>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 32, fontWeight: 700, color: '#FFFFFF' }}>
                มาตรฐาน<span className="gold-shimmer">ที่เราภูมิใจ</span>
              </h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 20 }}>
              {STANDARDS.map((s, i) => (
                <div key={i} className="card-navy" style={{ padding: 28, display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                  <div style={{ fontSize: 30, width: 52, height: 52, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(198,167,94,0.12)', border: '1px solid rgba(198,167,94,0.2)', borderRadius: 14, flexShrink: 0 }}>
                    {s.icon}
                  </div>
                  <div>
                    <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 17, fontWeight: 700, color: '#FFFFFF', marginBottom: 8 }}>{s.title}</h3>
                    <p style={{ fontSize: 14, color: '#9CA3AF', lineHeight: 1.7 }}>{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Values */}
          <section style={{ marginBottom: 60 }}>
            <div style={{ textAlign: 'center', marginBottom: 40 }}>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 32, fontWeight: 700, color: '#FFFFFF' }}>
                ค่านิยม<span className="gold-shimmer">ของเรา</span>
              </h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 20 }}>
              {VALUES.map((v, i) => (
                <div key={i} style={{ padding: 28, background: '#12263A', borderRadius: 14, border: '1px solid rgba(198,167,94,0.1)', textAlign: 'center' }}>
                  <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 700, color: '#C6A75E', marginBottom: 12 }}>{v.title}</h3>
                  <p style={{ fontSize: 14, color: '#9CA3AF', lineHeight: 1.7 }}>{v.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* CTA */}
          <div style={{ textAlign: 'center', padding: '48px 24px', background: '#12263A', borderRadius: 18, border: '1px solid rgba(198,167,94,0.1)' }}>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 700, color: '#FFFFFF', marginBottom: 12 }}>
              พร้อมให้บริการคุณ
            </h2>
            <p style={{ color: '#9CA3AF', fontSize: 15, marginBottom: 28, maxWidth: 500, margin: '0 auto 28px' }}>
              ติดต่อเราวันนี้ เพื่อประสบการณ์การเดินทางที่เหนือระดับ
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <a href="/booking" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'linear-gradient(135deg, #B9973E, #E5C97A)', color: '#0B1C2D', padding: '16px 40px', borderRadius: 50, fontSize: 16, fontWeight: 700, textDecoration: 'none', boxShadow: '0 4px 20px rgba(198,167,94,0.3)' }}>
                📋 จองเลย
              </a>
              <a href={`tel:${PHONE_RAW}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, border: '1px solid rgba(198,167,94,0.3)', color: '#C6A75E', padding: '16px 40px', borderRadius: 50, fontSize: 16, fontWeight: 600, textDecoration: 'none' }}>
                📞 {PHONE}
              </a>
            </div>
          </div>
        </div>
      </div>

      <Footer />
      <StickyBottomNav />
    </main>
  )
}
