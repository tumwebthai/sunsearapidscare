'use client'

import { useTypewriter } from './hooks'

export default function Hero() {
  const typedText = useTypewriter(
    [
      'รับส่งสนามบิน ตรงเวลา',
      'ท่องเที่ยวทั่วไทย สะดวกสบาย',
      'ผู้บริหาร VIP ปลอดภัย 100%',
      'ราคาโปร่งใส ไม่มีค่าใช้จ่ายแฝง',
    ],
    70,
    35,
    2500
  )

  const stats = [
    { num: '500+', label: 'คนขับในเครือข่าย' },
    { num: '4.9', label: 'คะแนนเฉลี่ย' },
    { num: '24/7', label: 'บริการตลอด' },
    { num: '100%', label: 'ถูกกฎหมาย' },
  ]

  return (
    <section id="hero" className="hero-section" style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', overflow: 'hidden', background: '#0B1C2D' }}>
      <video
        autoPlay loop muted playsInline
        poster="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1920' height='1080'%3E%3Crect fill='%230B1C2D'/%3E%3C/svg%3E"
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.2, filter: 'brightness(0.35) contrast(1.2)' }}
      >
        <source src="/videos/hero-bg.mp4" type="video/mp4" />
      </video>

      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(11,28,45,0.7) 0%, rgba(11,28,45,0.3) 40%, rgba(11,28,45,0.9) 100%)', zIndex: 1 }} />
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 30% 50%, rgba(198,167,94,0.06) 0%, transparent 60%)', zIndex: 1 }} />

      <div className="hero-content" style={{ position: 'relative', zIndex: 2, maxWidth: 1200, margin: '0 auto', padding: '160px 24px 100px', width: '100%' }}>
        {/* Badge */}
        <div className="hero-badge" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(198,167,94,0.1)', border: '1px solid rgba(198,167,94,0.25)', borderRadius: 50, padding: '8px 20px', marginBottom: 28 }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#C6A75E', boxShadow: '0 0 12px #C6A75E', animation: 'pulse 2s infinite' }} />
          <span style={{ color: '#C6A75E', fontSize: 12, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase' }}>
            Premium Chauffeur Service
          </span>
        </div>

        {/* Heading */}
        <h1 className="hero-title" style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(36px, 6vw, 72px)', fontWeight: 700, lineHeight: 1.15, maxWidth: 800, marginBottom: 12, color: '#FFFFFF' }}>
          บริการรถตู้ <span className="gold-shimmer">VIP</span>
          <br />
          พร้อมคนขับมืออาชีพ
        </h1>

        {/* Typewriter */}
        <div className="hero-sub" style={{ fontSize: 'clamp(16px, 2.2vw, 22px)', color: '#F5F5F5', fontWeight: 400, minHeight: 36, marginBottom: 48 }}>
          {typedText}
          <span style={{ display: 'inline-block', width: 2, height: '1em', background: '#C6A75E', marginLeft: 2, animation: 'pulse 1s infinite', verticalAlign: 'text-bottom' }} />
        </div>

        {/* CTA */}
        <div className="cta-buttons" style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 72 }}>
          <a href="/booking" style={{ background: 'linear-gradient(135deg, #B9973E, #E5C97A)', color: '#0B1C2D', padding: '16px 36px', borderRadius: 50, textDecoration: 'none', fontSize: 16, fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 8, boxShadow: '0 4px 24px rgba(198,167,94,0.35)' }}>
            📋 จองรถเลย
          </a>
          <a href="/fleet" style={{ background: 'transparent', color: '#F5F5F5', padding: '16px 36px', borderRadius: 50, textDecoration: 'none', fontSize: 16, fontWeight: 600, border: '1px solid rgba(198,167,94,0.35)', display: 'inline-flex', alignItems: 'center', gap: 8, transition: 'all 0.3s' }}>
            🚐 ดูรถทั้งหมด
          </a>
        </div>

        {/* Stats */}
        <div className="hero-stats" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20, maxWidth: 600 }}>
          {stats.map((s, i) => (
            <div key={i} style={{ textAlign: 'center', padding: '16px 8px', background: 'rgba(255,255,255,0.03)', borderRadius: 12, border: '1px solid rgba(198,167,94,0.1)' }}>
              <div className="stat-num" style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 700, color: '#C6A75E', marginBottom: 4 }}>{s.num}</div>
              <div style={{ fontSize: 12, color: '#9CA3AF', fontWeight: 500, letterSpacing: 0.5 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator — hidden on mobile via CSS */}
      <div className="hero-scroll" style={{ position: 'absolute', bottom: 32, left: '50%', transform: 'translateX(-50%)', zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, animation: 'float 2s ease-in-out infinite' }}>
        <span style={{ fontSize: 10, letterSpacing: 3, color: 'rgba(198,167,94,0.5)', textTransform: 'uppercase' }}>Scroll</span>
        <div style={{ width: 1, height: 30, background: 'linear-gradient(180deg, rgba(198,167,94,0.4), transparent)' }} />
      </div>
    </section>
  )
}
