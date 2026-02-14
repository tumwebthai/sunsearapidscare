import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { FLEET, SITE_NAME, SITE_URL, LINE_URL, PHONE, PHONE_RAW } from '@/lib/data'
import Navbar from '@/components/Navbar'
import Breadcrumb from '@/components/Breadcrumb'
import Footer from '@/components/Footer'
import StickyBottomNav from '@/components/StickyBottomNav'
import VehicleFaq from './VehicleFaq'
import ShareButtons from './ShareButtons'

export function generateStaticParams() {
  return FLEET.map((v) => ({ slug: v.slug }))
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const v = FLEET.find((f) => f.slug === params.slug)
  if (!v) return {}

  return {
    title: `${v.name} ${v.type} — เช่าพร้อมคนขับ ฿${v.price}/วัน | ${SITE_NAME}`,
    description: `${v.description} ${v.seats} ที่นั่ง สิ่งอำนวยความสะดวกครบ ราคา ${v.price} บาท/วัน รวมน้ำมัน ทางด่วน คนขับมืออาชีพ`,
    keywords: `${v.name}, ${v.type}, เช่า${v.name}, รถตู้${v.type}พร้อมคนขับ, ${v.slug}`,
    openGraph: {
      title: `${v.name} ${v.type} | ${SITE_NAME}`,
      description: `${v.description} ราคา ${v.price} บาท/วัน`,
      url: `${SITE_URL}/fleet/${v.slug}`,
      type: 'website',
      locale: 'th_TH',
      siteName: SITE_NAME,
      images: [{ url: `${SITE_URL}${v.image}`, width: 800, height: 500, alt: `${v.name} ${v.type}` }],
    },
    alternates: { canonical: `${SITE_URL}/fleet/${v.slug}` },
  }
}

export default function VehiclePage({ params }: { params: { slug: string } }) {
  const v = FLEET.find((f) => f.slug === params.slug)
  if (!v) notFound()

  const otherVehicles = FLEET.filter((f) => f.slug !== v.slug)

  const comparisonFaq = otherVehicles.map((o) => ({
    q: `เปรียบเทียบ ${v.name} ${v.type} กับ ${o.name} ${o.type} ต่างกันยังไง?`,
    a: `${v.name} (${v.type}) — ${v.seats} ที่นั่ง ${v.bags} กระเป๋า ราคาเริ่มต้น ฿${v.price}/วัน: ${v.description} ส่วน ${o.name} (${o.type}) — ${o.seats} ที่นั่ง ${o.bags} กระเป๋า ราคาเริ่มต้น ฿${o.price}/วัน: ${o.description}`,
  }))

  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: `${v.name} ${v.type} — เช่าพร้อมคนขับ`,
    description: v.description,
    image: `${SITE_URL}${v.image}`,
    brand: { '@type': 'Brand', name: SITE_NAME },
    offers: {
      '@type': 'Offer',
      priceCurrency: 'THB',
      price: v.priceNum,
      priceValidUntil: '2026-12-31',
      availability: 'https://schema.org/InStock',
      url: `${SITE_URL}/fleet/${v.slug}`,
    },
  }

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [...v.faq, ...comparisonFaq].map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  }

  return (
    <main style={{ background: 'var(--navy-900)', minHeight: '100vh' }}>
      <Navbar />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      <div style={{ paddingTop: 80 }}>
        <Breadcrumb items={[{ label: 'รถของเรา', href: '/fleet' }, { label: `${v.name} ${v.type}` }]} />

        <article style={{ maxWidth: 1200, margin: '0 auto', padding: '20px 24px 120px' }}>
          {/* Hero Section */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, marginBottom: 60 }} className="vehicle-hero-grid">
            <div style={{ position: 'relative', borderRadius: 18, overflow: 'hidden', background: '#1A2F45', aspectRatio: '16/10' }}>
              <Image
                src={v.image}
                alt={`${v.name} ${v.type}`}
                fill
                sizes="(max-width: 768px) 100vw, 600px"
                style={{ objectFit: 'cover' }}
                priority
              />
              <div style={{ position: 'absolute', top: 16, left: 16, background: v.badgeColor, color: '#FFFFFF', fontSize: 12, fontWeight: 700, padding: '6px 16px', borderRadius: 50 }}>
                {v.badge}
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <span style={{ color: '#C6A75E', fontSize: 13, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 8 }}>{v.type}</span>
              <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 700, color: '#FFFFFF', margin: '0 0 16px' }}>
                {v.name}
              </h1>
              <p style={{ fontSize: 16, color: '#9CA3AF', lineHeight: 1.7, marginBottom: 24 }}>{v.description}</p>

              <div style={{ display: 'flex', gap: 24, marginBottom: 24 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 22 }}>🪑</span>
                  <div>
                    <div style={{ fontSize: 20, fontWeight: 700, color: '#FFFFFF' }}>{v.seats}</div>
                    <div style={{ fontSize: 11, color: '#9CA3AF' }}>ที่นั่ง</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 22 }}>🧳</span>
                  <div>
                    <div style={{ fontSize: 20, fontWeight: 700, color: '#FFFFFF' }}>{v.bags}</div>
                    <div style={{ fontSize: 11, color: '#9CA3AF' }}>กระเป๋า</div>
                  </div>
                </div>
              </div>

              <div style={{ marginBottom: 24 }}>
                <span style={{ fontSize: 36, fontWeight: 700, color: '#C6A75E' }}>฿{v.price}</span>
                <span style={{ fontSize: 14, color: '#9CA3AF', marginLeft: 4 }}>/วัน</span>
                <div style={{ fontSize: 12, color: '#9CA3AF', marginTop: 4 }}>รวมน้ำมัน ทางด่วน คนขับมืออาชีพ</div>
              </div>

              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <Link
                  href="/booking"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8,
                    background: 'linear-gradient(135deg, #B9973E, #E5C97A)',
                    color: '#0B1C2D',
                    padding: '14px 32px',
                    borderRadius: 50,
                    fontSize: 15,
                    fontWeight: 700,
                    textDecoration: 'none',
                    boxShadow: '0 4px 20px rgba(198,167,94,0.3)',
                  }}
                >
                  📋 จองรถคันนี้
                </Link>
                <a
                  href={`tel:${PHONE_RAW}`}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8,
                    border: '1px solid rgba(198,167,94,0.3)',
                    color: '#C6A75E',
                    padding: '14px 32px',
                    borderRadius: 50,
                    fontSize: 15,
                    fontWeight: 600,
                    textDecoration: 'none',
                  }}
                >
                  📞 {PHONE}
                </a>
              </div>

              {/* Share Buttons */}
              <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid rgba(198,167,94,0.1)' }}>
                <ShareButtons vehicleName={v.name} vehicleType={v.type} price={v.price} />
              </div>
            </div>
          </div>

          {/* Amenities */}
          <section style={{ marginBottom: 60 }}>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 700, color: '#FFFFFF', marginBottom: 24 }}>
              สิ่งอำนวยความสะดวก
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 12 }}>
              {v.amenities.map((a, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 20px', background: '#12263A', borderRadius: 12, border: '1px solid rgba(198,167,94,0.08)' }}>
                  <span style={{ color: '#C6A75E', fontSize: 16 }}>✓</span>
                  <span style={{ fontSize: 14, color: '#F5F5F5' }}>{a}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Why Choose */}
          <section style={{ marginBottom: 60 }}>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 700, color: '#FFFFFF', marginBottom: 24 }}>
              ทำไมต้องเลือก {v.name}
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
              {v.whyChoose.map((w, i) => (
                <div key={i} className="card-navy" style={{ padding: 28 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(198,167,94,0.12)', border: '1px solid rgba(198,167,94,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16, fontSize: 18, color: '#C6A75E', fontWeight: 700 }}>
                    {i + 1}
                  </div>
                  <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 17, fontWeight: 700, color: '#FFFFFF', marginBottom: 8 }}>{w.title}</h3>
                  <p style={{ fontSize: 14, color: '#9CA3AF', lineHeight: 1.7 }}>{w.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Use Cases */}
          <section style={{ marginBottom: 60 }}>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 700, color: '#FFFFFF', marginBottom: 24 }}>
              เหมาะสำหรับ
            </h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
              {v.useCases.map((u, i) => {
                const match = FLEET.find((f) => f.slug !== v.slug && f.useCases.includes(u))
                return match ? (
                  <Link key={i} href={`/fleet/${match.slug}`} style={{ padding: '10px 20px', borderRadius: 50, background: 'rgba(198,167,94,0.1)', border: '1px solid rgba(198,167,94,0.2)', color: '#C6A75E', fontSize: 14, textDecoration: 'none', transition: 'all 0.2s' }}>
                    {u} →
                  </Link>
                ) : (
                  <span key={i} style={{ padding: '10px 20px', borderRadius: 50, background: 'rgba(198,167,94,0.1)', border: '1px solid rgba(198,167,94,0.2)', color: '#F5F5F5', fontSize: 14 }}>
                    {u}
                  </span>
                )
              })}
            </div>
          </section>

          {/* FAQ */}
          <section style={{ marginBottom: 60 }}>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 700, color: '#FFFFFF', marginBottom: 24 }}>
              คำถามที่พบบ่อย — {v.name}
            </h2>
            <VehicleFaq faq={v.faq} />

            {/* Comparison FAQ */}
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700, color: '#FFFFFF', margin: '40px 0 20px' }}>
              เปรียบเทียบกับรุ่นอื่น
            </h3>
            <VehicleFaq faq={comparisonFaq} />
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 16 }}>
              {otherVehicles.map((o) => (
                <Link key={o.slug} href={`/fleet/${o.slug}`} style={{ padding: '8px 16px', borderRadius: 50, border: '1px solid rgba(198,167,94,0.2)', color: '#C6A75E', fontSize: 13, fontWeight: 600, textDecoration: 'none', transition: 'all 0.2s' }}>
                  ดู {o.name} {o.type} →
                </Link>
              ))}
            </div>
          </section>

          {/* Compare Other Vehicles */}
          <section>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 700, color: '#FFFFFF', margin: 0 }}>
                เปรียบเทียบรุ่นอื่น
              </h2>
              <Link href="/fleet" style={{ fontSize: 14, color: '#C6A75E', fontWeight: 600, textDecoration: 'none' }}>
                ดูรถทั้งหมด →
              </Link>
            </div>

            {/* Desktop: 3-col grid */}
            <div className="compare-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
              {otherVehicles.map((o) => (
                <Link key={o.slug} href={`/fleet/${o.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <div className="card-navy" style={{ overflow: 'hidden', cursor: 'pointer' }}>
                    <div style={{ position: 'relative', height: 160, background: '#1A2F45' }}>
                      <Image src={o.image} alt={`${o.name} ${o.type}`} fill sizes="350px" style={{ objectFit: 'cover' }} />
                      <div style={{ position: 'absolute', top: 8, left: 8, background: o.badgeColor, color: '#FFFFFF', fontSize: 10, fontWeight: 700, padding: '3px 10px', borderRadius: 50 }}>
                        {o.badge}
                      </div>
                    </div>
                    <div style={{ padding: '14px 18px' }}>
                      <h3 style={{ fontSize: 15, fontWeight: 700, color: '#FFFFFF', margin: '0 0 4px' }}>{o.name}</h3>
                      <span style={{ fontSize: 11, color: '#C6A75E', fontWeight: 600 }}>{o.type}</span>
                      <div style={{ display: 'flex', gap: 12, fontSize: 12, color: '#9CA3AF', margin: '8px 0' }}>
                        <span>🪑 {o.seats}</span>
                        <span>🧳 {o.bags}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ fontSize: 16, fontWeight: 700, color: '#C6A75E' }}>฿{o.price}<span style={{ fontSize: 11, fontWeight: 400, color: '#9CA3AF' }}>/วัน</span></div>
                        <span style={{ fontSize: 12, color: 'rgba(198,167,94,0.7)' }}>ดูรายละเอียด →</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Mobile: horizontal scroll carousel */}
            <div className="compare-mobile" style={{ display: 'none' }}>
              <div className="fleet-carousel">
                {otherVehicles.map((o) => (
                  <div key={o.slug} style={{ width: '72vw', maxWidth: 300, flexShrink: 0 }}>
                    <Link href={`/fleet/${o.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                      <div className="card-navy" style={{ overflow: 'hidden' }}>
                        <div style={{ position: 'relative', height: 140, background: '#1A2F45' }}>
                          <Image src={o.image} alt={`${o.name} ${o.type}`} fill sizes="300px" style={{ objectFit: 'cover' }} />
                          <div style={{ position: 'absolute', top: 8, left: 8, background: o.badgeColor, color: '#FFFFFF', fontSize: 10, fontWeight: 700, padding: '3px 10px', borderRadius: 50 }}>
                            {o.badge}
                          </div>
                        </div>
                        <div style={{ padding: '14px 16px' }}>
                          <h3 style={{ fontSize: 14, fontWeight: 700, color: '#FFFFFF', margin: '0 0 4px' }}>{o.name}</h3>
                          <span style={{ fontSize: 11, color: '#C6A75E', fontWeight: 600 }}>{o.type}</span>
                          <div style={{ display: 'flex', gap: 10, fontSize: 11, color: '#9CA3AF', margin: '6px 0' }}>
                            <span>🪑 {o.seats}</span>
                            <span>🧳 {o.bags}</span>
                          </div>
                          <div style={{ fontSize: 15, fontWeight: 700, color: '#C6A75E' }}>฿{o.price}<span style={{ fontSize: 11, fontWeight: 400, color: '#9CA3AF' }}>/วัน</span></div>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </article>
      </div>

      <Footer />
      <StickyBottomNav />
    </main>
  )
}
