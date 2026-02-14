'use client'

import { useState } from 'react'

interface ShareButtonsProps {
  vehicleName: string
  vehicleType: string
  price: string
}

const SHARE_TARGETS = [
  {
    name: 'Facebook',
    color: '#1877F2',
    svg: '<path fill="currentColor" d="M24 12c0-6.627-5.373-12-12-12S0 5.373 0 12c0 5.99 4.388 10.954 10.125 11.854V15.47H7.078V12h3.047V9.356c0-3.007 1.792-4.668 4.533-4.668 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.875V12h3.328l-.532 3.469h-2.796v8.385C19.612 22.954 24 17.99 24 12"/>',
    getUrl: (url: string) => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
  },
  {
    name: 'LINE',
    color: '#06C755',
    svg: '<path fill="currentColor" d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386a.63.63 0 0 1-.63-.629V8.108a.63.63 0 0 1 .63-.63h2.386c.349 0 .63.285.63.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016a.63.63 0 0 1-.629.631.626.626 0 0 1-.51-.262l-2.418-3.294v2.925a.63.63 0 0 1-1.26 0V8.108a.63.63 0 0 1 .63-.63c.2 0 .383.096.51.262l2.417 3.294V8.108a.63.63 0 0 1 1.26 0v4.771zm-5.741 0a.63.63 0 0 1-1.26 0V8.108a.63.63 0 0 1 1.26 0v4.771zm-2.527.631H4.856a.63.63 0 0 1-.63-.631V8.108a.63.63 0 0 1 1.26 0v4.141h1.756c.348 0 .629.283.629.63 0 .344-.281.631-.629.631zM12 2.654C6.335 2.654 1.727 6.525 1.727 11.28c0 4.272 3.79 7.855 8.909 8.528.347.075.818.23.938.527.108.271.07.695.035.97l-.153.915c-.045.271-.213 1.063.931.58s6.189-3.645 8.443-6.242C22.728 14.466 22.273 11.28 22.273 11.28 22.273 6.525 17.665 2.654 12 2.654"/>',
    getUrl: (url: string, text: string) => `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
  },
  {
    name: 'X',
    color: '#FFFFFF',
    svg: '<path fill="currentColor" d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>',
    getUrl: (url: string, text: string) => `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
  },
]

export default function ShareButtons({ vehicleName, vehicleType, price }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false)

  const url = typeof window !== 'undefined' ? window.location.href : ''
  const shareText = `${vehicleName} ${vehicleType} — เช่าพร้อมคนขับ ฿${price}/วัน | SunSeaRapidsCare`

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      /* fallback */
      const input = document.createElement('input')
      input.value = url
      document.body.appendChild(input)
      input.select()
      document.execCommand('copy')
      document.body.removeChild(input)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
      <span style={{ fontSize: 13, color: '#9CA3AF', fontWeight: 600 }}>แชร์:</span>
      {SHARE_TARGETS.map((t) => (
        <a
          key={t.name}
          href={t.getUrl(url, shareText)}
          target="_blank"
          rel="noopener noreferrer"
          title={`แชร์ไป ${t.name}`}
          className="share-btn"
          style={{
            width: 36,
            height: 36,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '50%',
            background: t.color,
            color: t.name === 'X' ? '#0B1C2D' : '#FFFFFF',
            textDecoration: 'none',
            transition: 'transform 0.2s, filter 0.2s',
          }}
        >
          <svg viewBox="0 0 24 24" width={16} height={16} dangerouslySetInnerHTML={{ __html: t.svg }} />
        </a>
      ))}
      <button
        onClick={copyLink}
        title="คัดลอกลิงก์"
        className="share-btn"
        style={{
          height: 36,
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          padding: '0 14px',
          borderRadius: 50,
          background: copied ? 'rgba(34,197,94,0.15)' : 'rgba(198,167,94,0.1)',
          border: copied ? '1px solid rgba(34,197,94,0.3)' : '1px solid rgba(198,167,94,0.2)',
          color: copied ? '#22C55E' : '#C6A75E',
          fontSize: 12,
          fontWeight: 600,
          cursor: 'pointer',
          transition: 'all 0.2s',
        }}
      >
        {copied ? (
          <>
            <svg viewBox="0 0 24 24" width={14} height={14}><path fill="currentColor" d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
            คัดลอกแล้ว
          </>
        ) : (
          <>
            <svg viewBox="0 0 24 24" width={14} height={14}><path fill="currentColor" d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg>
            คัดลอกลิงก์
          </>
        )}
      </button>

      <style>{`
        .share-btn:hover {
          transform: scale(1.1);
          filter: brightness(1.2);
        }
      `}</style>
    </div>
  )
}
