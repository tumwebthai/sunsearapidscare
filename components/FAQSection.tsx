'use client'

import { useState } from 'react'
import RevealSection from './RevealSection'

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const faqs = [
    { q: 'ราคารวมอะไรบ้าง?', a: 'ราคารวมค่าน้ำมัน, ค่าทางด่วน, ค่าจอดรถ, น้ำดื่ม, WiFi (รถ VIP) แล้ว ไม่มีค่าใช้จ่ายเพิ่มเติม' },
    { q: 'ระยะเวลาการใช้บริการเช่ารายวัน?', a: 'เช่ารายวันนับตั้งแต่เวลาที่นัดรับ จนถึง 12 ชั่วโมงหลังจากนั้น หากเกินจะคิดค่าล่วงเวลาตามตกลง' },
    { q: 'รถยี่ห้ออะไรบ้าง?', a: 'เรามี Toyota Commuter, Hyundai H1, Toyota Alphard, Toyota Majesty, Hyundai Staria และรถซีดานหลายรุ่น' },
    { q: 'นโยบายการยกเลิก?', a: 'ยกเลิกฟรีก่อนเดินทาง 24 ชั่วโมง หากยกเลิกน้อยกว่า 24 ชม. จะมีค่าดำเนินการ 50% ของราคาจอง' },
    { q: 'คนขับพูดภาษาอังกฤษได้ไหม?', a: 'คนขับส่วนใหญ่สื่อสารภาษาอังกฤษพื้นฐานได้ หากต้องการคนขับที่พูดอังกฤษคล่อง กรุณาแจ้งล่วงหน้า' },
  ]

  return (
    <section id="faq" style={{ padding: '120px 24px', background: '#12263A' }}>
      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        <RevealSection>
          <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <span style={{ color: '#C6A75E', fontSize: 13, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', display: 'block', marginBottom: 12 }}>FAQ</span>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 700, color: '#FFFFFF' }}>
              คำถาม<span className="gold-shimmer">ที่พบบ่อย</span>
            </h2>
            <div style={{ width: 60, height: 3, background: 'linear-gradient(90deg, #B9973E, #E5C97A)', margin: '16px auto 0', borderRadius: 2 }} />
          </div>
        </RevealSection>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {faqs.map((f, i) => (
            <RevealSection key={i} delay={i * 0.06}>
              <div
                className="faq-card"
                style={{
                  overflow: 'hidden',
                  cursor: 'pointer',
                  borderColor: openIndex === i ? 'rgba(198,167,94,0.35)' : 'rgba(198,167,94,0.08)',
                  boxShadow: openIndex === i ? '0 4px 20px rgba(0,0,0,0.3)' : 'none',
                }}
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
              >
                <div style={{ padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 600, fontSize: 15, color: openIndex === i ? '#C6A75E' : '#FFFFFF', transition: 'color 0.3s' }}>{f.q}</span>
                  <span style={{ fontSize: 24, color: '#C6A75E', fontWeight: 600, transform: openIndex === i ? 'rotate(45deg)' : 'rotate(0)', transition: 'transform 0.3s', flexShrink: 0, marginLeft: 16 }}>+</span>
                </div>
                <div style={{ maxHeight: openIndex === i ? 200 : 0, overflow: 'hidden', transition: 'max-height 0.4s ease' }}>
                  <div style={{ padding: '0 24px 20px', color: '#9CA3AF', fontSize: 14, lineHeight: 1.8 }}>{f.a}</div>
                </div>
              </div>
            </RevealSection>
          ))}
        </div>
      </div>
    </section>
  )
}
