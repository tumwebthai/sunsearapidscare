'use client'

import RevealSection from './RevealSection'

export default function StandardsSection() {
  const standards = [
    { icon: '⏰', title: 'ตรงเวลาเสมอ', desc: 'คนขับถึงจุดนัดหมายล่วงหน้า 15-20 นาที พร้อมป้ายชื่อรอรับ' },
    { icon: '👔', title: 'คนขับมืออาชีพ', desc: 'แต่งกายสุภาพ ผ่านการอบรม Service Mind มีระบบให้คะแนนหลังจบงาน' },
    { icon: '✨', title: 'รถสะอาดทุกคัน', desc: 'ตรวจสภาพรถและห้องโดยสารทุกเช้า แอร์เย็นฉ่ำ ไม่มีกลิ่น' },
    { icon: '🛡️', title: 'ปลอดภัย 100%', desc: 'ประกันภัยทุกที่นั่ง GPS Tracking ตลอดเส้นทาง Zero Tolerance เรื่องแอลกอฮอล์' },
    { icon: '📱', title: 'แจ้งข้อมูลล่วงหน้า', desc: 'ส่งชื่อคนขับ เบอร์โทร และทะเบียนรถ ให้ 24 ชม. ก่อนเดินทาง' },
    { icon: '🤫', title: 'เคารพความเป็นส่วนตัว', desc: 'ไม่ชวนคุยเรื่องส่วนตัว ไม่เปิดเพลงดัง รักษาความลับลูกค้า' },
  ]

  return (
    <section id="standards" style={{ padding: '120px 24px', background: '#0B1C2D' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <RevealSection>
          <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <span style={{ color: '#C6A75E', fontSize: 13, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', display: 'block', marginBottom: 12 }}>Our Standards</span>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 700, color: '#FFFFFF' }}>
              มาตรฐาน<span className="gold-shimmer">ที่เราภูมิใจ</span>
            </h2>
            <div style={{ width: 60, height: 3, background: 'linear-gradient(90deg, #B9973E, #E5C97A)', margin: '16px auto 0', borderRadius: 2 }} />
          </div>
        </RevealSection>

        <div className="standards-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 20 }}>
          {standards.map((s, i) => (
            <RevealSection key={i} delay={i * 0.08}>
              <div className="card-navy standard-card" style={{ padding: 32, display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                <div className="standard-icon" style={{ fontSize: 34, width: 56, height: 56, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(198,167,94,0.12)', border: '1px solid rgba(198,167,94,0.2)', borderRadius: 14, flexShrink: 0 }}>
                  {s.icon}
                </div>
                <div>
                  <h4 className="standard-title" style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 700, marginBottom: 8, color: '#FFFFFF' }}>{s.title}</h4>
                  <p className="standard-desc" style={{ fontSize: 14, color: '#9CA3AF', lineHeight: 1.7 }}>{s.desc}</p>
                </div>
              </div>
            </RevealSection>
          ))}
        </div>
      </div>
    </section>
  )
}
