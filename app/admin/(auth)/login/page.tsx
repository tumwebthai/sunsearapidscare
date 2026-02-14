'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLoginPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      const data = await res.json()

      if (data.success) {
        router.push('/admin')
      } else {
        setError('รหัสผ่านไม่ถูกต้อง')
      }
    } catch {
      setError('เกิดข้อผิดพลาด กรุณาลองใหม่')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0B1C2D', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ width: '100%', maxWidth: 400 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🚐</div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 700, color: '#FFFFFF', marginBottom: 4 }}>
            SunSea<span style={{ color: '#C6A75E' }}>RapidsCare</span>
          </h1>
          <p style={{ fontSize: 14, color: '#9CA3AF' }}>Admin Dashboard</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} style={{ background: '#12263A', borderRadius: 20, border: '1px solid rgba(198,167,94,0.15)', padding: 32 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: '#FFFFFF', marginBottom: 24, textAlign: 'center' }}>เข้าสู่ระบบ</h2>

          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#C6A75E', marginBottom: 8 }}>รหัสผ่าน</label>
            <input
              type="password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError('') }}
              placeholder="กรอกรหัสผ่าน"
              autoFocus
              style={{
                width: '100%',
                padding: '14px 16px',
                background: '#1A2F45',
                border: error ? '1px solid #EF4444' : '1px solid rgba(198,167,94,0.3)',
                borderRadius: 12,
                color: '#FFFFFF',
                fontSize: 15,
                outline: 'none',
              }}
            />
          </div>

          {error && (
            <div style={{ padding: '10px 16px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 8, marginBottom: 20 }}>
              <span style={{ fontSize: 13, color: '#EF4444', fontWeight: 600 }}>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !password}
            style={{
              width: '100%',
              padding: '14px',
              background: (loading || !password) ? 'rgba(198,167,94,0.2)' : 'linear-gradient(135deg, #B9973E, #E5C97A)',
              border: 'none',
              borderRadius: 12,
              color: (loading || !password) ? '#9CA3AF' : '#0B1C2D',
              fontSize: 16,
              fontWeight: 700,
              cursor: (loading || !password) ? 'not-allowed' : 'pointer',
              opacity: (loading || !password) ? 0.5 : 1,
            }}
          >
            {loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 24, fontSize: 12, color: '#9CA3AF' }}>
          &copy; 2026 SunSeaRapidsCare — Admin Panel
        </p>
      </div>
    </div>
  )
}
