'use client'

import { useState } from 'react'

export default function VehicleFaq({ faq }: { faq: { q: string; a: string }[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {faq.map((f, i) => (
        <div key={i} className="faq-card" style={{ overflow: 'hidden' }}>
          <button
            onClick={() => setOpenIndex(openIndex === i ? null : i)}
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
            <span style={{ fontSize: 15, fontWeight: 600, color: openIndex === i ? '#C6A75E' : '#FFFFFF' }}>
              {f.q}
            </span>
            <span style={{ fontSize: 20, color: '#C6A75E', transition: 'transform 0.3s', transform: openIndex === i ? 'rotate(45deg)' : 'rotate(0)' }}>
              +
            </span>
          </button>
          {openIndex === i && (
            <div style={{ padding: '0 24px 18px', fontSize: 14, color: '#9CA3AF', lineHeight: 1.7 }}>
              {f.a}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
