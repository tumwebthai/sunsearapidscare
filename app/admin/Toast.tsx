'use client'

import { useEffect } from 'react'

interface ToastProps {
  message: string
  type: 'success' | 'error'
  onClose: () => void
}

export default function Toast({ message, type, onClose }: ToastProps) {
  useEffect(() => {
    const t = setTimeout(onClose, 3000)
    return () => clearTimeout(t)
  }, [onClose])

  return (
    <div style={{
      position: 'fixed',
      top: 24,
      right: 24,
      zIndex: 9999,
      padding: '14px 24px',
      borderRadius: 12,
      background: type === 'success' ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)',
      border: `1px solid ${type === 'success' ? 'rgba(34,197,94,0.4)' : 'rgba(239,68,68,0.4)'}`,
      color: type === 'success' ? '#22C55E' : '#EF4444',
      fontSize: 14,
      fontWeight: 600,
      boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
      animation: 'slideDown 0.3s ease',
    }}>
      {message}
    </div>
  )
}
