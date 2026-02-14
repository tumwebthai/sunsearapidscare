'use client'

import { useState, useEffect, useCallback } from 'react'
import Toast from '../../Toast'
import { SOCIAL_META } from '@/lib/social'

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '12px 14px', background: '#1A2F45',
  border: '1px solid rgba(198,167,94,0.3)', borderRadius: 10,
  color: '#FFFFFF', fontSize: 14, outline: 'none',
}

const labelStyle: React.CSSProperties = {
  display: 'block', fontSize: 12, fontWeight: 600, color: '#C6A75E', marginBottom: 6,
}

const cardStyle: React.CSSProperties = {
  background: '#12263A', borderRadius: 16, border: '1px solid rgba(198,167,94,0.08)', padding: 28, marginBottom: 24,
}

/* ── Field Definitions ── */
const CONTACT_FIELDS = [
  { key: 'company_name', label: 'ชื่อบริษัท', placeholder: 'SunSeaRapidsCare' },
  { key: 'company_address', label: 'ที่อยู่', placeholder: 'กรุงเทพมหานคร' },
  { key: 'phone_number', label: 'เบอร์โทร', placeholder: '084-289-4662' },
  { key: 'line_url', label: 'LINE URL', placeholder: 'https://lin.ee/Wg7UFYw' },
  { key: 'line_id', label: 'LINE ID', placeholder: '@sunsearapidscare' },
  { key: 'facebook_url', label: 'Facebook URL', placeholder: 'https://www.facebook.com/...' },
  { key: 'whatsapp_number', label: 'WhatsApp', placeholder: '66842894662' },
  { key: 'email', label: 'อีเมล', placeholder: 'info@sunsearapidscare.com' },
]

const TRACKING_FIELDS = [
  { key: 'ga4_measurement_id', label: 'Google Analytics 4 Measurement ID', placeholder: 'G-XXXXXXXXXX', help: 'ไปที่ analytics.google.com → Admin → Data Streams → Measurement ID' },
  { key: 'gtm_container_id', label: 'Google Tag Manager Container ID', placeholder: 'GTM-XXXXXXX', help: 'ไปที่ tagmanager.google.com → Container ID' },
  { key: 'facebook_pixel_id', label: 'Facebook Pixel ID', placeholder: '1234567890', help: 'ไปที่ Facebook Events Manager → Pixel ID' },
  { key: 'line_tag_id', label: 'LINE Tag ID', placeholder: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx', help: 'ไปที่ LINE Tag Manager → Tag ID' },
]

const BANK_FIELDS = [
  { key: 'bank_name', label: 'ชื่อธนาคาร', placeholder: 'กสิกรไทย (KBank)' },
  { key: 'bank_account_name', label: 'ชื่อบัญชี', placeholder: 'บจก. ซันซี ราปิดส์แคร์' },
  { key: 'bank_account_number', label: 'เลขบัญชี', placeholder: 'XXX-X-XXXXX-X' },
  { key: 'promptpay_number', label: 'เบอร์ PromptPay', placeholder: '0812345678' },
]

const SOCIAL_FIELDS = SOCIAL_META.map((s) => ({
  key: s.settingsKey,
  label: s.name,
  placeholder: s.defaultHref || `https://...`,
  svg: s.svg,
  color: s.bgGradient || s.color,
  iconTextColor: s.name === 'Lemon8' ? '#0B1C2D' : '#FFFFFF',
}))

export default function SettingsPage() {
  const [settings, setSettings] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [savingGroup, setSavingGroup] = useState<string | null>(null)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  const fetchSettings = useCallback(async () => {
    setLoading(true)
    const res = await fetch('/api/admin/settings')
    if (res.ok) {
      const data = await res.json()
      setSettings(data)
    }
    setLoading(false)
  }, [])

  useEffect(() => { fetchSettings() }, [fetchSettings])

  const update = (key: string, value: string) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  const saveGroup = async (group: string, keys: string[]) => {
    setSavingGroup(group)
    const body: Record<string, string> = {}
    for (const k of keys) {
      body[k] = settings[k] || ''
    }

    const res = await fetch('/api/admin/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    if (res.ok) {
      setToast({ message: 'บันทึกเรียบร้อย ✓', type: 'success' })
    } else {
      setToast({ message: 'เกิดข้อผิดพลาด', type: 'error' })
    }
    setSavingGroup(null)
  }

  if (loading) {
    return (
      <div style={{ padding: 48, textAlign: 'center' }}>
        <div style={{ fontSize: 24, color: '#C6A75E', animation: 'pulse 1.5s infinite' }}>⏳</div>
        <p style={{ fontSize: 14, color: '#9CA3AF', marginTop: 8 }}>กำลังโหลด...</p>
      </div>
    )
  }

  return (
    <div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 700, color: '#FFFFFF', marginBottom: 4 }}>Settings</h1>
        <p style={{ fontSize: 14, color: '#9CA3AF' }}>ตั้งค่าเว็บไซต์และ Tracking Codes</p>
      </div>

      {/* ═══ กลุ่ม 1: ข้อมูลติดต่อ ═══ */}
      <div style={cardStyle}>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: '#FFFFFF', marginBottom: 20 }}>📞 ข้อมูลติดต่อ</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }} className="settings-grid">
          {CONTACT_FIELDS.map((f) => (
            <div key={f.key}>
              <label style={labelStyle}>{f.label}</label>
              <input
                value={settings[f.key] || ''}
                onChange={(e) => update(f.key, e.target.value)}
                placeholder={f.placeholder}
                style={inputStyle}
              />
            </div>
          ))}
        </div>
        <div style={{ marginTop: 20, textAlign: 'right' }}>
          <button
            onClick={() => saveGroup('contact', CONTACT_FIELDS.map((f) => f.key))}
            disabled={savingGroup === 'contact'}
            style={{ padding: '10px 28px', background: 'linear-gradient(135deg, #B9973E, #E5C97A)', border: 'none', borderRadius: 10, color: '#0B1C2D', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}
          >
            {savingGroup === 'contact' ? 'กำลังบันทึก...' : 'บันทึก'}
          </button>
        </div>
      </div>

      {/* ═══ กลุ่ม 2: Tracking & Analytics ═══ */}
      <div style={cardStyle}>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: '#FFFFFF', marginBottom: 20 }}>📊 Tracking & Analytics</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {TRACKING_FIELDS.map((f) => {
            const hasValue = !!settings[f.key]
            return (
              <div key={f.key}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  <label style={{ ...labelStyle, marginBottom: 0 }}>{f.label}</label>
                  <span style={{ fontSize: 11, fontWeight: 600, color: hasValue ? '#22C55E' : '#9CA3AF' }}>
                    {hasValue ? '● เปิดใช้งาน' : '○ ยังไม่ตั้งค่า'}
                  </span>
                </div>
                <input
                  value={settings[f.key] || ''}
                  onChange={(e) => update(f.key, e.target.value)}
                  placeholder={f.placeholder}
                  style={inputStyle}
                />
                <p style={{ fontSize: 11, color: '#9CA3AF', marginTop: 4 }}>{f.help}</p>
              </div>
            )
          })}
        </div>
        <div style={{ marginTop: 20, textAlign: 'right' }}>
          <button
            onClick={() => saveGroup('tracking', TRACKING_FIELDS.map((f) => f.key))}
            disabled={savingGroup === 'tracking'}
            style={{ padding: '10px 28px', background: 'linear-gradient(135deg, #B9973E, #E5C97A)', border: 'none', borderRadius: 10, color: '#0B1C2D', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}
          >
            {savingGroup === 'tracking' ? 'กำลังบันทึก...' : 'บันทึก'}
          </button>
        </div>
      </div>

      {/* ═══ กลุ่ม 3: การจอง ═══ */}
      <div style={cardStyle}>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: '#FFFFFF', marginBottom: 20 }}>💰 ตั้งค่าการจอง</h2>
        <div style={{ maxWidth: 300 }}>
          <label style={labelStyle}>เปอร์เซ็นต์เงินมัดจำ (%)</label>
          <input
            type="number"
            min={0}
            max={100}
            value={settings['deposit_percent'] || '30'}
            onChange={(e) => update('deposit_percent', e.target.value)}
            style={inputStyle}
          />
        </div>
        <div style={{ marginTop: 20, textAlign: 'right' }}>
          <button
            onClick={() => saveGroup('booking', ['deposit_percent'])}
            disabled={savingGroup === 'booking'}
            style={{ padding: '10px 28px', background: 'linear-gradient(135deg, #B9973E, #E5C97A)', border: 'none', borderRadius: 10, color: '#0B1C2D', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}
          >
            {savingGroup === 'booking' ? 'กำลังบันทึก...' : 'บันทึก'}
          </button>
        </div>
      </div>

      {/* ═══ กลุ่ม 4: บัญชีธนาคาร ═══ */}
      <div style={cardStyle}>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: '#FFFFFF', marginBottom: 20 }}>🏦 บัญชีธนาคาร</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }} className="settings-grid">
          {BANK_FIELDS.map((f) => (
            <div key={f.key}>
              <label style={labelStyle}>{f.label}</label>
              <input
                value={settings[f.key] || ''}
                onChange={(e) => update(f.key, e.target.value)}
                placeholder={f.placeholder}
                style={inputStyle}
              />
            </div>
          ))}
        </div>
        <div style={{ marginTop: 20, textAlign: 'right' }}>
          <button
            onClick={() => saveGroup('bank', BANK_FIELDS.map((f) => f.key))}
            disabled={savingGroup === 'bank'}
            style={{ padding: '10px 28px', background: 'linear-gradient(135deg, #B9973E, #E5C97A)', border: 'none', borderRadius: 10, color: '#0B1C2D', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}
          >
            {savingGroup === 'bank' ? 'กำลังบันทึก...' : 'บันทึก'}
          </button>
        </div>
      </div>

      {/* ═══ กลุ่ม 5: ช่องทางออนไลน์ ═══ */}
      <div style={cardStyle}>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: '#FFFFFF', marginBottom: 20 }}>🌐 ช่องทางออนไลน์</h2>
        <p style={{ fontSize: 12, color: '#9CA3AF', marginBottom: 20 }}>URL ที่ว่าง = ไม่แสดง icon บนเว็บ &nbsp;|&nbsp; ใส่ URL = แสดง icon พร้อมลิงก์</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {SOCIAL_FIELDS.map((f) => {
            const hasValue = !!settings[f.key]
            return (
              <div key={f.key} className="social-field-row" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                {/* Platform icon */}
                <div style={{
                  width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
                  background: f.color, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: f.iconTextColor,
                }}>
                  <svg viewBox="0 0 24 24" width={16} height={16} dangerouslySetInnerHTML={{ __html: f.svg }} />
                </div>
                {/* Label */}
                <div style={{ width: 120, flexShrink: 0 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: '#FFFFFF' }}>{f.label}</span>
                </div>
                {/* Input */}
                <div style={{ flex: 1 }}>
                  <input
                    value={settings[f.key] || ''}
                    onChange={(e) => update(f.key, e.target.value)}
                    placeholder={f.placeholder}
                    style={inputStyle}
                  />
                </div>
                {/* Status */}
                <span style={{ fontSize: 11, fontWeight: 600, color: hasValue ? '#22C55E' : '#9CA3AF', flexShrink: 0, width: 80, textAlign: 'right' }}>
                  {hasValue ? '● เปิด' : '○ ปิด'}
                </span>
              </div>
            )
          })}
        </div>
        <div style={{ marginTop: 20, textAlign: 'right' }}>
          <button
            onClick={() => saveGroup('social', SOCIAL_FIELDS.map((f) => f.key))}
            disabled={savingGroup === 'social'}
            style={{ padding: '10px 28px', background: 'linear-gradient(135deg, #B9973E, #E5C97A)', border: 'none', borderRadius: 10, color: '#0B1C2D', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}
          >
            {savingGroup === 'social' ? 'กำลังบันทึก...' : 'บันทึก'}
          </button>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .settings-grid { grid-template-columns: 1fr !important; }
          .social-field-row {
            flex-wrap: wrap !important;
          }
          .social-field-row > div:nth-child(2) {
            width: auto !important;
          }
          .social-field-row > div:nth-child(3) {
            width: 100% !important;
            flex: unset !important;
          }
        }
      `}</style>
    </div>
  )
}
