import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import MarqueeBanner from '@/components/MarqueeBanner'
import FleetSection from '@/components/FleetSection'
import AirportSection from '@/components/AirportSection'
import StandardsSection from '@/components/StandardsSection'
import ReviewsSection from '@/components/ReviewsSection'
import GallerySection from '@/components/GallerySection'
import FAQSection from '@/components/FAQSection'
import ContactSection from '@/components/ContactSection'
import Footer from '@/components/Footer'
import StickyBottomNav from '@/components/StickyBottomNav'

/**
 * Home Page — Section Order:
 * 1. Navbar (fixed)
 * 2. Hero (video background + typewriter)
 * 3. Marquee (gold scrolling strip)
 * 4. Fleet (car cards with REAL images)
 * 5. Airport Transfer (pricing table)
 * 6. Standards (service quality grid)
 * 7. Reviews (testimonials)
 * 8. Gallery (lifestyle scene photos) ← NEW
 * 9. FAQ (accordion)
 * 10. Contact (CTA)
 * 11. Footer (3-column luxury)
 * 12. StickyBottomNav (mobile only)
 *
 * REQUIRED FILES:
 * - /public/videos/hero-bg.mp4
 * - /public/images/fleet/*.webp (6 files, 800x500)
 * - /public/images/scenes/*.webp (4 files, 1200x630)
 */
export default function Home() {
  return (
    <main style={{ background: 'var(--navy-900)', minHeight: '100vh', overflowX: 'hidden' }}>
      <Navbar />
      <Hero />
      <MarqueeBanner />
      <FleetSection />
      <AirportSection />
      <StandardsSection />
      <ReviewsSection />
      <GallerySection />
      <FAQSection />
      <ContactSection />
      <Footer />
      <StickyBottomNav />
    </main>
  )
}
