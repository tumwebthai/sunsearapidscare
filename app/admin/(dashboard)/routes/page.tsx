'use client'

import { useState, useEffect, useCallback } from 'react'
import Toast from '../../Toast'

interface RouteRow {
  id: string
  name_th: string
  name_en: string
  origin: string
  destination: string
  airport: string
  duration: string
  price_sedan: number
  price_van: number
  is_active: boolean
  sort_order: number
}

const EMPTY: Omit<RouteRow, 'id'> = {
  name_th: '', name_en: '', origin: '', destination: '',
  airport: 'BKK', duration: '', price_sedan: 0, price_van: 0,
  is_active: true, sort_order: 0,
}

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '12px 14px', background: '#1A2F45',
  border: '1px solid rgba(198,167,94,0.3)', borderRadius: 10,
  color: '#FFFFFF', fontSize: 14, outline: 'none',
}

const labelStyle: React.CSSProperties = {
  display: 'block', fontSize: 12, fontWeight: 600, color: '#C6A75E', marginBottom: 6,
}

export default function RoutesPage() {
  const [routes, setRoutes] = useState<RouteRow[]>([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState<'add' | 'edit' | null>(null)
  const [form, setForm] = useState(EMPTY)
  const [editId, setEditId] = useState('')
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  const fetchRoutes = useCallback(async () => {
    setLoading(true)
    const res = await fetch('/api/admin/routes')
    const data = await res.json()
    if (Array.isArray(data)) setRoutes(data)
    setLoading(false)
  }, [])

  useEffect(() => { fetchRoutes() }, [fetchRoutes])

  const openAdd = () => {
    setForm(EMPTY)
    setEditId('')
    setModal('add')
  }

  const openEdit = (r: RouteRow) => {
    setForm({
      name_th: r.name_th, name_en: r.name_en, origin: r.origin,
      destination: r.destination, airport: r.airport, duration: r.duration,
      price_sedan: r.price_sedan, price_van: r.price_van,
      is_active: r.is_active, sort_order: r.sort_order,
    })
    setEditId(r.id)
    setModal('edit')
  }

  const handleSave = async () => {
    setSaving(true)
    const method = modal === 'add' ? 'POST' : 'PUT'
    const body = modal === 'edit' ? { id: editId, ...form } : form

    const res = await fetch('/api/admin/routes', {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    if (res.ok) {
      setToast({ message: 'บันทึกเรียบร้อย ✓', type: 'success' })
      setModal(null)
      fetchRoutes()
    } else {
      setToast({ message: 'เกิดข้อผิดพลาด', type: 'error' })
    }
    setSaving(false)
  }

  const handleDelete = async () => {
    if (!editId || !confirm('ยืนยันการลบเส้นทางนี้?')) return
    const res = await fetch(`/api/admin/routes?id=${editId}`, { method: 'DELETE' })
    if (res.ok) {
      setToast({ message: 'ลบเรียบร้อย ✓', type: 'success' })
      setModal(null)
      fetchRoutes()
    } else {
      setToast({ message: 'ลบไม่สำเร็จ', type: 'error' })
    }
  }

  const toggleActive = async (r: RouteRow) => {
    await fetch('/api/admin/routes', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: r.id, is_active: !r.is_active }),
    })
    fetchRoutes()
  }

  return (
    <div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 700, color: '#FFFFFF', marginBottom: 4 }}>Routes</h1>
          <p style={{ fontSize: 14, color: '#9CA3AF' }}>จัดการเส้นทางรับส่ง</p>
        </div>
        <button onClick={openAdd} style={{ padding: '10px 24px', background: 'linear-gradient(135deg, #B9973E, #E5C97A)', border: 'none', borderRadius: 10, color: '#0B1C2D', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
          + เพิ่มเส้นทาง
        </button>
      </div>

      {/* Table */}
      <div style={{ background: '#12263A', borderRadius: 12, border: '1px solid rgba(198,167,94,0.08)', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: 48, textAlign: 'center' }}>
            <div style={{ fontSize: 24, color: '#C6A75E', animation: 'pulse 1.5s infinite' }}>⏳</div>
            <p style={{ fontSize: 14, color: '#9CA3AF', marginTop: 8 }}>กำลังโหลด...</p>
          </div>
        ) : routes.length === 0 ? (
          <div style={{ padding: 48, textAlign: 'center' }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>✈️</div>
            <p style={{ fontSize: 15, color: '#9CA3AF' }}>ยังไม่มีข้อมูลเส้นทาง</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 750 }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(198,167,94,0.08)' }}>
                  {['#', 'เส้นทาง', 'สนามบิน', 'ระยะเวลา', 'Sedan', 'Van', 'สถานะ', 'แก้ไข'].map((h) => (
                    <th key={h} style={{ padding: '12px 14px', fontSize: 11, fontWeight: 600, color: '#9CA3AF', textAlign: 'left', textTransform: 'uppercase', letterSpacing: 0.5 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {routes.map((r) => (
                  <tr key={r.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', opacity: r.is_active ? 1 : 0.4, transition: 'opacity 0.2s' }}>
                    <td style={{ padding: '12px 14px', fontSize: 13, color: '#9CA3AF' }}>{r.sort_order}</td>
                    <td style={{ padding: '12px 14px' }}>
                      <div style={{ fontSize: 14, color: '#FFFFFF', fontWeight: 500 }}>{r.name_th || `${r.origin} → ${r.destination}`}</div>
                      {r.name_en && <div style={{ fontSize: 11, color: '#9CA3AF' }}>{r.name_en}</div>}
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <span style={{ fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 50, background: r.airport === 'BKK' ? 'rgba(59,130,246,0.15)' : 'rgba(124,58,237,0.15)', color: r.airport === 'BKK' ? '#3B82F6' : '#7C3AED' }}>{r.airport}</span>
                    </td>
                    <td style={{ padding: '12px 14px', fontSize: 13, color: '#F5F5F5' }}>{r.duration}</td>
                    <td style={{ padding: '12px 14px', fontSize: 13, color: '#F5F5F5' }}>฿{(r.price_sedan ?? 0).toLocaleString()}</td>
                    <td style={{ padding: '12px 14px', fontSize: 13, fontWeight: 600, color: '#C6A75E' }}>฿{(r.price_van ?? 0).toLocaleString()}</td>
                    <td style={{ padding: '12px 14px' }}>
                      <button onClick={() => toggleActive(r)} style={{ padding: '4px 14px', borderRadius: 50, border: 'none', fontSize: 11, fontWeight: 600, cursor: 'pointer', background: r.is_active ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)', color: r.is_active ? '#22C55E' : '#EF4444' }}>
                        {r.is_active ? 'เปิด' : 'ปิด'}
                      </button>
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <button onClick={() => openEdit(r)} style={{ padding: '6px 14px', borderRadius: 8, border: '1px solid rgba(198,167,94,0.2)', background: 'transparent', color: '#C6A75E', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>แก้ไข</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {modal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }} onClick={() => setModal(null)}>
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)' }} />
          <div style={{ position: 'relative', width: '100%', maxWidth: 520, maxHeight: '90vh', overflow: 'auto', background: '#12263A', borderRadius: 20, border: '1px solid rgba(198,167,94,0.15)', padding: 32 }} onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setModal(null)} style={{ position: 'absolute', top: 16, right: 16, background: 'transparent', border: 'none', color: '#9CA3AF', fontSize: 20, cursor: 'pointer' }}>✕</button>

            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 700, color: '#FFFFFF', marginBottom: 24 }}>
              {modal === 'add' ? 'เพิ่มเส้นทาง' : 'แก้ไขเส้นทาง'}
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={labelStyle}>ชื่อเส้นทาง (ไทย)</label>
                  <input value={form.name_th} onChange={(e) => setForm({ ...form, name_th: e.target.value })} style={inputStyle} placeholder="สุวรรณภูมิ - กรุงเทพ" />
                </div>
                <div>
                  <label style={labelStyle}>ชื่อเส้นทาง (EN)</label>
                  <input value={form.name_en} onChange={(e) => setForm({ ...form, name_en: e.target.value })} style={inputStyle} placeholder="Suvarnabhumi - Bangkok" />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={labelStyle}>ต้นทาง *</label>
                  <input value={form.origin} onChange={(e) => setForm({ ...form, origin: e.target.value })} style={inputStyle} placeholder="สุวรรณภูมิ (BKK)" />
                </div>
                <div>
                  <label style={labelStyle}>ปลายทาง *</label>
                  <input value={form.destination} onChange={(e) => setForm({ ...form, destination: e.target.value })} style={inputStyle} placeholder="กรุงเทพ ในเมือง" />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={labelStyle}>สนามบิน</label>
                  <select value={form.airport} onChange={(e) => setForm({ ...form, airport: e.target.value })} style={inputStyle}>
                    <option value="BKK">สุวรรณภูมิ (BKK)</option>
                    <option value="DMK">ดอนเมือง (DMK)</option>
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>ระยะเวลา</label>
                  <input value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} style={inputStyle} placeholder="~45 นาที" />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={labelStyle}>ราคา Sedan (฿)</label>
                  <input type="number" min={0} value={form.price_sedan} onChange={(e) => setForm({ ...form, price_sedan: Number(e.target.value) })} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>ราคา Van (฿)</label>
                  <input type="number" min={0} value={form.price_van} onChange={(e) => setForm({ ...form, price_van: Number(e.target.value) })} style={inputStyle} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={labelStyle}>เปิดให้บริการ</label>
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, is_active: !form.is_active })}
                    style={{ padding: '10px 20px', borderRadius: 10, border: 'none', fontSize: 13, fontWeight: 600, cursor: 'pointer', background: form.is_active ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)', color: form.is_active ? '#22C55E' : '#EF4444' }}
                  >
                    {form.is_active ? '✓ เปิด' : '✕ ปิด'}
                  </button>
                </div>
                <div>
                  <label style={labelStyle}>ลำดับ</label>
                  <input type="number" min={0} value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })} style={inputStyle} />
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10, marginTop: 24 }}>
              <button onClick={handleSave} disabled={saving || !form.origin || !form.destination} style={{ flex: 2, padding: '12px', background: (!form.origin || !form.destination || saving) ? 'rgba(198,167,94,0.2)' : 'linear-gradient(135deg, #B9973E, #E5C97A)', border: 'none', borderRadius: 10, color: '#0B1C2D', fontSize: 14, fontWeight: 700, cursor: (!form.origin || !form.destination || saving) ? 'not-allowed' : 'pointer', opacity: (!form.origin || !form.destination || saving) ? 0.5 : 1 }}>
                {saving ? 'กำลังบันทึก...' : 'บันทึก'}
              </button>
              {modal === 'edit' && (
                <button onClick={handleDelete} style={{ flex: 1, padding: '12px', background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 10, color: '#EF4444', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
                  ลบ
                </button>
              )}
              <button onClick={() => setModal(null)} style={{ flex: 1, padding: '12px', background: 'transparent', border: '1px solid rgba(198,167,94,0.2)', borderRadius: 10, color: '#9CA3AF', fontSize: 14, fontWeight: 500, cursor: 'pointer' }}>
                ยกเลิก
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
