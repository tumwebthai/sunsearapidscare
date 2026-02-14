'use client'

import Image from 'next/image'
import RevealSection from './RevealSection'

export default function GallerySection() {
  const scenes = [
    { image: '/images/scenes/scene-airport-pickup.webp', title: 'รับที่สนามบิน', desc: 'คนขับพร้อมป้ายชื่อรอรับล่วงหน้า 20 นาที', tag: 'Airport Pickup' },
    { image: '/images/scenes/scene-hotel-dropoff.webp', title: 'ส่งถึงโรงแรม', desc: 'บริการรับส่งถึงหน้าล็อบบี้ ช่วยยกกระเป๋า', tag: 'Hotel Drop-off' },
    { image: '/images/scenes/scene-interior-seaview.webp', title: 'ห้องโดยสารหรูหรา', desc: 'เบาะ VIP นั่งสบาย มองวิวระหว่างทาง', tag: 'VIP Interior' },
    { image: '/images/scenes/scene-group-travel.webp', title: 'ท่องเที่ยวเป็นกลุ่ม', desc: 'สนุกกับเพื่อนหรือครอบครัว ทริปเที่ยวทั่วไทย', tag: 'Group Travel' },
  ]

  return (
    <section id="gallery" style={{ padding: '120px 24px', background: '#0B1C2D' }}>
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

        <div className="gallery-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 20 }}>
          {scenes.map((scene, i) => (
            <RevealSection key={i} delay={i * 0.1}>
              <div
                style={{ position: 'relative', borderRadius: 18, overflow: 'hidden', cursor: 'pointer', border: '1px solid rgba(198,167,94,0.1)', transition: 'border-color 0.4s' }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(198,167,94,0.4)' }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(198,167,94,0.1)' }}
              >
                <Image
                  src={scene.image}
                  alt={`${scene.title} - SunSeaRapidsCare บริการเช่ารถตู้ VIP`}
                  width={1200} height={630} quality={85}
                  loading={i < 2 ? 'eager' : 'lazy'}
                  className="gallery-image"
                  style={{ width: '100%', height: 'auto', aspectRatio: '1200 / 630', objectFit: 'cover', display: 'block', transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)' }}
                />
                <span style={{ position: 'absolute', top: 16, right: 16, background: 'rgba(11,28,45,0.8)', backdropFilter: 'blur(8px)', border: '1px solid rgba(198,167,94,0.2)', color: '#C6A75E', padding: '5px 14px', borderRadius: 50, fontSize: 11, fontWeight: 700, letterSpacing: 1 }}>
                  {scene.tag}
                </span>
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '60px 24px 24px', background: 'linear-gradient(transparent, rgba(11,28,45,0.95))' }}>
                  <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700, color: '#FFFFFF', marginBottom: 6 }}>{scene.title}</h3>
                  <p style={{ fontSize: 13, color: '#9CA3AF', lineHeight: 1.5 }}>{scene.desc}</p>
                </div>
              </div>
            </RevealSection>
          ))}
        </div>
      </div>
    </section>
  )
}
