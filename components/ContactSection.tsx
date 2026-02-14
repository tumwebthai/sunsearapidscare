'use client'

import RevealSection from './RevealSection'

export default function ContactSection() {
  return (
    <section
      id="contact"
      style={{ padding: '120px 24px', background: '#0B1C2D', position: 'relative', textAlign: 'center' }}
    >
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 600, height: 600, background: 'radial-gradient(circle, rgba(198,167,94,0.04) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <div style={{ position: 'relative', maxWidth: 600, margin: '0 auto' }}>
        <RevealSection>
          <span style={{ color: '#C6A75E', fontSize: 13, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', display: 'block', marginBottom: 12 }}>Contact Us</span>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 700, marginBottom: 16, color: '#FFFFFF' }}>
            พร้อมเดินทาง? <span className="gold-shimmer">ติดต่อเราเลย</span>
          </h2>
          <div style={{ width: 60, height: 3, background: 'linear-gradient(90deg, #B9973E, #E5C97A)', margin: '0 auto 20px', borderRadius: 2 }} />
          <p style={{ color: '#9CA3AF', fontSize: 15, lineHeight: 1.7, marginBottom: 40 }}>
            สอบถามราคา จองรถ หรือปรึกษาการเดินทาง ทีมงานพร้อมให้บริการตลอด 24 ชั่วโมง
          </p>
        </RevealSection>

        <RevealSection delay={0.2}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center' }}>
            <a href="https://line.me/R/ti/p/@sunsearapidscare" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, width: '100%', maxWidth: 360, padding: '16px 32px', borderRadius: 14, textDecoration: 'none', fontSize: 15, fontWeight: 700, background: '#06C755', color: '#FFFFFF', boxShadow: '0 4px 20px rgba(6,199,85,0.3)', transition: 'all 0.3s' }}>
              <span style={{ fontSize: 18 }}>💬</span> LINE @sunsearapidscare
            </a>
            <a href="tel:0812345678" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, width: '100%', maxWidth: 360, padding: '16px 32px', borderRadius: 14, textDecoration: 'none', fontSize: 15, fontWeight: 700, background: 'linear-gradient(135deg, #B9973E, #E5C97A)', color: '#0B1C2D', boxShadow: '0 4px 20px rgba(198,167,94,0.3)', transition: 'all 0.3s' }}>
              <span style={{ fontSize: 18 }}>📞</span> 081-234-5678
            </a>
            <a href="https://wa.me/66812345678" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, width: '100%', maxWidth: 360, padding: '16px 32px', borderRadius: 14, textDecoration: 'none', fontSize: 15, fontWeight: 700, background: 'transparent', border: '1px solid rgba(198,167,94,0.3)', color: '#FFFFFF', transition: 'all 0.3s' }}>
              <span style={{ fontSize: 18 }}>📱</span> WhatsApp
            </a>
          </div>
        </RevealSection>

        <RevealSection delay={0.35}>
          <div style={{ marginTop: 40, fontSize: 13, color: '#9CA3AF', lineHeight: 1.8 }}>
            📍 กรุงเทพมหานคร &nbsp;|&nbsp; 📧 info@sunsearapidscare.com
          </div>
        </RevealSection>
      </div>
    </section>
  )
}
