import Link from 'next/link'
import { supabaseAdmin } from '@/lib/supabase-admin'
import type { Booking } from '@/lib/types'

// ปิด cache เพื่อให้ได้ข้อมูลล่าสุดทุกครั้ง
export const dynamic = 'force-dynamic'

const STATUS_BADGE: Record<string, { bg: string; color: string; label: string }> = {
  pending: { bg: 'rgba(234,179,8,0.15)', color: '#EAB308', label: 'รอดำเนินการ' },
  confirmed: { bg: 'rgba(34,197,94,0.15)', color: '#22C55E', label: 'ยืนยันแล้ว' },
  completed: { bg: 'rgba(59,130,246,0.15)', color: '#3B82F6', label: 'เสร็จสิ้น' },
  cancelled: { bg: 'rgba(239,68,68,0.15)', color: '#EF4444', label: 'ยกเลิก' },
}

const SERVICE_LABEL: Record<string, string> = {
  airport: '✈️ สนามบิน',
  daily: '🚐 รายวัน',
  tour: '🏖️ ทัวร์',
}

export default async function AdminDashboardPage() {
  // ดึงข้อมูลทั้งหมดพร้อมกัน
  const today = new Date().toISOString().split('T')[0]

  const [
    { count: totalBookings },
    { count: todayBookings },
    { data: recentBookings },
  ] = await Promise.all([
    supabaseAdmin.from('bookings').select('*', { count: 'exact', head: true }),
    supabaseAdmin.from('bookings').select('*', { count: 'exact', head: true }).gte('created_at', `${today}T00:00:00`).lte('created_at', `${today}T23:59:59`),
    supabaseAdmin.from('bookings').select('*').order('created_at', { ascending: false }).limit(10),
  ])

  const stats = [
    { icon: '📋', label: 'Bookings วันนี้', value: todayBookings ?? 0, color: '#EAB308' },
    { icon: '📋', label: 'Bookings ทั้งหมด', value: totalBookings ?? 0, color: '#C6A75E' },
    { icon: '🚐', label: 'รถที่เปิดให้บริการ', value: 6, color: '#22C55E' },
    { icon: '✈️', label: 'เส้นทางทั้งหมด', value: 6, color: '#3B82F6' },
  ]

  const bookings = (recentBookings ?? []) as Booking[]

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 700, color: '#FFFFFF', marginBottom: 4 }}>Dashboard</h1>
        <p style={{ fontSize: 14, color: '#9CA3AF' }}>ภาพรวมระบบ SunSeaRapidsCare</p>
      </div>

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 32 }} className="admin-stats-grid">
        {stats.map((s, i) => (
          <div key={i} style={{ background: '#12263A', borderRadius: 16, border: '1px solid rgba(198,167,94,0.08)', padding: '24px 20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <span style={{ fontSize: 24 }}>{s.icon}</span>
              <span style={{ fontSize: 13, color: '#9CA3AF', fontWeight: 500 }}>{s.label}</span>
            </div>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 36, fontWeight: 700, color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Recent Bookings */}
      <div style={{ background: '#12263A', borderRadius: 16, border: '1px solid rgba(198,167,94,0.08)', overflow: 'hidden' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(198,167,94,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: '#FFFFFF' }}>Bookings ล่าสุด</h2>
          <Link href="/admin/bookings" style={{ fontSize: 13, color: '#C6A75E', textDecoration: 'none', fontWeight: 600 }}>ดูทั้งหมด →</Link>
        </div>

        {bookings.length === 0 ? (
          <div style={{ padding: '48px 24px', textAlign: 'center' }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>📋</div>
            <p style={{ fontSize: 15, color: '#9CA3AF' }}>ยังไม่มีข้อมูล Booking</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 600 }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(198,167,94,0.08)' }}>
                  {['Ref', 'ลูกค้า', 'ประเภท', 'วันเดินทาง', 'สถานะ'].map((h) => (
                    <th key={h} style={{ padding: '12px 16px', fontSize: 12, fontWeight: 600, color: '#9CA3AF', textAlign: 'left', textTransform: 'uppercase', letterSpacing: 0.5 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {bookings.map((b) => {
                  const status = STATUS_BADGE[b.status] || STATUS_BADGE.pending
                  return (
                    <tr key={b.id} style={{ borderBottom: '1px solid rgba(198,167,94,0.04)', cursor: 'pointer', transition: 'background 0.15s' }}>
                      <td style={{ padding: '14px 16px' }}>
                        <span style={{ fontSize: 13, fontWeight: 600, color: '#C6A75E' }}>{b.reference_number}</span>
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ fontSize: 14, color: '#FFFFFF', fontWeight: 500 }}>{b.customer_name}</div>
                        <div style={{ fontSize: 12, color: '#9CA3AF' }}>{b.customer_phone}</div>
                      </td>
                      <td style={{ padding: '14px 16px', fontSize: 13, color: '#F5F5F5' }}>
                        {SERVICE_LABEL[b.service_type] || b.service_type}
                      </td>
                      <td style={{ padding: '14px 16px', fontSize: 13, color: '#F5F5F5' }}>{b.travel_date}</td>
                      <td style={{ padding: '14px 16px' }}>
                        <span style={{ fontSize: 12, fontWeight: 600, padding: '4px 12px', borderRadius: 50, background: status.bg, color: status.color }}>
                          {status.label}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Responsive styles for stats grid */}
      <style>{`
        @media (max-width: 768px) {
          .admin-stats-grid { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 480px) {
          .admin-stats-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}
