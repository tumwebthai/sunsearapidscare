import type { Metadata } from 'next'
import { FAQ_GROUPS, SITE_NAME, SITE_URL, LINE_URL, PHONE, PHONE_RAW } from '@/lib/data'
import Navbar from '@/components/Navbar'
import Breadcrumb from '@/components/Breadcrumb'
import Footer from '@/components/Footer'
import StickyBottomNav from '@/components/StickyBottomNav'
import FaqAccordion from './FaqAccordion'

export const metadata: Metadata = {
  title: `คำถามที่พบบ่อย (FAQ) | ${SITE_NAME}`,
  description: 'คำถามที่พบบ่อยเกี่ยวกับบริการเช่ารถตู้ VIP รับส่งสนามบิน ราคา การจอง การยกเลิก คนขับ ความปลอดภัย',
  keywords: 'FAQ เช่ารถตู้, คำถามที่พบบ่อย, เช่ารถตู้ VIP FAQ, รับส่งสนามบิน คำถาม',
  openGraph: {
    title: `คำถามที่พบบ่อย | ${SITE_NAME}`,
    description: 'คำตอบทุกคำถามเกี่ยวกับบริการเช่ารถตู้ VIP และรับส่งสนามบิน',
    url: `${SITE_URL}/faq`,
    type: 'website',
    locale: 'th_TH',
    siteName: SITE_NAME,
  },
  alternates: { canonical: `${SITE_URL}/faq` },
}

export default function FaqPage() {
  const allFaq = FAQ_GROUPS.flatMap((g) => g.items)
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: allFaq.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  }

  return (
    <main style={{ background: 'var(--navy-900)', minHeight: '100vh' }}>
      <Navbar />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      <div style={{ paddingTop: 80 }}>
        <Breadcrumb items={[{ label: 'คำถามที่พบบ่อย' }]} />

        <div style={{ maxWidth: 900, margin: '0 auto', padding: '40px 24px 120px' }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <span style={{ color: '#C6A75E', fontSize: 13, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', display: 'block', marginBottom: 12 }}>FAQ</span>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 700, color: '#FFFFFF', margin: 0 }}>
              คำถาม<span className="gold-shimmer">ที่พบบ่อย</span>
            </h1>
            <p style={{ color: '#9CA3AF', fontSize: 16, marginTop: 12 }}>
              รวบรวมคำตอบทุกข้อสงสัย หากไม่พบคำตอบ ติดต่อเราได้ตลอด 24 ชม.
            </p>
            <div style={{ width: 60, height: 3, background: 'linear-gradient(90deg, #B9973E, #E5C97A)', margin: '20px auto 0', borderRadius: 2 }} />
          </div>

          {/* FAQ Groups */}
          <FaqAccordion groups={FAQ_GROUPS} />

          {/* CTA */}
          <div style={{ textAlign: 'center', marginTop: 60, padding: '48px 24px', background: '#12263A', borderRadius: 18, border: '1px solid rgba(198,167,94,0.1)' }}>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 700, color: '#FFFFFF', marginBottom: 12 }}>
              ยังมีคำถาม?
            </h2>
            <p style={{ color: '#9CA3AF', fontSize: 15, marginBottom: 28 }}>
              ทีมงานพร้อมตอบทุกข้อสงสัยตลอด 24 ชม.
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <a href="/booking" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'linear-gradient(135deg, #B9973E, #E5C97A)', color: '#0B1C2D', padding: '14px 32px', borderRadius: 50, fontSize: 15, fontWeight: 700, textDecoration: 'none', boxShadow: '0 4px 20px rgba(198,167,94,0.3)' }}>
                📋 จองเลย
              </a>
              <a href={`tel:${PHONE_RAW}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, border: '1px solid rgba(198,167,94,0.3)', color: '#C6A75E', padding: '14px 32px', borderRadius: 50, fontSize: 15, fontWeight: 600, textDecoration: 'none' }}>
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
