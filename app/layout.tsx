import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'SunSeaRapidsCare | เช่ารถตู้ VIP พร้อมคนขับ รับส่งสนามบิน',
  description: 'บริการเช่ารถตู้ VIP พร้อมคนขับมืออาชีพ รับส่งสนามบิน ท่องเที่ยวทั่วไทย ราคาโปร่งใส ปลอดภัย ตรงเวลา มาตรฐานระดับพรีเมียม',
  keywords: 'เช่ารถตู้ VIP, รับส่งสนามบิน, เช่ารถตู้พร้อมคนขับ, รถตู้ VIP กรุงเทพ, airport transfer bangkok',
  openGraph: {
    title: 'SunSeaRapidsCare | เช่ารถตู้ VIP พร้อมคนขับ',
    description: 'บริการเช่ารถตู้ VIP พร้อมคนขับมืออาชีพ รับส่งสนามบิน ท่องเที่ยวทั่วไทย',
    type: 'website',
    locale: 'th_TH',
    siteName: 'SunSeaRapidsCare',
  },
  robots: { index: true, follow: true },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="th">
      <head>
        {/* Preconnect to Google Fonts for faster loading */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Google Fonts: Playfair Display (headings), Noto Sans Thai (body Thai), Outfit (body English) */}
        <link
          href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=Playfair+Display:wght@400;500;600;700&family=Noto+Sans+Thai:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
