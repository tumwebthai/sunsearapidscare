'use client'

import { useState } from 'react'
import type { FaqGroup } from '@/lib/data'

export default function FaqAccordion({ groups }: { groups: FaqGroup[] }) {
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({})

  const toggle = (key: string) => {
    setOpenItems((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
      {groups.map((group, gi) => (
        <div key={gi}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 700, color: '#FFFFFF', marginBottom: 16, paddingBottom: 12, borderBottom: '1px solid rgba(198,167,94,0.15)' }}>
            {group.category}
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {group.items.map((item, qi) => {
              const key = `${gi}-${qi}`
              const isOpen = openItems[key]
              return (
                <div key={key} className="faq-card" style={{ overflow: 'hidden' }}>
                  <button
                    onClick={() => toggle(key)}
                    style={{
                      width: '100%',
                      padding: '18px 24px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      textAlign: 'left',
                    }}
                  >
                    <span style={{ fontSize: 15, fontWeight: 600, color: isOpen ? '#C6A75E' : '#FFFFFF', flex: 1, paddingRight: 12 }}>
                      {item.q}
                    </span>
                    <span style={{ fontSize: 20, color: '#C6A75E', transition: 'transform 0.3s', transform: isOpen ? 'rotate(45deg)' : 'rotate(0)', flexShrink: 0 }}>
                      +
                    </span>
                  </button>
                  {isOpen && (
                    <div style={{ padding: '0 24px 18px', fontSize: 14, color: '#9CA3AF', lineHeight: 1.7 }}>
                      {item.a}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
