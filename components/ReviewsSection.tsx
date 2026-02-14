'use client'

import RevealSection from './RevealSection'

export default function ReviewsSection() {
  const reviews = [
    { stars: 5, text: 'บริการดีมาก คนขับสุภาพ รถสะอาด ตรงเวลา ประทับใจครับ', name: 'คุณสมชาย ว.', route: 'สุวรรณภูมิ → พัทยา' },
    { stars: 5, text: 'Excellent service! Driver was punctual with name sign. Very comfortable ride.', name: 'Sarah M.', route: 'BKK → Bangkok Hotel' },
    { stars: 5, text: 'ใช้บริการหลายครั้ง ทุกครั้งก็ดีเหมือนเดิม แนะนำเลยค่ะ', name: 'คุณวิภา ศ.', route: 'ทริปเที่ยวกาญจนบุรี' },
    { stars: 5, text: 'Very professional driver. Clean van, cold AC, water provided. Will use again!', name: 'Takeshi Y.', route: 'DMK → Pattaya' },
  ]

  return (
    <section id="reviews" style={{ padding: '120px 24px', background: '#12263A', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: 0, left: '10%', right: '10%', height: 1, background: 'linear-gradient(90deg, transparent, rgba(198,167,94,0.2), transparent)' }} />

      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <RevealSection>
          <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <span style={{ color: '#C6A75E', fontSize: 13, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', display: 'block', marginBottom: 12 }}>Testimonials</span>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 700, color: '#FFFFFF' }}>
              ลูกค้า<span className="gold-shimmer">พูดถึงเรา</span>
            </h2>
            <div style={{ width: 60, height: 3, background: 'linear-gradient(90deg, #B9973E, #E5C97A)', margin: '16px auto 0', borderRadius: 2 }} />
          </div>
        </RevealSection>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
          {reviews.map((r, i) => (
            <RevealSection key={i} delay={i * 0.1}>
              <div className="card-navy" style={{ padding: 28, position: 'relative' }}>
                <div style={{ position: 'absolute', top: 16, right: 20, fontFamily: "'Playfair Display', serif", fontSize: 60, color: 'rgba(198,167,94,0.08)', lineHeight: 1 }}>&ldquo;</div>
                <div style={{ color: '#C6A75E', fontSize: 18, letterSpacing: 2, marginBottom: 16 }}>{'★'.repeat(r.stars)}</div>
                <p style={{ fontSize: 15, color: '#F5F5F5', lineHeight: 1.7, marginBottom: 20, fontStyle: 'italic' }}>&ldquo;{r.text}&rdquo;</p>
                <div style={{ borderTop: '1px solid rgba(198,167,94,0.1)', paddingTop: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14, color: '#FFFFFF' }}>{r.name}</div>
                    <div style={{ fontSize: 12, color: '#9CA3AF' }}>{r.route}</div>
                  </div>
                  <span style={{ fontSize: 10, color: '#C6A75E', border: '1px solid rgba(198,167,94,0.25)', background: 'rgba(198,167,94,0.08)', padding: '4px 12px', borderRadius: 50, fontWeight: 700 }}>✓ Verified</span>
                </div>
              </div>
            </RevealSection>
          ))}
        </div>
      </div>
    </section>
  )
}
