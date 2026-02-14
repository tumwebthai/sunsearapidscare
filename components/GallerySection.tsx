'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Image from 'next/image'
import RevealSection from './RevealSection'

const scenes = [
  { image: '/images/scenes/scene-airport-pickup.webp', title: 'รับที่สนามบิน', desc: 'คนขับพร้อมป้ายชื่อรอรับล่วงหน้า 20 นาที', tag: 'Airport Pickup' },
  { image: '/images/scenes/scene-hotel-dropoff.webp', title: 'ส่งถึงโรงแรม', desc: 'บริการรับส่งถึงหน้าล็อบบี้ ช่วยยกกระเป๋า', tag: 'Hotel Drop-off' },
  { image: '/images/scenes/scene-interior-seaview.webp', title: 'ห้องโดยสารหรูหรา', desc: 'เบาะ VIP นั่งสบาย มองวิวระหว่างทาง', tag: 'VIP Interior' },
  { image: '/images/scenes/scene-group-travel.webp', title: 'ท่องเที่ยวเป็นกลุ่ม', desc: 'สนุกกับเพื่อนหรือครอบครัว ทริปเที่ยวทั่วไทย', tag: 'Group Travel' },
]

const ArrowLeft = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6" />
  </svg>
)

const ArrowRight = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 6 15 12 9 18" />
  </svg>
)

export default function GallerySection() {
  const [current, setCurrent] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const touchStartX = useRef(0)
  const touchEndX = useRef(0)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const total = scenes.length

  const goTo = useCallback((idx: number) => {
    setCurrent(((idx % total) + total) % total)
  }, [total])

  const next = useCallback(() => goTo(current + 1), [current, goTo])
  const prev = useCallback(() => goTo(current - 1), [current, goTo])

  // Auto-slide every 4 seconds
  useEffect(() => {
    if (isPaused) return
    intervalRef.current = setInterval(next, 4000)
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [next, isPaused])

  // Touch handlers
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
    setIsPaused(true)
  }

  const onTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX
  }

  const onTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current
    if (Math.abs(diff) > 50) {
      if (diff > 0) next()
      else prev()
    }
    setTimeout(() => setIsPaused(false), 3000)
  }

  return (
    <section id="gallery" style={{ padding: '120px 24px', background: '#0B1C2D', overflow: 'hidden' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <RevealSection>
          <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <span style={{ color: '#C6A75E', fontSize: 13, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', display: 'block', marginBottom: 12 }}>
              Our Service
            </span>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 700, color: '#FFFFFF' }}>
              ภาพ<span className="gold-shimmer">ประสบการณ์จริง</span>
            </h2>
            <div style={{ width: 60, height: 3, background: 'linear-gradient(90deg, #B9973E, #E5C97A)', margin: '16px auto 0', borderRadius: 2 }} />
            <p style={{ color: '#9CA3AF', marginTop: 20, fontSize: 15, maxWidth: 500, margin: '20px auto 0' }}>
              บริการระดับพรีเมียมที่ลูกค้าจากทั่วโลกไว้วางใจ
            </p>
          </div>
        </RevealSection>

        {/* ── Desktop Grid (>= 1024px) ── */}
        <div className="gallery-desktop-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
          {scenes.map((scene, i) => (
            <RevealSection key={i} delay={i * 0.1}>
              <div className="gallery-grid-item" style={{ position: 'relative', aspectRatio: '16 / 10', borderRadius: 16, overflow: 'hidden' }}>
                <Image
                  src={scene.image}
                  alt={`${scene.title} - SunSeaRapidsCare บริการเช่ารถตู้ VIP`}
                  fill
                  quality={85}
                  priority={i < 2}
                  loading={i < 2 ? 'eager' : 'lazy'}
                  sizes="(max-width: 1024px) 100vw, 580px"
                  className="gallery-grid-img"
                  style={{ objectFit: 'cover', transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)' }}
                />
                {/* Tag badge */}
                <span style={{
                  position: 'absolute', top: 16, right: 16,
                  background: 'rgba(11,28,45,0.8)', backdropFilter: 'blur(8px)',
                  border: '1px solid rgba(198,167,94,0.2)',
                  color: '#C6A75E', padding: '5px 14px', borderRadius: 50,
                  fontSize: 11, fontWeight: 700, letterSpacing: 1, zIndex: 2,
                }}>
                  {scene.tag}
                </span>
                {/* Caption overlay */}
                <div style={{
                  position: 'absolute', bottom: 0, left: 0, right: 0,
                  padding: '60px 24px 24px',
                  background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
                  zIndex: 2,
                }}>
                  <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700, color: '#FFFFFF', marginBottom: 6 }}>
                    {scene.title}
                  </h3>
                  <p style={{ fontSize: 14, color: '#D1D5DB', lineHeight: 1.5 }}>
                    {scene.desc}
                  </p>
                </div>
              </div>
            </RevealSection>
          ))}
        </div>

        {/* ── Mobile/Tablet Slideshow (< 1024px) ── */}
        <div className="gallery-mobile-slideshow">
          <div
            className="gallery-slideshow"
            style={{ position: 'relative', borderRadius: 16, overflow: 'hidden', userSelect: 'none' }}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            {/* Slides */}
            <div style={{
              display: 'flex',
              transition: 'transform 500ms cubic-bezier(0.4, 0, 0.2, 1)',
              transform: `translateX(-${current * 100}%)`,
            }}>
              {scenes.map((scene, i) => (
                <div key={i} style={{ minWidth: '100%', position: 'relative', aspectRatio: '16 / 9' }}>
                  <Image
                    src={scene.image}
                    alt={`${scene.title} - SunSeaRapidsCare`}
                    fill
                    quality={85}
                    priority={i === 0}
                    loading={i === 0 ? 'eager' : 'lazy'}
                    sizes="100vw"
                    style={{ objectFit: 'cover' }}
                  />
                  <span style={{
                    position: 'absolute', top: 16, right: 16,
                    background: 'rgba(11,28,45,0.8)', backdropFilter: 'blur(8px)',
                    border: '1px solid rgba(198,167,94,0.2)',
                    color: '#C6A75E', padding: '5px 14px', borderRadius: 50,
                    fontSize: 11, fontWeight: 700, letterSpacing: 1, zIndex: 2,
                  }}>
                    {scene.tag}
                  </span>
                  <div style={{
                    position: 'absolute', bottom: 0, left: 0, right: 0,
                    padding: '60px 24px 24px',
                    background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
                    zIndex: 2,
                  }}>
                    <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700, color: '#FFFFFF', marginBottom: 6 }}>
                      {scene.title}
                    </h3>
                    <p style={{ fontSize: 14, color: '#D1D5DB', lineHeight: 1.5 }}>
                      {scene.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Arrow buttons */}
            <button onClick={prev} className="gallery-arrow" aria-label="Previous" style={{
              position: 'absolute', top: '50%', left: 12, transform: 'translateY(-50%)',
              width: 40, height: 40, borderRadius: '50%',
              background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)',
              border: 'none', cursor: 'pointer', display: 'flex',
              alignItems: 'center', justifyContent: 'center', zIndex: 3, transition: 'background 0.2s',
            }}>
              <ArrowLeft />
            </button>
            <button onClick={next} className="gallery-arrow" aria-label="Next" style={{
              position: 'absolute', top: '50%', right: 12, transform: 'translateY(-50%)',
              width: 40, height: 40, borderRadius: '50%',
              background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)',
              border: 'none', cursor: 'pointer', display: 'flex',
              alignItems: 'center', justifyContent: 'center', zIndex: 3, transition: 'background 0.2s',
            }}>
              <ArrowRight />
            </button>

            {/* Dots */}
            <div style={{
              position: 'absolute', bottom: 16, left: '50%', transform: 'translateX(-50%)',
              display: 'flex', gap: 8, zIndex: 3,
            }}>
              {scenes.map((_, i) => (
                <button key={i} onClick={() => goTo(i)} aria-label={`Go to slide ${i + 1}`} style={{
                  width: current === i ? 10 : 8, height: current === i ? 10 : 8,
                  borderRadius: '50%',
                  background: current === i ? '#C6A75E' : 'rgba(255,255,255,0.4)',
                  border: 'none', cursor: 'pointer', transition: 'all 0.3s',
                  transform: current === i ? 'scale(1.2)' : 'scale(1)', padding: 0,
                }} />
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        /* Desktop: grid shown, slideshow hidden */
        .gallery-mobile-slideshow { display: none; }
        .gallery-grid-item:hover .gallery-grid-img { transform: scale(1.05); }
        .gallery-arrow { opacity: 0.7; transition: opacity 0.3s, background 0.2s; }
        .gallery-slideshow:hover .gallery-arrow { opacity: 1; }
        .gallery-arrow:hover { background: rgba(0,0,0,0.7) !important; }
        /* Mobile/Tablet (< 1024px): grid hidden, slideshow shown */
        @media (max-width: 1023px) {
          .gallery-desktop-grid { display: none !important; }
          .gallery-mobile-slideshow { display: block !important; }
        }
      `}</style>
    </section>
  )
}
