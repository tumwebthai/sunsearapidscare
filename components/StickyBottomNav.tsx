'use client'

import { useState, useEffect } from 'react'

const NAV_ITEMS = [
  { icon: '🚐', label: 'รถ', href: '/fleet', sectionId: '' },
  { icon: '✈️', label: 'สนามบิน', href: '/airport-transfer', sectionId: '' },
  { icon: '⭐', label: 'รีวิว', href: '/#reviews', sectionId: 'reviews' },
  { icon: '📋', label: 'จอง', href: '/booking', sectionId: '' },
]

export default function StickyBottomNav() {
  const [activeSection, setActiveSection] = useState('')

  useEffect(() => {
    const sectionIds = ['fleet', 'airport', 'reviews', 'standards', 'faq', 'contact', 'gallery']
    const observers: IntersectionObserver[] = []

    sectionIds.forEach((id) => {
      const el = document.getElementById(id)
      if (!el) return
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveSection(id)
          }
        },
        { threshold: 0.3, rootMargin: '-70px 0px -30% 0px' }
      )
      observer.observe(el)
      observers.push(observer)
    })

    return () => observers.forEach((o) => o.disconnect())
  }, [])

  return (
    <div
      className="bottom-nav"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 90,
        background: '#0B1C2D',
        borderTop: '1px solid rgba(198,167,94,0.25)',
        height: 60,
        padding: '8px 0',
        paddingBottom: 'env(safe-area-inset-bottom, 8px)',
        display: 'none',
      }}
    >
      <div style={{ display: 'flex', width: '100%', height: '100%' }}>
        {NAV_ITEMS.map((item, i) => {
          const isActive = item.sectionId ? activeSection === item.sectionId : false
          const isBook = item.sectionId === ''
          const color = isActive || isBook ? '#C6A75E' : '#9CA3AF'

          return (
            <a
              key={i}
              href={item.href}
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textDecoration: 'none',
                gap: 2,
                transition: 'color 0.2s',
                color,
              }}
            >
              <span style={{ fontSize: 20, lineHeight: 1 }}>{item.icon}</span>
              <span style={{ fontSize: 10, fontWeight: 500 }}>{item.label}</span>
            </a>
          )
        })}
      </div>
    </div>
  )
}
