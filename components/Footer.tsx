'use client'

import { useState, useEffect } from 'react'
import { mergeSocialLinks } from '@/lib/social'
import type { SocialLink } from '@/lib/social'

function SocialIcon({ s, size = 32 }: { s: SocialLink; size?: number }) {
  const bg = s.bgGradient || s.color
  return (
    <a
      href={s.href}
      target={s.href.startsWith('http') ? '_blank' : undefined}
      rel={s.href.startsWith('http') ? 'noopener noreferrer' : undefined}
      title={s.name}
      className="social-icon-btn"
      style={{
        width: size + 12,
        height: size + 12,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '50%',
        background: bg,
        color: s.name === 'Lemon8' ? '#0B1C2D' : '#FFFFFF',
        textDecoration: 'none',
        transition: 'transform 0.2s, filter 0.2s',
        flexShrink: 0,
      }}
    >
      <svg viewBox="0 0 24 24" width={size * 0.55} height={size * 0.55} dangerouslySetInnerHTML={{ __html: s.svg }} />
    </a>
  )
}

export default function Footer() {
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>(() => mergeSocialLinks({}))

  useEffect(() => {
    fetch('/api/settings/social')
      .then((r) => r.json())
      .then((urls) => setSocialLinks(mergeSocialLinks(urls)))
      .catch(() => {})
  }, [])

  const contactLinks = socialLinks.filter((s) => s.group === 'contact')
  const followLinks = socialLinks.filter((s) => s.group === 'follow')

  return (
    <footer style={{ position: 'relative', overflow: 'hidden', background: '#0B1C2D' }}>
      {/* Top gold ornamental line */}
      <div style={{ height: 1, background: 'linear-gradient(90deg, transparent 5%, rgba(198,167,94,0.4) 30%, rgba(198,167,94,0.7) 50%, rgba(198,167,94,0.4) 70%, transparent 95%)' }} />
      <div style={{ height: 1, marginTop: 3, background: 'linear-gradient(90deg, transparent 15%, rgba(198,167,94,0.1) 40%, rgba(198,167,94,0.2) 50%, rgba(198,167,94,0.1) 60%, transparent 85%)' }} />

      <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: 800, height: 300, background: 'radial-gradient(ellipse, rgba(198,167,94,0.03) 0%, transparent 70%)', pointerEvents: 'none' }} />

      {/* 3-Column Grid */}
      <div
        className="footer-grid"
        style={{ maxWidth: 1200, margin: '0 auto', padding: '60px 24px 40px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 40, position: 'relative' }}
      >
        {/* Col 1: Brand */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
            <span style={{ fontSize: 30, filter: 'drop-shadow(0 0 10px rgba(198,167,94,0.4))' }}>☀️</span>
            <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 700 }}>
              <span style={{ color: '#C6A75E' }}>SunSea</span>
              <span style={{ color: '#FFFFFF' }}>RapidsCare</span>
            </span>
          </div>
          <p style={{ fontSize: 14, color: '#9CA3AF', lineHeight: 1.8, marginBottom: 24 }}>
            บริการเช่ารถตู้ VIP พร้อมคนขับมืออาชีพ รับส่งสนามบิน ท่องเที่ยวทั่วไทย มาตรฐานพรีเมียม ปลอดภัย ตรงเวลา
          </p>

          {/* Social Icons — ติดต่อเรา */}
          {contactLinks.length > 0 && (
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: '#C6A75E', letterSpacing: 1, marginBottom: 10, textTransform: 'uppercase' }}>ติดต่อเรา</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                {contactLinks.map((s) => <SocialIcon key={s.name} s={s} size={32} />)}
              </div>
            </div>
          )}

          {/* Social Icons — ติดตามเรา */}
          {followLinks.length > 0 && (
            <div>
              <div style={{ fontSize: 11, fontWeight: 600, color: '#C6A75E', letterSpacing: 1, marginBottom: 10, textTransform: 'uppercase' }}>ติดตามเรา</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                {followLinks.map((s) => <SocialIcon key={s.name} s={s} size={32} />)}
              </div>
            </div>
          )}
        </div>

        {/* Col 2: Service Links */}
        <div className="footer-col-center" style={{ borderLeft: '1px solid rgba(198,167,94,0.12)', borderRight: '1px solid rgba(198,167,94,0.12)', paddingLeft: 40, paddingRight: 40 }}>
          <h4 style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, fontWeight: 600, color: '#C6A75E', marginBottom: 20, letterSpacing: 1 }}>
            บริการของเรา
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              { label: '🚐 เช่ารถตู้ VIP พร้อมคนขับ', href: '#fleet' },
              { label: '✈️ รับส่งสนามบิน', href: '#airport' },
              { label: '🏖️ ท่องเที่ยวทั่วไทย', href: '#fleet' },
              { label: '💼 รับส่งผู้บริหาร', href: '#fleet' },
              { label: '🏢 รับส่งพนักงานบริษัท', href: '#fleet' },
            ].map((link, i) => (
              <a
                key={i} href={link.href}
                style={{ color: '#9CA3AF', textDecoration: 'none', fontSize: 14, transition: 'all 0.3s', paddingLeft: 4, borderLeft: '2px solid transparent' }}
                onMouseEnter={(e) => { const el = e.currentTarget; el.style.color = '#C6A75E'; el.style.borderLeftColor = '#C6A75E'; el.style.paddingLeft = '12px' }}
                onMouseLeave={(e) => { const el = e.currentTarget; el.style.color = '#9CA3AF'; el.style.borderLeftColor = 'transparent'; el.style.paddingLeft = '4px' }}
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>

        {/* Col 3: Contact */}
        <div>
          <h4 style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, fontWeight: 600, color: '#C6A75E', marginBottom: 20, letterSpacing: 1 }}>
            ติดต่อเรา
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {[
              { icon: '📍', text: 'กรุงเทพมหานคร, ประเทศไทย' },
              { icon: '📞', text: '084-289-4662' },
              { icon: '📧', text: 'info@sunsearapidscare.com' },
              { icon: '💬', text: 'LINE: @sunsearapidscare' },
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 8, background: 'rgba(198,167,94,0.06)', border: '1px solid rgba(198,167,94,0.12)', fontSize: 14, flexShrink: 0 }}>
                  {item.icon}
                </span>
                <span style={{ fontSize: 14, color: '#F5F5F5' }}>{item.text}</span>
              </div>
            ))}
          </div>

          {/* Open 24/7 */}
          <div style={{ marginTop: 24, padding: '16px 20px', borderRadius: 12, background: 'rgba(198,167,94,0.04)', border: '1px solid rgba(198,167,94,0.12)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#4ade80', boxShadow: '0 0 8px rgba(74,222,128,0.5)' }} />
              <span style={{ fontSize: 12, color: '#4ade80', fontWeight: 600, letterSpacing: 0.5 }}>เปิดให้บริการ</span>
            </div>
            <div style={{ fontSize: 13, color: '#9CA3AF', lineHeight: 1.6 }}>
              ให้บริการ <span style={{ color: '#C6A75E', fontWeight: 600 }}>24 ชั่วโมง</span> ทุกวัน
              <br />
              จองล่วงหน้าอย่างน้อย 6 ชม.
            </div>
          </div>
        </div>
      </div>

      {/* Bottom separator */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
        <div style={{ height: 1, background: 'linear-gradient(90deg, transparent, rgba(198,167,94,0.2), transparent)' }} />
      </div>

      {/* Bottom bar */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '20px 24px 28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>&copy; 2026 SunSeaRapidsCare. สงวนลิขสิทธิ์ทุกประการ</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 20, height: 1, background: 'rgba(198,167,94,0.2)' }} />
          <div style={{ width: 6, height: 6, background: '#C6A75E', transform: 'rotate(45deg)', opacity: 0.4 }} />
          <div style={{ width: 20, height: 1, background: 'rgba(198,167,94,0.2)' }} />
        </div>
        <a href="#hero" style={{ fontSize: 12, color: 'rgba(198,167,94,0.5)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6, transition: 'color 0.3s' }}>
          กลับด้านบน &uarr;
        </a>
      </div>

      <style>{`
        .social-icon-btn:hover {
          transform: scale(1.15);
          filter: brightness(1.2);
        }
        @media (max-width: 768px) {
          .footer-grid {
            grid-template-columns: 1fr !important;
            gap: 32px !important;
          }
          .footer-col-center {
            border-left: none !important;
            border-right: none !important;
            padding-left: 0 !important;
            padding-right: 0 !important;
            border-top: 1px solid rgba(198,167,94,0.12);
            border-bottom: 1px solid rgba(198,167,94,0.12);
            padding-top: 32px;
            padding-bottom: 32px;
          }
        }
      `}</style>
    </footer>
  )
}
