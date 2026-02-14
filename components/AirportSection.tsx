'use client'

import RevealSection from './RevealSection'

export default function AirportSection() {
  const routes = [
    { from: 'สุวรรณภูมิ (BKK)', to: 'กรุงเทพ ในเมือง', time: '~45 นาที', sedan: '1,200', van: '1,800' },
    { from: 'สุวรรณภูมิ (BKK)', to: 'พัทยา', time: '~2 ชม.', sedan: '2,000', van: '2,800' },
    { from: 'สุวรรณภูมิ (BKK)', to: 'หัวหิน', time: '~3 ชม.', sedan: '3,000', van: '4,000' },
    { from: 'สุวรรณภูมิ (BKK)', to: 'เขาใหญ่', time: '~3 ชม.', sedan: '3,200', van: '4,200' },
    { from: 'ดอนเมือง (DMK)', to: 'กรุงเทพ ในเมือง', time: '~40 นาที', sedan: '1,000', van: '1,500' },
    { from: 'ดอนเมือง (DMK)', to: 'พัทยา', time: '~2.5 ชม.', sedan: '2,500', van: '3,200' },
  ]

  return (
    <section id="airport" style={{ padding: '120px 24px', background: '#12263A', position: 'relative' }}>
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(rgba(198,167,94,0.03) 1px, transparent 1px)', backgroundSize: '32px 32px', pointerEvents: 'none' }} />

      <div style={{ maxWidth: 1000, margin: '0 auto', position: 'relative' }}>
        <RevealSection>
          <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <span style={{ color: '#C6A75E', fontSize: 13, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', display: 'block', marginBottom: 12 }}>Airport Transfer</span>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 700, color: '#FFFFFF' }}>
              รับส่งสนามบิน <span className="gold-shimmer">ราคาเหมาจ่าย</span>
            </h2>
            <div style={{ width: 60, height: 3, background: 'linear-gradient(90deg, #B9973E, #E5C97A)', margin: '16px auto 0', borderRadius: 2 }} />
            <p style={{ color: '#9CA3AF', marginTop: 20, fontSize: 15, maxWidth: 500, margin: '20px auto 0' }}>
              ราคาตายตัว ไม่มีค่าใช้จ่ายแฝง รวมค่าน้ำมัน ค่าทางด่วน และค่าจอดรถแล้ว
            </p>
          </div>
        </RevealSection>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {routes.map((r, i) => (
            <RevealSection key={i} delay={i * 0.06}>
              <div className="glass-card" style={{ padding: '20px 28px', display: 'grid', gridTemplateColumns: '1fr auto', alignItems: 'center', gap: 20, borderBottom: i < routes.length - 1 ? '1px solid rgba(198,167,94,0.06)' : 'none' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                    <span style={{ fontWeight: 600, fontSize: 15, color: '#FFFFFF' }}>{r.from}</span>
                    <span style={{ color: '#C6A75E', fontSize: 18, fontWeight: 700 }}>→</span>
                    <span style={{ fontWeight: 700, fontSize: 15, color: '#F5F5F5' }}>{r.to}</span>
                  </div>
                  <span style={{ fontSize: 12, color: '#C6A75E', marginTop: 6, display: 'inline-block', background: 'rgba(198,167,94,0.1)', padding: '3px 10px', borderRadius: 50, fontWeight: 600 }}>
                    🕐 {r.time}
                  </span>
                </div>
                <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 11, color: '#9CA3AF', marginBottom: 4, letterSpacing: 0.5, fontWeight: 600 }}>🚗 Sedan</div>
                    <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700, color: '#F5F5F5' }}>฿{r.sedan}</div>
                  </div>
                  <div style={{ width: 1, height: 36, background: 'rgba(198,167,94,0.15)' }} />
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 11, color: '#C6A75E', marginBottom: 4, letterSpacing: 0.5, fontWeight: 600 }}>🚐 VAN</div>
                    <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700, color: '#C6A75E' }}>฿{r.van}</div>
                  </div>
                </div>
              </div>
            </RevealSection>
          ))}
        </div>

        <RevealSection delay={0.4}>
          <div style={{ textAlign: 'center', marginTop: 40 }}>
            <a href="/booking" style={{ background: 'linear-gradient(135deg, #B9973E, #E5C97A)', color: '#0B1C2D', padding: '16px 40px', borderRadius: 50, textDecoration: 'none', fontSize: 16, fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 8, boxShadow: '0 4px 20px rgba(198,167,94,0.3)' }}>
              📋 จองรถรับส่งสนามบิน
            </a>
          </div>
        </RevealSection>
      </div>
    </section>
  )
}
