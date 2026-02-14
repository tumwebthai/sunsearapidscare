'use client'

import { useState, useEffect, useCallback } from 'react'
import Toast from '../../Toast'

interface VehicleRow {
  id: string
  name_th: string
  name_en: string
  slug: string
  category: string
  seats: number
  bags: number
  price_per_day: number
  description_th: string
  description_en: string
  image_url: string
  is_active: boolean
  sort_order: number
}

const EMPTY: Omit<VehicleRow, 'id'> = {
  name_th: '', name_en: '', slug: '', category: 'vip',
  seats: 9, bags: 6, price_per_day: 3000,
  description_th: '', description_en: '', image_url: '',
  is_active: true, sort_order: 0,
}

const CATEGORY_BADGE: Record<string, { bg: string; color: string }> = {
  vip: { bg: 'rgba(198,167,94,0.15)', color: '#C6A75E' },
  standard: { bg: 'rgba(59,130,246,0.15)', color: '#3B82F6' },
  executive: { bg: 'rgba(124,58,237,0.15)', color: '#7C3AED' },
  premium: { bg: 'rgba(198,167,94,0.15)', color: '#C6A75E' },
  luxury: { bg: 'rgba(220,38,38,0.15)', color: '#DC2626' },
}

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '12px 14px', background: '#1A2F45',
  border: '1px solid rgba(198,167,94,0.3)', borderRadius: 10,
  color: '#FFFFFF', fontSize: 14, outline: 'none',
}

const labelStyle: React.CSSProperties = {
  display: 'block', fontSize: 12, fontWeight: 600, color: '#C6A75E', marginBottom: 6,
}

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState<VehicleRow[]>([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState<'add' | 'edit' | null>(null)
  const [form, setForm] = useState(EMPTY)
  const [editId, setEditId] = useState('')
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  const fetchVehicles = useCallback(async () => {
    setLoading(true)
    const res = await fetch('/api/admin/vehicles')
    const data = await res.json()
    if (Array.isArray(data)) setVehicles(data)
    setLoading(false)
  }, [])

  useEffect(() => { fetchVehicles() }, [fetchVehicles])

  const openAdd = () => {
    setForm(EMPTY)
    setEditId('')
    setModal('add')
  }

  const openEdit = (v: VehicleRow) => {
    setForm({
      name_th: v.name_th, name_en: v.name_en, slug: v.slug, category: v.category,
      seats: v.seats, bags: v.bags, price_per_day: v.price_per_day,
      description_th: v.description_th, description_en: v.description_en,
      image_url: v.image_url, is_active: v.is_active, sort_order: v.sort_order,
    })
    setEditId(v.id)
    setModal('edit')
  }

  const autoSlug = (name: string) => name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

  const handleSave = async () => {
    setSaving(true)
    const method = modal === 'add' ? 'POST' : 'PUT'
    const body = modal === 'edit' ? { id: editId, ...form } : form

    const res = await fetch('/api/admin/vehicles', {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    if (res.ok) {
      setToast({ message: 'บันทึกเรียบร้อย ✓', type: 'success' })
      setModal(null)
      fetchVehicles()
    } else {
      setToast({ message: 'เกิดข้อผิดพลาด', type: 'error' })
    }
    setSaving(false)
  }

  const toggleActive = async (v: VehicleRow) => {
    await fetch('/api/admin/vehicles', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: v.id, is_active: !v.is_active }),
    })
    fetchVehicles()
  }

  return (
    <div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 700, color: '#FFFFFF', marginBottom: 4 }}>Vehicles</h1>
          <p style={{ fontSize: 14, color: '#9CA3AF' }}>จัดการข้อมูลรถ</p>
        </div>
        <button onClick={openAdd} style={{ padding: '10px 24px', background: 'linear-gradient(135deg, #B9973E, #E5C97A)', border: 'none', borderRadius: 10, color: '#0B1C2D', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
          + เพิ่มรถใหม่
        </button>
      </div>

      {/* Table */}
      <div style={{ background: '#12263A', borderRadius: 12, border: '1px solid rgba(198,167,94,0.08)', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: 48, textAlign: 'center' }}>
            <div style={{ fontSize: 24, color: '#C6A75E', animation: 'pulse 1.5s infinite' }}>⏳</div>
            <p style={{ fontSize: 14, color: '#9CA3AF', marginTop: 8 }}>กำลังโหลด...</p>
          </div>
        ) : vehicles.length === 0 ? (
          <div style={{ padding: 48, textAlign: 'center' }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🚐</div>
            <p style={{ fontSize: 15, color: '#9CA3AF' }}>ยังไม่มีข้อมูลรถ</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 700 }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(198,167,94,0.08)' }}>
                  {['#', 'ชื่อรถ', 'หมวดหมู่', 'ที่นั่ง', 'กระเป๋า', 'ราคา/วัน', 'สถานะ', 'แก้ไข'].map((h) => (
                    <th key={h} style={{ padding: '12px 14px', fontSize: 11, fontWeight: 600, color: '#9CA3AF', textAlign: 'left', textTransform: 'uppercase', letterSpacing: 0.5 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {vehicles.map((v) => {
                  const cat = CATEGORY_BADGE[v.category] || CATEGORY_BADGE.vip
                  return (
                    <tr key={v.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', opacity: v.is_active ? 1 : 0.4, transition: 'opacity 0.2s' }}>
                      <td style={{ padding: '12px 14px', fontSize: 13, color: '#9CA3AF' }}>{v.sort_order}</td>
                      <td style={{ padding: '12px 14px' }}>
                        <div style={{ fontSize: 14, color: '#FFFFFF', fontWeight: 500 }}>{v.name_th}</div>
                        <div style={{ fontSize: 11, color: '#9CA3AF' }}>{v.name_en}</div>
                      </td>
                      <td style={{ padding: '12px 14px' }}>
                        <span style={{ fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 50, background: cat.bg, color: cat.color, textTransform: 'uppercase' }}>{v.category}</span>
                      </td>
                      <td style={{ padding: '12px 14px', fontSize: 13, color: '#F5F5F5' }}>{v.seats}</td>
                      <td style={{ padding: '12px 14px', fontSize: 13, color: '#F5F5F5' }}>{v.bags}</td>
                      <td style={{ padding: '12px 14px', fontSize: 13, fontWeight: 600, color: '#C6A75E' }}>฿{v.price_per_day.toLocaleString()}</td>
                      <td style={{ padding: '12px 14px' }}>
                        <button onClick={() => toggleActive(v)} style={{ padding: '4px 14px', borderRadius: 50, border: 'none', fontSize: 11, fontWeight: 600, cursor: 'pointer', background: v.is_active ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)', color: v.is_active ? '#22C55E' : '#EF4444' }}>
                          {v.is_active ? 'เปิด' : 'ปิด'}
                        </button>
                      </td>
                      <td style={{ padding: '12px 14px' }}>
                        <button onClick={() => openEdit(v)} style={{ padding: '6px 14px', borderRadius: 8, border: '1px solid rgba(198,167,94,0.2)', background: 'transparent', color: '#C6A75E', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>แก้ไข</button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {modal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }} onClick={() => setModal(null)}>
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)' }} />
          <div style={{ position: 'relative', width: '100%', maxWidth: 560, maxHeight: '90vh', overflow: 'auto', background: '#12263A', borderRadius: 20, border: '1px solid rgba(198,167,94,0.15)', padding: 32 }} onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setModal(null)} style={{ position: 'absolute', top: 16, right: 16, background: 'transparent', border: 'none', color: '#9CA3AF', fontSize: 20, cursor: 'pointer' }}>✕</button>

            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 700, color: '#FFFFFF', marginBottom: 24 }}>
              {modal === 'add' ? 'เพิ่มรถใหม่' : 'แก้ไขรถ'}
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={labelStyle}>ชื่อรถ (ไทย) *</label>
                  <input value={form.name_th} onChange={(e) => setForm({ ...form, name_th: e.target.value })} style={inputStyle} placeholder="เช่น โตโยต้า คอมมิวเตอร์" />
                </div>
                <div>
                  <label style={labelStyle}>ชื่อรถ (EN)</label>
                  <input value={form.name_en} onChange={(e) => { setForm({ ...form, name_en: e.target.value, slug: form.slug || autoSlug(e.target.value) }) }} style={inputStyle} placeholder="Toyota Commuter" />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={labelStyle}>Slug</label>
                  <input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} style={inputStyle} placeholder="toyota-commuter-vip" />
                </div>
                <div>
                  <label style={labelStyle}>หมวดหมู่</label>
                  <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} style={inputStyle}>
                    <option value="vip">VIP</option>
                    <option value="standard">Standard</option>
                    <option value="executive">Executive</option>
                    <option value="premium">Premium</option>
                    <option value="luxury">Luxury</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
                <div>
                  <label style={labelStyle}>ที่นั่ง</label>
                  <input type="number" min={1} value={form.seats} onChange={(e) => setForm({ ...form, seats: Number(e.target.value) })} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>กระเป๋า</label>
                  <input type="number" min={0} value={form.bags} onChange={(e) => setForm({ ...form, bags: Number(e.target.value) })} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>ราคา/วัน (฿)</label>
                  <input type="number" min={0} value={form.price_per_day} onChange={(e) => setForm({ ...form, price_per_day: Number(e.target.value) })} style={inputStyle} />
                </div>
              </div>

              <div>
                <label style={labelStyle}>คำอธิบาย (ไทย)</label>
                <textarea value={form.description_th} onChange={(e) => setForm({ ...form, description_th: e.target.value })} rows={2} style={{ ...inputStyle, resize: 'vertical' }} />
              </div>
              <div>
                <label style={labelStyle}>คำอธิบาย (EN)</label>
                <textarea value={form.description_en} onChange={(e) => setForm({ ...form, description_en: e.target.value })} rows={2} style={{ ...inputStyle, resize: 'vertical' }} />
              </div>

              <div>
                <label style={labelStyle}>URL รูปรถ</label>
                <input value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} style={inputStyle} placeholder="https://..." />
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
              <button onClick={handleSave} disabled={saving || !form.name_th} style={{ flex: 2, padding: '12px', background: (!form.name_th || saving) ? 'rgba(198,167,94,0.2)' : 'linear-gradient(135deg, #B9973E, #E5C97A)', border: 'none', borderRadius: 10, color: '#0B1C2D', fontSize: 14, fontWeight: 700, cursor: (!form.name_th || saving) ? 'not-allowed' : 'pointer', opacity: (!form.name_th || saving) ? 0.5 : 1 }}>
                {saving ? 'กำลังบันทึก...' : 'บันทึก'}
              </button>
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
