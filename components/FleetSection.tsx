'use client'

import { useRef, useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import RevealSection from './RevealSection'

export default function FleetSection() {
  const fleet = [
    { slug: 'toyota-commuter-vip', image: '/images/fleet/toyota-commuter-vip.webp', badge: 'ยอดนิยม', type: 'VIP', name: 'Toyota Commuter All New', desc: 'รถตู้ VIP สุดหรู เบาะปรับนอนได้ เหมาะสำหรับทริปท่องเที่ยวและงานบริษัท', seats: 9, bags: 9, price: '3,000', badgeColor: '#C6A75E' },
    { slug: 'toyota-commuter-standard', image: '/images/fleet/toyota-commuter-standard.webp', badge: 'ประหยัด', type: 'Standard', name: 'Toyota Commuter All New', desc: 'รถตู้มาตรฐาน จุคนได้เยอะ เหมาะสำหรับหมู่คณะและรับส่งพนักงาน', seats: 13, bags: 10, price: '1,800', badgeColor: '#3B82F6' },
    { slug: 'hyundai-h1-vip', image: '/images/fleet/hyundai-h1-vip.webp', badge: 'VIP', type: 'VIP', name: 'Hyundai H1', desc: 'หรูหรา นั่งสบาย เหมาะสำหรับผู้บริหารและครอบครัวเล็ก', seats: 5, bags: 4, price: '2,500', badgeColor: '#C6A75E' },
    { slug: 'toyota-alphard-executive', image: '/images/fleet/toyota-alphard-executive.webp', badge: 'Executive', type: 'Executive', name: 'Toyota Alphard', desc: 'ระดับ Executive สำหรับผู้บริหารและแขก VIP ความเป็นส่วนตัวสูงสุด', seats: 4, bags: 3, price: '4,500', badgeColor: '#7C3AED' },
    { slug: 'toyota-majesty-premium', image: '/images/fleet/toyota-majesty-premium.webp', badge: 'Premium', type: 'Premium', name: 'Toyota Majesty', desc: 'พรีเมียมแวน นั่งสบาย ดีไซน์หรู ทริปครอบครัวและกลุ่มเล็ก', seats: 7, bags: 5, price: '3,500', badgeColor: '#C6A75E' },
    { slug: 'hyundai-staria-luxury', image: '/images/fleet/hyundai-staria-luxury.webp', badge: 'Luxury', type: 'Luxury', name: 'Hyundai Staria', desc: 'แวนหรูดีไซน์แห่งอนาคต นั่งสบายระดับ First Class', seats: 7, bags: 5, price: '3,500', badgeColor: '#DC2626' },
  ]

  const scrollRef = useRef<HTMLDivElement>(null)
  const [activeIdx, setActiveIdx] = useState(0)

  const scroll = (dir: number) => {
    if (!scrollRef.current) return
    const w = scrollRef.current.children[0]?.clientWidth || 280
    scrollRef.current.scrollBy({ left: dir * (w + 16), behavior: 'smooth' })
  }

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    const onScroll = () => {
      const w = el.children[0]?.clientWidth || 280
      setActiveIdx(Math.round(el.scrollLeft / (w + 16)))
    }
    el.addEventListener('scroll', onScroll, { passive: true })
    return () => el.removeEventListener('scroll', onScroll)
  }, [])

  const renderCard = (car: typeof fleet[0], i: number) => (
    <Link href={`/fleet/${car.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
      <div className="card-navy" style={{ padding: 0, position: 'relative', overflow: 'hidden', cursor: 'pointer' }}>
        <div style={{ position: 'relative', overflow: 'hidden' }}>
          <Image
            src={car.image}
            alt={`${car.name} ${car.type} - เช่ารถตู้ VIP พร้อมคนขับ`}
            width={800} height={500} quality={85}
            loading={i < 3 ? 'eager' : 'lazy'}
            className="fleet-car-image"
            style={{ width: '100%', height: 220, objectFit: 'cover', display: 'block', transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)' }}
          />
          <span style={{ position: 'absolute', top: 12, left: 12, background: car.badgeColor, color: '#FFFFFF', padding: '5px 14px', borderRadius: 50, fontSize: 11, fontWeight: 700, letterSpacing: 1, boxShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>
            {car.badge}
          </span>
        </div>

        <div style={{ padding: '20px 24px 24px' }}>
          <div style={{ marginBottom: 10 }}>
            <div style={{ fontSize: 11, color: '#C6A75E', fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 4 }}>{car.type}</div>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700, color: '#FFFFFF' }}>{car.name}</h3>
          </div>
          <p style={{ fontSize: 14, color: '#9CA3AF', lineHeight: 1.6, marginBottom: 16, minHeight: 44 }}>{car.desc}</p>
          <div style={{ display: 'flex', gap: 16, marginBottom: 16, fontSize: 13, color: '#F5F5F5', fontWeight: 600 }}>
            <span>💺 {car.seats} ที่นั่ง</span>
            <span>🧳 {car.bags} กระเป๋า</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(198,167,94,0.1)', paddingTop: 16, marginBottom: 12 }}>
            <div>
              <span style={{ fontSize: 11, color: '#9CA3AF' }}>เริ่มต้น</span>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 700, color: '#C6A75E' }}>
                ฿{car.price}<span style={{ fontSize: 13, fontWeight: 400, color: '#9CA3AF' }}>/วัน</span>
              </div>
            </div>
            <span style={{ fontSize: 13, color: 'rgba(198,167,94,0.8)', fontWeight: 600 }}>
              ดูรายละเอียด →
            </span>
          </div>
          <span
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); window.location.href = '/booking' }}
            style={{ display: 'block', textAlign: 'center', background: 'linear-gradient(135deg, #B9973E, #E5C97A)', color: '#0B1C2D', padding: '10px 20px', borderRadius: 50, fontSize: 13, fontWeight: 700, cursor: 'pointer', boxShadow: '0 2px 12px rgba(198,167,94,0.3)' }}
          >
            จองเลย
          </span>
        </div>
      </div>
    </Link>
  )

  return (
    <section id="fleet" style={{ padding: '120px 24px', background: '#0B1C2D' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <RevealSection>
          <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <span style={{ color: '#C6A75E', fontSize: 13, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', display: 'block', marginBottom: 12 }}>
              Our Fleet
            </span>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 700, lineHeight: 1.2, color: '#FFFFFF' }}>
              รถตู้ VIP พร้อมคนขับ <span className="gold-shimmer">เลือกได้ตามใจ</span>
            </h2>
            <div style={{ width: 60, height: 3, background: 'linear-gradient(90deg, #B9973E, #E5C97A)', margin: '16px auto 0', borderRadius: 2 }} />
          </div>
        </RevealSection>

        {/* Desktop: 3-column grid */}
        <div className="fleet-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
          {fleet.map((car, i) => (
            <RevealSection key={i} delay={i * 0.08}>
              {renderCard(car, i)}
            </RevealSection>
          ))}
        </div>

        {/* Mobile: Carousel */}
        <div className="fleet-mobile" style={{ display: 'none', position: 'relative' }}>
          {/* Arrow buttons */}
          <button onClick={() => scroll(-1)} style={{ position: 'absolute', top: '40%', left: -8, zIndex: 10, background: 'rgba(198,167,94,0.15)', border: '1px solid rgba(198,167,94,0.3)', borderRadius: '50%', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#C6A75E', fontSize: 18 }}>‹</button>
          <button onClick={() => scroll(1)} style={{ position: 'absolute', top: '40%', right: -8, zIndex: 10, background: 'rgba(198,167,94,0.15)', border: '1px solid rgba(198,167,94,0.3)', borderRadius: '50%', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#C6A75E', fontSize: 18 }}>›</button>

          <div ref={scrollRef} className="fleet-carousel" style={{ padding: '0 4px' }}>
            {fleet.map((car, i) => (
              <div key={i} style={{ width: '75vw', maxWidth: 320 }}>
                {renderCard(car, i)}
              </div>
            ))}
          </div>

          {/* Dot indicators */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 16 }}>
            {fleet.map((_, i) => (
              <div key={i} style={{ width: activeIdx === i ? 20 : 8, height: 8, borderRadius: 4, background: activeIdx === i ? '#C6A75E' : '#1A2F45', transition: 'all 0.3s' }} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
