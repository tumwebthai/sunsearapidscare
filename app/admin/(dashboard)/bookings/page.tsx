'use client'

import { useState, useEffect, useCallback } from 'react'
import Toast from '../../Toast'
import type { Booking } from '@/lib/types'

const STATUS_BADGE: Record<string, { bg: string; color: string; label: string }> = {
  pending: { bg: 'rgba(234,179,8,0.15)', color: '#EAB308', label: 'รอดำเนินการ' },
  confirmed: { bg: 'rgba(34,197,94,0.15)', color: '#22C55E', label: 'ยืนยันแล้ว' },
  completed: { bg: 'rgba(59,130,246,0.15)', color: '#3B82F6', label: 'เสร็จสิ้น' },
  cancelled: { bg: 'rgba(239,68,68,0.15)', color: '#EF4444', label: 'ยกเลิก' },
}

const SERVICE_BADGE: Record<string, { bg: string; color: string; label: string }> = {
  airport: { bg: 'rgba(59,130,246,0.15)', color: '#3B82F6', label: '✈️ สนามบิน' },
  daily: { bg: 'rgba(34,197,94,0.15)', color: '#22C55E', label: '🚐 รายวัน' },
  tour: { bg: 'rgba(124,58,237,0.15)', color: '#7C3AED', label: '🏖️ ทัวร์' },
}

const PAYMENT_BADGE: Record<string, { bg: string; color: string; label: string }> = {
  unpaid: { bg: 'rgba(234,179,8,0.15)', color: '#EAB308', label: 'ยังไม่ชำระ' },
  deposit_paid: { bg: 'rgba(59,130,246,0.15)', color: '#3B82F6', label: 'ชำระมัดจำแล้ว' },
  fully_paid: { bg: 'rgba(34,197,94,0.15)', color: '#22C55E', label: 'ชำระครบแล้ว' },
}

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '12px 14px', background: '#1A2F45',
  border: '1px solid rgba(198,167,94,0.3)', borderRadius: 10,
  color: '#FFFFFF', fontSize: 14, outline: 'none',
}

function formatDate(d: string) {
  if (!d) return '-'
  const dt = new Date(d)
  return `${String(dt.getDate()).padStart(2, '0')}/${String(dt.getMonth() + 1).padStart(2, '0')}/${dt.getFullYear()} ${String(dt.getHours()).padStart(2, '0')}:${String(dt.getMinutes()).padStart(2, '0')}`
}

function formatPrice(n: number) {
  return `฿${n.toLocaleString()}`
}

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<Booking | null>(null)
  const [editStatus, setEditStatus] = useState('')
  const [editPayment, setEditPayment] = useState('')
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  const fetchBookings = useCallback(async () => {
    setLoading(true)
    const params = new URLSearchParams()
    if (statusFilter !== 'all') params.set('status', statusFilter)
    if (search) params.set('search', search)
    const res = await fetch(`/api/admin/bookings?${params}`)
    const data = await res.json()
    if (Array.isArray(data)) setBookings(data)
    setLoading(false)
  }, [statusFilter, search])

  useEffect(() => { fetchBookings() }, [fetchBookings])

  const openDetail = (b: Booking) => {
    setSelected(b)
    setEditStatus(b.status)
    setEditPayment(b.payment_status)
  }

  const handleSave = async () => {
    if (!selected) return
    setSaving(true)
    const res = await fetch('/api/admin/bookings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: selected.id, status: editStatus, payment_status: editPayment }),
    })
    if (res.ok) {
      setToast({ message: 'บันทึกเรียบร้อย ✓', type: 'success' })
      setSelected(null)
      fetchBookings()
    } else {
      setToast({ message: 'เกิดข้อผิดพลาด', type: 'error' })
    }
    setSaving(false)
  }

  const handleDelete = async () => {
    if (!selected || !confirm('ยืนยันการลบ Booking นี้?')) return
    const res = await fetch(`/api/admin/bookings?id=${selected.id}`, { method: 'DELETE' })
    if (res.ok) {
      setToast({ message: 'ลบเรียบร้อย ✓', type: 'success' })
      setSelected(null)
      fetchBookings()
    } else {
      setToast({ message: 'ลบไม่สำเร็จ', type: 'error' })
    }
  }

  return (
    <div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 700, color: '#FFFFFF', marginBottom: 4 }}>Bookings</h1>
        <p style={{ fontSize: 14, color: '#9CA3AF' }}>จัดการรายการจองทั้งหมด</p>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{ ...inputStyle, width: 'auto', minWidth: 160 }}
        >
          <option value="all">ทั้งหมด</option>
          <option value="pending">รอดำเนินการ</option>
          <option value="confirmed">ยืนยันแล้ว</option>
          <option value="completed">เสร็จสิ้น</option>
          <option value="cancelled">ยกเลิก</option>
        </select>
        <input
          type="text"
          placeholder="ค้นหาชื่อ / Ref..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ ...inputStyle, maxWidth: 280 }}
        />
      </div>

      {/* Table */}
      <div style={{ background: '#12263A', borderRadius: 12, border: '1px solid rgba(198,167,94,0.08)', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: 48, textAlign: 'center' }}>
            <div style={{ fontSize: 24, color: '#C6A75E', animation: 'pulse 1.5s infinite' }}>⏳</div>
            <p style={{ fontSize: 14, color: '#9CA3AF', marginTop: 8 }}>กำลังโหลด...</p>
          </div>
        ) : bookings.length === 0 ? (
          <div style={{ padding: 48, textAlign: 'center' }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>📋</div>
            <p style={{ fontSize: 15, color: '#9CA3AF' }}>ยังไม่มีข้อมูล Booking</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 900 }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(198,167,94,0.08)' }}>
                  {['Ref', 'ลูกค้า', 'ประเภท', 'วันเดินทาง', 'รถ', 'ราคา', 'สถานะ', 'วันที่จอง'].map((h) => (
                    <th key={h} style={{ padding: '12px 14px', fontSize: 11, fontWeight: 600, color: '#9CA3AF', textAlign: 'left', textTransform: 'uppercase', letterSpacing: 0.5 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {bookings.map((b) => {
                  const st = STATUS_BADGE[b.status] || STATUS_BADGE.pending
                  const svc = SERVICE_BADGE[b.service_type] || { bg: 'rgba(156,163,175,0.15)', color: '#9CA3AF', label: b.service_type }
                  return (
                    <tr key={b.id} onClick={() => openDetail(b)} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', cursor: 'pointer', transition: 'background 0.15s' }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = '#1A2F45')}
                      onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                    >
                      <td style={{ padding: '12px 14px', fontSize: 13, fontWeight: 600, color: '#C6A75E' }}>{b.reference_number}</td>
                      <td style={{ padding: '12px 14px' }}>
                        <div style={{ fontSize: 13, color: '#FFFFFF', fontWeight: 500 }}>{b.customer_name}</div>
                        <div style={{ fontSize: 11, color: '#9CA3AF' }}>{b.customer_phone}</div>
                      </td>
                      <td style={{ padding: '12px 14px' }}>
                        <span style={{ fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 50, background: svc.bg, color: svc.color }}>{svc.label}</span>
                      </td>
                      <td style={{ padding: '12px 14px', fontSize: 13, color: '#F5F5F5' }}>{b.travel_date}</td>
                      <td style={{ padding: '12px 14px', fontSize: 12, color: '#9CA3AF' }}>{b.vehicle_name || '-'}</td>
                      <td style={{ padding: '12px 14px', fontSize: 13, fontWeight: 600, color: '#C6A75E' }}>{formatPrice(b.estimated_price)}</td>
                      <td style={{ padding: '12px 14px' }}>
                        <span style={{ fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 50, background: st.bg, color: st.color }}>{st.label}</span>
                      </td>
                      <td style={{ padding: '12px 14px', fontSize: 12, color: '#9CA3AF' }}>{formatDate(b.created_at)}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selected && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }} onClick={() => setSelected(null)}>
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)' }} />
          <div style={{ position: 'relative', width: '100%', maxWidth: 600, maxHeight: '90vh', overflow: 'auto', background: '#12263A', borderRadius: 20, border: '1px solid rgba(198,167,94,0.15)', padding: 32 }} onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setSelected(null)} style={{ position: 'absolute', top: 16, right: 16, background: 'transparent', border: 'none', color: '#9CA3AF', fontSize: 20, cursor: 'pointer' }}>✕</button>

            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 700, color: '#FFFFFF', marginBottom: 4 }}>รายละเอียด Booking</h3>
            <p style={{ fontSize: 14, color: '#C6A75E', fontWeight: 600, marginBottom: 24 }}>{selected.reference_number}</p>

            {/* Info rows */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 24 }}>
              {[
                { l: 'ประเภท', v: (SERVICE_BADGE[selected.service_type] || { label: selected.service_type }).label },
                { l: 'สถานที่รับ', v: selected.pickup_location },
                { l: 'สถานที่ส่ง', v: selected.dropoff_location || '-' },
                ...(selected.airport ? [{ l: 'สนามบิน', v: selected.airport }] : []),
                ...(selected.direction ? [{ l: 'ทิศทาง', v: selected.direction === 'pickup' ? 'รับจากสนามบิน' : 'ส่งไปสนามบิน' }] : []),
                { l: 'วันเดินทาง', v: selected.travel_date },
                { l: 'เวลา', v: selected.travel_time },
                { l: 'จำนวนวัน', v: String(selected.num_days) },
                { l: 'ผู้โดยสาร', v: `${selected.passengers} คน` },
                { l: 'กระเป๋า', v: `${selected.luggage} ใบ` },
                { l: 'รถ', v: selected.vehicle_name || '-' },
                { l: 'ราคาประมาณ', v: formatPrice(selected.estimated_price) },
              ].map((r, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: i % 2 === 0 ? 'rgba(26,47,69,0.5)' : 'transparent', borderRadius: 6, fontSize: 13 }}>
                  <span style={{ color: '#9CA3AF' }}>{r.l}</span>
                  <span style={{ color: '#F5F5F5', fontWeight: 500, textAlign: 'right', maxWidth: '60%' }}>{r.v}</span>
                </div>
              ))}
            </div>

            {/* Customer info */}
            <h4 style={{ fontSize: 14, fontWeight: 700, color: '#C6A75E', marginBottom: 12 }}>ข้อมูลลูกค้า</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 24 }}>
              {[
                { l: 'ชื่อ', v: selected.customer_name },
                { l: 'โทร', v: `${selected.country_code} ${selected.customer_phone}` },
                { l: 'อีเมล', v: selected.customer_email },
                { l: 'ติดต่อผ่าน', v: selected.preferred_contact },
                ...(selected.line_id ? [{ l: 'LINE ID', v: selected.line_id }] : []),
                ...(selected.flight_number ? [{ l: 'เที่ยวบิน', v: selected.flight_number }] : []),
                ...(selected.hotel_name ? [{ l: 'โรงแรม', v: selected.hotel_name }] : []),
                ...(selected.special_notes ? [{ l: 'หมายเหตุ', v: selected.special_notes }] : []),
              ].map((r, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: i % 2 === 0 ? 'rgba(26,47,69,0.5)' : 'transparent', borderRadius: 6, fontSize: 13 }}>
                  <span style={{ color: '#9CA3AF' }}>{r.l}</span>
                  <span style={{ color: '#F5F5F5', fontWeight: 500, textAlign: 'right', maxWidth: '60%' }}>{r.v}</span>
                </div>
              ))}
            </div>

            {/* Status dropdowns */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 24 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#C6A75E', marginBottom: 6 }}>สถานะ</label>
                <select value={editStatus} onChange={(e) => setEditStatus(e.target.value)} style={inputStyle}>
                  <option value="pending">รอดำเนินการ</option>
                  <option value="confirmed">ยืนยันแล้ว</option>
                  <option value="completed">เสร็จสิ้น</option>
                  <option value="cancelled">ยกเลิก</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#C6A75E', marginBottom: 6 }}>การชำระเงิน</label>
                <select value={editPayment} onChange={(e) => setEditPayment(e.target.value)} style={inputStyle}>
                  <option value="unpaid">ยังไม่ชำระ</option>
                  <option value="deposit_paid">ชำระมัดจำแล้ว</option>
                  <option value="fully_paid">ชำระครบแล้ว</option>
                </select>
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={handleSave} disabled={saving} style={{ flex: 2, padding: '12px', background: 'linear-gradient(135deg, #B9973E, #E5C97A)', border: 'none', borderRadius: 10, color: '#0B1C2D', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
                {saving ? 'กำลังบันทึก...' : 'บันทึก'}
              </button>
              <button onClick={handleDelete} style={{ flex: 1, padding: '12px', background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 10, color: '#EF4444', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
                ลบ
              </button>
              <button onClick={() => setSelected(null)} style={{ flex: 1, padding: '12px', background: 'transparent', border: '1px solid rgba(198,167,94,0.2)', borderRadius: 10, color: '#9CA3AF', fontSize: 14, fontWeight: 500, cursor: 'pointer' }}>
                ปิด
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
