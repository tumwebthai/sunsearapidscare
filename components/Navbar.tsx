'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  const links = [
    { label: 'รถของเรา', href: '/fleet' },
    { label: 'รับส่งสนามบิน', href: '/airport-transfer' },
    { label: 'เกี่ยวกับเรา', href: '/about' },
    { label: 'รีวิว', href: '/#reviews' },
    { label: 'FAQ', href: '/faq' },
  ]

  return (
    <>
      <nav
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          padding: scrolled ? '10px 0' : '16px 0',
          background: scrolled ? '#0B1C2D' : 'transparent',
          boxShadow: scrolled ? '0 10px 30px rgba(0,0,0,0.4)' : 'none',
          transition: 'all 0.3s ease',
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: '0 auto',
            padding: '0 24px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 28, filter: 'drop-shadow(0 0 8px rgba(198,167,94,0.4))' }}>☀️</span>
            <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700, letterSpacing: 1 }}>
              <span style={{ color: '#C6A75E' }}>SunSea</span>
              <span style={{ color: '#FFFFFF' }}>RapidsCare</span>
            </span>
          </Link>

          <div style={{ display: 'flex', gap: 32, alignItems: 'center' }} className="desktop-nav">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                style={{ color: '#FFFFFF', textDecoration: 'none', fontSize: 14, fontWeight: 500, letterSpacing: 0.5, opacity: 0.85, transition: 'all 0.3s' }}
                onMouseEnter={(e) => { const el = e.target as HTMLElement; el.style.color = '#C6A75E'; el.style.opacity = '1' }}
                onMouseLeave={(e) => { const el = e.target as HTMLElement; el.style.color = '#FFFFFF'; el.style.opacity = '0.85' }}
              >
                {l.label}
              </Link>
            ))}
            <Link
              href="/booking"
              style={{ background: 'linear-gradient(135deg, #B9973E, #E5C97A)', color: '#0B1C2D', padding: '10px 24px', borderRadius: 50, textDecoration: 'none', fontSize: 14, fontWeight: 700, boxShadow: '0 4px 20px rgba(198,167,94,0.3)' }}
            >
              จองเลย
            </Link>
          </div>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="mobile-hamburger"
            aria-label="Toggle menu"
            style={{ display: 'none', background: 'none', border: 'none', cursor: 'pointer', color: '#C6A75E', fontSize: 26, width: 44, height: 44, alignItems: 'center', justifyContent: 'center' }}
          >
            ☰
          </button>
        </div>
      </nav>

      {mobileOpen && (
        <div className="mobile-menu-overlay">
          <button
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu"
            style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', color: '#FFFFFF', fontSize: 28, cursor: 'pointer', width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            ✕
          </button>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0 }}>
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setMobileOpen(false)}
                style={{ color: '#FFFFFF', textDecoration: 'none', fontSize: 20, fontWeight: 600, letterSpacing: 0.5, padding: '18px 0', textAlign: 'center' }}
              >
                {l.label}
              </Link>
            ))}
          </div>

          <Link
            href="/booking"
            onClick={() => setMobileOpen(false)}
            style={{ marginTop: 40, width: '80%', maxWidth: 320, background: 'linear-gradient(135deg, #B9973E, #E5C97A)', color: '#0B1C2D', padding: '16px 32px', borderRadius: 50, textDecoration: 'none', fontSize: 16, fontWeight: 700, textAlign: 'center', display: 'block' }}
          >
            📋 จองรถเลย
          </Link>
        </div>
      )}
    </>
  )
}
