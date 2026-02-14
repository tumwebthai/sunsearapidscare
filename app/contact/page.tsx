import type { Metadata } from 'next'
import { SITE_NAME, SITE_URL, LINE_URL, PHONE, PHONE_RAW, WHATSAPP_URL, EMAIL } from '@/lib/data'
import { getSocialLinks } from '@/lib/social-links'
import Navbar from '@/components/Navbar'
import Breadcrumb from '@/components/Breadcrumb'
import Footer from '@/components/Footer'
import StickyBottomNav from '@/components/StickyBottomNav'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: `ติดต่อเรา | ${SITE_NAME} — จองรถ สอบถามราคา`,
  description: 'ติดต่อ SunSeaRapidsCare จองรถตู้ VIP สอบถามราคา LINE: @sunsearapidscare โทร: 081-234-5678 พร้อมให้บริการ 24 ชม.',
  keywords: 'ติดต่อ SunSeaRapidsCare, จองรถตู้ VIP, เบอร์โทรเช่ารถตู้, LINE เช่ารถตู้',
  openGraph: {
    title: `ติดต่อเรา | ${SITE_NAME}`,
    description: 'จองรถ สอบถามราคา พร้อมให้บริการ 24 ชม.',
    url: `${SITE_URL}/contact`,
    type: 'website',
    locale: 'th_TH',
    siteName: SITE_NAME,
  },
  alternates: { canonical: `${SITE_URL}/contact` },
}

const CONTACT_METHODS = [
  {
    icon: '💬',
    title: 'LINE Official',
    value: '@sunsearapidscare',
    desc: 'ตอบกลับเร็วที่สุด แนะนำช่องทางนี้',
    href: LINE_URL,
    btnLabel: 'แชทเลย',
    btnBg: '#06C755',
    btnColor: '#FFFFFF',
  },
  {
    icon: '📞',
    title: 'โทรศัพท์',
    value: PHONE,
    desc: 'พร้อมรับสาย 24 ชม. ทุกวัน',
    href: `tel:${PHONE_RAW}`,
    btnLabel: 'โทรเลย',
    btnBg: 'linear-gradient(135deg, #B9973E, #E5C97A)',
    btnColor: '#0B1C2D',
  },
  {
    icon: '📱',
    title: 'WhatsApp',
    value: '+66 81-234-5678',
    desc: 'สำหรับลูกค้าต่างชาติ',
    href: WHATSAPP_URL,
    btnLabel: 'แชท WhatsApp',
    btnBg: 'transparent',
    btnColor: '#C6A75E',
    btnBorder: '1px solid rgba(198,167,94,0.3)',
  },
  {
    icon: '✉️',
    title: 'อีเมล',
    value: EMAIL,
    desc: 'สำหรับใบเสนอราคา / เอกสารบริษัท',
    href: `mailto:${EMAIL}`,
    btnLabel: 'ส่งอีเมล',
    btnBg: 'transparent',
    btnColor: '#C6A75E',
    btnBorder: '1px solid rgba(198,167,94,0.3)',
  },
]

const HOURS = [
  { day: 'จันทร์ - อาทิตย์', time: 'เปิดให้บริการ 24 ชม.' },
  { day: 'LINE / WhatsApp', time: 'ตอบกลับภายใน 5 นาที' },
  { day: 'โทรศัพท์', time: 'รับสายตลอด 24 ชม.' },
  { day: 'อีเมล', time: 'ตอบกลับภายใน 1 ชม.' },
]

export default async function ContactPage() {
  const allSocials = await getSocialLinks()
  const contactSocials = allSocials.filter((s) => s.group === 'contact')
  const followSocials = allSocials.filter((s) => s.group === 'follow')
  const localBusinessJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: SITE_NAME,
    url: SITE_URL,
    telephone: PHONE,
    email: EMAIL,
    description: 'บริการเช่ารถตู้ VIP พร้อมคนขับมืออาชีพ รับส่งสนามบิน ท่องเที่ยวทั่วไทย',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Bangkok',
      addressCountry: 'TH',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 13.7563,
      longitude: 100.5018,
    },
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      opens: '00:00',
      closes: '23:59',
    },
    priceRange: '฿฿',
    areaServed: { '@type': 'Country', name: 'Thailand' },
  }

  return (
    <main style={{ background: 'var(--navy-900)', minHeight: '100vh' }}>
      <Navbar />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }} />

      <div style={{ paddingTop: 80 }}>
        <Breadcrumb items={[{ label: 'ติดต่อเรา' }]} />

        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 24px 120px' }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <span style={{ color: '#C6A75E', fontSize: 13, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', display: 'block', marginBottom: 12 }}>Contact Us</span>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 700, color: '#FFFFFF', margin: 0 }}>
              ติดต่อ<span className="gold-shimmer">เรา</span>
            </h1>
            <p style={{ color: '#9CA3AF', fontSize: 16, marginTop: 12 }}>
              พร้อมให้บริการ 24 ชม. ทุกวัน เลือกช่องทางที่สะดวกสำหรับคุณ
            </p>
            <div style={{ width: 60, height: 3, background: 'linear-gradient(90deg, #B9973E, #E5C97A)', margin: '20px auto 0', borderRadius: 2 }} />
          </div>

          {/* Contact Methods Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20, marginBottom: 60 }}>
            {CONTACT_METHODS.map((c, i) => (
              <div key={i} className="card-navy" style={{ padding: 32, textAlign: 'center' }}>
                <div style={{ fontSize: 36, marginBottom: 16 }}>{c.icon}</div>
                <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 700, color: '#FFFFFF', marginBottom: 8 }}>{c.title}</h2>
                <div style={{ fontSize: 16, fontWeight: 600, color: '#C6A75E', marginBottom: 8 }}>{c.value}</div>
                <p style={{ fontSize: 13, color: '#9CA3AF', marginBottom: 20, lineHeight: 1.6 }}>{c.desc}</p>
                <a
                  href={c.href}
                  style={{
                    display: 'inline-block',
                    background: c.btnBg,
                    color: c.btnColor,
                    padding: '12px 28px',
                    borderRadius: 50,
                    fontSize: 14,
                    fontWeight: 700,
                    textDecoration: 'none',
                    border: c.btnBorder || 'none',
                    ...(c.btnBg === 'linear-gradient(135deg, #B9973E, #E5C97A)' ? { boxShadow: '0 4px 20px rgba(198,167,94,0.3)' } : {}),
                  }}
                >
                  {c.btnLabel}
                </a>
              </div>
            ))}
          </div>

          {/* ═══ ช่องทางออนไลน์ ═══ */}
          <div style={{ marginBottom: 60 }}>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 700, color: '#FFFFFF', textAlign: 'center', marginBottom: 8 }}>
              ช่องทาง<span style={{ color: '#C6A75E' }}>ออนไลน์</span>
            </h2>
            <p style={{ color: '#9CA3AF', fontSize: 14, textAlign: 'center', marginBottom: 32 }}>ติดต่อและติดตามเราได้ทุกแพลตฟอร์ม</p>

            {/* ติดต่อเรา */}
            <div style={{ marginBottom: 32 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#C6A75E', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 16 }}>ติดต่อเรา</div>
              <div className="social-contact-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
                {contactSocials.map((s) => (
                  <a
                    key={s.name}
                    href={s.href}
                    target={s.href.startsWith('http') ? '_blank' : undefined}
                    rel={s.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className="social-contact-item"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 16,
                      padding: '16px 20px',
                      background: '#12263A',
                      borderRadius: 14,
                      border: '1px solid rgba(198,167,94,0.08)',
                      textDecoration: 'none',
                      transition: 'all 0.2s',
                    }}
                  >
                    <div style={{
                      width: 48,
                      height: 48,
                      borderRadius: '50%',
                      background: s.bgGradient || s.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      color: s.name === 'Lemon8' ? '#0B1C2D' : '#FFFFFF',
                    }}>
                      <svg viewBox="0 0 24 24" width={22} height={22} dangerouslySetInnerHTML={{ __html: s.svg }} />
                    </div>
                    <div>
                      <div style={{ fontSize: 15, fontWeight: 700, color: '#FFFFFF' }}>{s.name}</div>
                      <div style={{ fontSize: 12, color: '#9CA3AF', marginTop: 2 }}>
                        {s.name === 'LINE' && '@sunsearapidscare'}
                        {s.name === 'Facebook' && 'SunSeaRapidsCare'}
                        {s.name === 'WhatsApp' && '+66 84-289-4662'}
                        {s.name === 'Phone' && '084-289-4662'}
                        {s.name === 'Email' && 'info@sunsearapidscare.com'}
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            {/* ติดตามเรา */}
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#C6A75E', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 16 }}>ติดตามเรา</div>
              <div className="social-contact-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
                {followSocials.map((s) => (
                  <a
                    key={s.name}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-contact-item"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 16,
                      padding: '16px 20px',
                      background: '#12263A',
                      borderRadius: 14,
                      border: '1px solid rgba(198,167,94,0.08)',
                      textDecoration: 'none',
                      transition: 'all 0.2s',
                    }}
                  >
                    <div style={{
                      width: 48,
                      height: 48,
                      borderRadius: '50%',
                      background: s.bgGradient || s.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      color: s.name === 'Lemon8' ? '#0B1C2D' : '#FFFFFF',
                    }}>
                      <svg viewBox="0 0 24 24" width={22} height={22} dangerouslySetInnerHTML={{ __html: s.svg }} />
                    </div>
                    <div>
                      <div style={{ fontSize: 15, fontWeight: 700, color: '#FFFFFF' }}>{s.name}</div>
                      <div style={{ fontSize: 12, color: '#9CA3AF', marginTop: 2 }}>
                        {s.href === '#' ? 'เร็วๆ นี้' : `@sunsearapidscare`}
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Business Hours */}
          <div style={{ maxWidth: 600, margin: '0 auto 60px' }}>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 700, color: '#FFFFFF', textAlign: 'center', marginBottom: 24 }}>
              เวลาทำการ
            </h2>
            <div style={{ background: '#12263A', borderRadius: 14, border: '1px solid rgba(198,167,94,0.1)', overflow: 'hidden' }}>
              {HOURS.map((h, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '16px 24px', borderBottom: i < HOURS.length - 1 ? '1px solid rgba(198,167,94,0.08)' : 'none' }}>
                  <span style={{ fontSize: 14, color: '#F5F5F5', fontWeight: 500 }}>{h.day}</span>
                  <span style={{ fontSize: 14, color: '#C6A75E', fontWeight: 600 }}>{h.time}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Map placeholder */}
          <div style={{ marginBottom: 60 }}>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 700, color: '#FFFFFF', textAlign: 'center', marginBottom: 24 }}>
              พื้นที่ให้บริการ
            </h2>
            <div style={{ background: '#12263A', borderRadius: 18, border: '1px solid rgba(198,167,94,0.1)', padding: 48, textAlign: 'center' }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>🗺️</div>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: '#FFFFFF', marginBottom: 8 }}>กรุงเทพฯ และทั่วประเทศไทย</h3>
              <p style={{ fontSize: 14, color: '#9CA3AF', lineHeight: 1.7, maxWidth: 500, margin: '0 auto' }}>
                ให้บริการรับส่งสนามบินสุวรรณภูมิ ดอนเมือง รวมถึงเช่ารถเดินทางทั่วประเทศ
                <br />พัทยา หัวหิน เขาใหญ่ เชียงใหม่ และอีกมากมาย
              </p>
            </div>
          </div>

          {/* Quick Book CTA */}
          <div style={{ textAlign: 'center', padding: '48px 24px', background: 'linear-gradient(135deg, rgba(185,151,62,0.1), rgba(229,201,122,0.05))', borderRadius: 18, border: '1px solid rgba(198,167,94,0.2)' }}>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 700, color: '#FFFFFF', marginBottom: 12 }}>
              พร้อมจองรถ?
            </h2>
            <p style={{ color: '#9CA3AF', fontSize: 15, marginBottom: 28, maxWidth: 500, margin: '0 auto 28px' }}>
              แจ้งวันเวลา จำนวนคน เส้นทาง เราจัดให้ทันที
            </p>
            <a
              href={LINE_URL}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                background: 'linear-gradient(135deg, #B9973E, #E5C97A)',
                color: '#0B1C2D',
                padding: '18px 48px',
                borderRadius: 50,
                fontSize: 17,
                fontWeight: 700,
                textDecoration: 'none',
                boxShadow: '0 4px 20px rgba(198,167,94,0.3)',
              }}
            >
              💬 จองผ่าน LINE เลย
            </a>
          </div>
        </div>
      </div>

      <Footer />
      <StickyBottomNav />

      {/* Responsive styles for social grid */}
      <style>{`
        .social-contact-item:hover {
          border-color: rgba(198,167,94,0.3) !important;
          transform: translateY(-2px);
        }
        @media (max-width: 768px) {
          .social-contact-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </main>
  )
}
