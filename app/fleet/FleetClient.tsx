'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import type { Vehicle } from '@/lib/data'

const FILTERS = [
  { label: 'ทั้งหมด', value: 'all' },
  { label: 'VIP', value: 'VIP' },
  { label: 'Standard', value: 'Standard' },
  { label: 'Executive', value: 'Executive' },
  { label: 'Premium', value: 'Premium' },
  { label: 'Luxury', value: 'Luxury' },
  { label: 'Sedan (รถเก๋ง)', value: 'Sedan' },
]

export default function FleetClient({ fleet, lineUrl }: { fleet: Vehicle[]; lineUrl: string }) {
  const [filter, setFilter] = useState('all')
  const filtered = filter === 'all' ? fleet : fleet.filter((v) => v.type === filter)

  return (
    <>
      {/* Filter Tabs */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center', marginBottom: 40 }}>
        {FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            style={{
              padding: '10px 24px',
              borderRadius: 50,
              border: filter === f.value ? '1px solid #C6A75E' : '1px solid rgba(198,167,94,0.2)',
              background: filter === f.value ? 'rgba(198,167,94,0.15)' : 'transparent',
              color: filter === f.value ? '#C6A75E' : '#9CA3AF',
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.3s',
            }}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Vehicle Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 24 }}>
        {filtered.map((v) => (
          <Link
            key={v.slug}
            href={`/fleet/${v.slug}`}
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            <div className="card-navy" style={{ overflow: 'hidden', cursor: 'pointer' }}>
              <div style={{ position: 'relative', width: '100%', height: 220, background: '#1A2F45' }}>
                <Image
                  src={v.image}
                  alt={`${v.name} ${v.type}`}
                  fill
                  sizes="(max-width: 768px) 100vw, 400px"
                  style={{ objectFit: 'cover' }}
                />
                <div style={{ position: 'absolute', top: 12, left: 12, background: v.badgeColor, color: '#FFFFFF', fontSize: 11, fontWeight: 700, padding: '4px 12px', borderRadius: 50 }}>
                  {v.badge}
                </div>
              </div>

              <div style={{ padding: '20px 24px 24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                  <div>
                    <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 700, color: '#FFFFFF', margin: 0 }}>{v.name}</h3>
                    <span style={{ fontSize: 12, color: '#C6A75E', fontWeight: 600 }}>{v.type}</span>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 20, fontWeight: 700, color: '#C6A75E' }}>฿{v.price}</div>
                    <div style={{ fontSize: 11, color: '#9CA3AF' }}>/วัน</div>
                  </div>
                </div>

                <p style={{ fontSize: 13, color: '#9CA3AF', lineHeight: 1.6, marginBottom: 16 }}>{v.description}</p>

                <div style={{ display: 'flex', gap: 16, fontSize: 13, color: '#9CA3AF' }}>
                  <span>🪑 {v.seats} ที่นั่ง</span>
                  <span>🧳 {v.bags} กระเป๋า</span>
                </div>

                <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <span style={{ padding: '8px 16px', borderRadius: 50, border: '1px solid rgba(198,167,94,0.3)', color: '#C6A75E', fontSize: 13, fontWeight: 600, textAlign: 'center' }}>
                    ดูรายละเอียด →
                  </span>
                  <span
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); window.location.href = '/booking' }}
                    style={{ padding: '8px 16px', borderRadius: 50, background: 'linear-gradient(135deg, #B9973E, #E5C97A)', color: '#0B1C2D', fontSize: 13, fontWeight: 700, textAlign: 'center', cursor: 'pointer', boxShadow: '0 2px 12px rgba(198,167,94,0.3)' }}
                  >
                    จองเลย
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px 24px', color: '#9CA3AF' }}>
          ไม่พบรถในหมวดนี้
        </div>
      )}

      {/* CTA */}
      <div style={{ textAlign: 'center', marginTop: 60 }}>
        <p style={{ color: '#9CA3AF', fontSize: 15, marginBottom: 20 }}>
          ไม่แน่ใจว่ารถรุ่นไหนเหมาะกับคุณ? ปรึกษาเราได้เลย
        </p>
        <Link
          href="/booking"
          style={{
            display: 'inline-block',
            background: 'linear-gradient(135deg, #B9973E, #E5C97A)',
            color: '#0B1C2D',
            padding: '16px 40px',
            borderRadius: 50,
            fontSize: 16,
            fontWeight: 700,
            textDecoration: 'none',
            boxShadow: '0 4px 20px rgba(198,167,94,0.3)',
          }}
        >
          📋 จองรถเลย
        </Link>
      </div>
    </>
  )
}
