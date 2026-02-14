'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import type { Vehicle, Route } from '@/lib/data'
import { supabase } from '@/lib/supabase'
import type { BookingInsert } from '@/lib/types'
import LocationPicker from '@/components/LocationPicker'

/* ── Types ── */
interface BookingData {
  serviceType: 'airport' | 'daily' | 'tour' | ''
  airport: string
  destination: string
  customDestination: string
  direction: 'pickup' | 'dropoff'
  pickupLocation: string
  dropoffLocation: string
  numDays: number
  date: string
  time: string
  passengers: number
  bags: number
  selectedVehicle: string
  name: string
  email: string
  countryCode: string
  phone: string
  contactMethod: string
  lineId: string
  flightNumber: string
  hotelName: string
  notes: string
  termsAccepted: boolean
}

interface Props {
  fleet: Vehicle[]
  routes: Route[]
  lineUrl: string
  phone: string
  phoneRaw: string
  whatsappUrl: string
}

/* ── Constants ── */
const TIME_SLOTS: string[] = []
for (let h = 0; h < 24; h++) {
  for (const m of ['00', '30']) {
    TIME_SLOTS.push(`${String(h).padStart(2, '0')}:${m}`)
  }
}

const COUNTRY_CODES = [
  { flag: '🇹🇭', code: '+66', label: 'TH +66' },
  { flag: '🇺🇸', code: '+1', label: 'US +1' },
  { flag: '🇬🇧', code: '+44', label: 'UK +44' },
  { flag: '🇨🇳', code: '+86', label: 'CN +86' },
  { flag: '🇯🇵', code: '+81', label: 'JP +81' },
  { flag: '🇰🇷', code: '+82', label: 'KR +82' },
  { flag: '🇩🇪', code: '+49', label: 'DE +49' },
  { flag: '🇫🇷', code: '+33', label: 'FR +33' },
  { flag: '🇦🇺', code: '+61', label: 'AU +61' },
  { flag: '🇸🇬', code: '+65', label: 'SG +65' },
  { flag: '🇭🇰', code: '+852', label: 'HK +852' },
  { flag: '🇮🇳', code: '+91', label: 'IN +91' },
  { flag: '🇷🇺', code: '+7', label: 'RU +7' },
  { flag: '🇦🇪', code: '+971', label: 'AE +971' },
]

const AIRPORTS = ['สุวรรณภูมิ (BKK)', 'ดอนเมือง (DMK)']
const DESTINATIONS = ['กรุงเทพ ในเมือง', 'พัทยา', 'หัวหิน', 'เขาใหญ่']

const SERVICE_TYPES = [
  { value: 'airport' as const, icon: '✈️', label: 'รับส่งสนามบิน', sub: 'Airport Transfer' },
  { value: 'daily' as const, icon: '🚐', label: 'เช่ารถรายวัน', sub: 'Daily Rental' },
  { value: 'tour' as const, icon: '🏖️', label: 'ทัวร์ท่องเที่ยว', sub: 'Tour Trip' },
]

const INITIAL: BookingData = {
  serviceType: '',
  airport: AIRPORTS[0],
  destination: DESTINATIONS[0],
  customDestination: '',
  direction: 'pickup',
  pickupLocation: '',
  dropoffLocation: '',
  numDays: 1,
  date: '',
  time: '08:00',
  passengers: 4,
  bags: 2,
  selectedVehicle: '',
  name: '',
  email: '',
  countryCode: '+66',
  phone: '',
  contactMethod: 'LINE',
  lineId: '',
  flightNumber: '',
  hotelName: '',
  notes: '',
  termsAccepted: false,
}

/* ── Shared styles ── */
const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '14px 16px',
  background: '#1A2F45',
  border: '1px solid rgba(198,167,94,0.3)',
  borderRadius: 12,
  color: '#FFFFFF',
  fontSize: 15,
  outline: 'none',
  transition: 'border-color 0.2s, box-shadow 0.2s',
  minHeight: 48,
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: 13,
  fontWeight: 600,
  color: '#C6A75E',
  marginBottom: 8,
}

const errorStyle: React.CSSProperties = {
  fontSize: 12,
  color: '#EF4444',
  marginTop: 4,
}

/* ── Main Component ── */
export default function BookingForm({ fleet, routes, lineUrl, phone, phoneRaw, whatsappUrl }: Props) {
  const [formStep, setFormStep] = useState(1) // 1, 2, 3
  const [confirmed, setConfirmed] = useState(false)
  const [data, setData] = useState<BookingData>(INITIAL)
  const [errors, setErrors] = useState<Partial<Record<keyof BookingData, string>>>({})
  const [refNumber, setRefNumber] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const update = <K extends keyof BookingData>(key: K, value: BookingData[K]) => {
    setData((prev) => ({ ...prev, [key]: value }))
    setErrors((prev) => ({ ...prev, [key]: undefined }))
  }

  /* ── Today's date for min ── */
  const today = new Date().toISOString().split('T')[0]

  /* ── Price estimation ── */
  const estimatedPrice = useMemo(() => {
    if (data.serviceType === 'airport') {
      const dest = data.destination === 'อื่นๆ' ? null : data.destination
      if (!dest) return null
      const match = routes.find((r) => r.from === data.airport && r.to === dest)
      if (!match) return null
      return { sedan: match.sedan, van: match.van, time: match.time }
    }
    return null
  }, [data.serviceType, data.airport, data.destination, routes])

  /* ── Smart vehicle recommendations ── */
  const recommendedVehicles = useMemo(() => {
    const p = data.passengers
    if (p > 13) return []

    const sorted = [...fleet]
    if (p <= 4) {
      sorted.sort((a, b) => {
        const order = ['toyota-alphard-executive', 'hyundai-h1-vip', 'hyundai-staria-luxury', 'toyota-majesty-premium', 'toyota-commuter-vip', 'toyota-commuter-standard']
        return order.indexOf(a.slug) - order.indexOf(b.slug)
      })
    } else if (p <= 9) {
      sorted.sort((a, b) => {
        const order = ['toyota-commuter-vip', 'toyota-majesty-premium', 'hyundai-staria-luxury', 'hyundai-h1-vip', 'toyota-alphard-executive', 'toyota-commuter-standard']
        return order.indexOf(a.slug) - order.indexOf(b.slug)
      })
    } else {
      sorted.sort((a, b) => {
        const order = ['toyota-commuter-standard', 'toyota-commuter-vip', 'toyota-majesty-premium', 'hyundai-staria-luxury', 'hyundai-h1-vip', 'toyota-alphard-executive']
        return order.indexOf(a.slug) - order.indexOf(b.slug)
      })
    }
    return sorted
  }, [data.passengers, fleet])

  const topRecommendation = useMemo(() => {
    if (data.passengers > 13) return null
    const p = data.passengers
    if (p <= 4) return fleet.find((v) => v.slug === 'toyota-alphard-executive') || fleet[0]
    if (p <= 5) return fleet.find((v) => v.slug === 'hyundai-h1-vip') || fleet[0]
    if (p <= 7) return fleet.find((v) => v.slug === 'toyota-commuter-vip') || fleet[0]
    if (p <= 9) return fleet.find((v) => v.slug === 'toyota-commuter-vip') || fleet[0]
    return fleet.find((v) => v.slug === 'toyota-commuter-standard') || fleet[0]
  }, [data.passengers, fleet])

  /* ── Validation ── */
  const validateStep1 = (): boolean => {
    const e: Partial<Record<keyof BookingData, string>> = {}
    if (!data.serviceType) e.serviceType = 'กรุณาเลือกประเภทบริการ'
    if (!data.date) e.date = 'กรุณาเลือกวันที่เดินทาง'
    if (!data.time) e.time = 'กรุณาเลือกเวลารับ'
    if (data.passengers < 1) e.passengers = 'จำนวนผู้โดยสารต้องมากกว่า 0'
    if (data.serviceType === 'airport' && data.destination === 'อื่นๆ' && !data.customDestination) {
      e.customDestination = 'กรุณาระบุปลายทาง'
    }
    if ((data.serviceType === 'daily' || data.serviceType === 'tour') && !data.pickupLocation) {
      e.pickupLocation = 'กรุณาระบุสถานที่รับ'
    }
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const validateStep2 = (): boolean => {
    if (data.passengers > 13) return true
    const e: Partial<Record<keyof BookingData, string>> = {}
    if (!data.selectedVehicle) e.selectedVehicle = 'กรุณาเลือกรถ'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const validateStep3 = (): boolean => {
    const e: Partial<Record<keyof BookingData, string>> = {}
    if (!data.name.trim()) e.name = 'กรุณากรอกชื่อ-นามสกุล'
    if (!data.email.trim()) e.email = 'กรุณากรอกอีเมล'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) e.email = 'รูปแบบอีเมลไม่ถูกต้อง'
    if (!data.phone.trim()) e.phone = 'กรุณากรอกเบอร์โทร'
    if (data.contactMethod === 'LINE' && !data.lineId.trim()) e.lineId = 'กรุณากรอก LINE ID'
    if (!data.termsAccepted) e.termsAccepted = 'กรุณายอมรับเงื่อนไขการใช้บริการ'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const goNext = () => {
    if (formStep === 1 && validateStep1()) setFormStep(2)
    else if (formStep === 2 && validateStep2()) setFormStep(3)
    else if (formStep === 3 && validateStep3()) handleSubmit()
  }

  const goBack = () => {
    if (formStep > 1) setFormStep(formStep - 1)
    setErrors({})
  }

  /* ── Submit ── */
  const handleSubmit = async () => {
    setIsSubmitting(true)
    setSubmitError('')

    const now = new Date()
    const dateStr = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`
    const rand = String(Math.floor(1000 + Math.random() * 9000))
    const ref = `SSRC-${dateStr}-${rand}`

    const bookingData: BookingInsert = {
      reference_number: ref,
      service_type: data.serviceType,
      pickup_location: data.serviceType === 'airport'
        ? (data.direction === 'pickup' ? data.airport : (data.destination === 'อื่นๆ' ? data.customDestination : data.destination))
        : data.pickupLocation,
      dropoff_location: data.serviceType === 'airport'
        ? (data.direction === 'pickup' ? (data.destination === 'อื่นๆ' ? data.customDestination : data.destination) : data.airport)
        : data.dropoffLocation,
      airport: data.serviceType === 'airport' ? data.airport : '',
      direction: data.serviceType === 'airport' ? data.direction : '',
      travel_date: data.date,
      travel_time: data.time,
      num_days: data.serviceType === 'airport' ? 1 : data.numDays,
      passengers: data.passengers,
      luggage: data.bags,
      vehicle_slug: data.selectedVehicle,
      vehicle_name: selectedVehicleObj ? `${selectedVehicleObj.name} (${selectedVehicleObj.type})` : '',
      estimated_price: estimatedPrice ? Number(estimatedPrice.van.replace(/,/g, '')) : (selectedVehicleObj ? selectedVehicleObj.priceNum : 0),
      customer_name: data.name,
      customer_email: data.email,
      customer_phone: data.phone,
      country_code: data.countryCode,
      preferred_contact: data.contactMethod,
      line_id: data.lineId,
      flight_number: data.flightNumber,
      hotel_name: data.hotelName,
      special_notes: data.notes,
      status: 'pending',
      payment_status: 'unpaid',
    }

    console.log('=== BOOKING SUBMITTED ===')
    console.log('Reference:', ref)
    console.log('Data:', JSON.stringify(bookingData, null, 2))
    console.log('========================')

    try {
      const { error } = await supabase.from('bookings').insert([bookingData])
      if (error) throw error
      fetch('/api/booking-notify', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(bookingData) })
      setRefNumber(ref)
      setConfirmed(true)
    } catch (err) {
      console.error('Booking insert error:', err)
      setSubmitError('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง')
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetForm = () => {
    setData(INITIAL)
    setErrors({})
    setFormStep(1)
    setConfirmed(false)
    setRefNumber('')
    setSubmitError('')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  /* ── Get vehicle display price ── */
  const getVehiclePrice = (v: Vehicle): string => {
    if (data.serviceType === 'airport' && estimatedPrice) {
      return `฿${estimatedPrice.van}`
    }
    return `฿${v.price}/วัน`
  }

  /* ── Selected vehicle obj ── */
  const selectedVehicleObj = fleet.find((v) => v.slug === data.selectedVehicle)

  /* ── Focus handler for input glow ── */
  const onFocus = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    e.target.style.borderColor = '#C6A75E'
    e.target.style.boxShadow = '0 0 0 3px rgba(198,167,94,0.15)'
  }
  const onBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    e.target.style.borderColor = 'rgba(198,167,94,0.3)'
    e.target.style.boxShadow = 'none'
  }

  /* ── LINE share message ── */
  const buildShareMsg = () => {
    const sv = selectedVehicleObj
    const svcLabel = data.serviceType === 'airport' ? 'รับส่งสนามบิน' : data.serviceType === 'daily' ? 'เช่ารถรายวัน' : 'ทัวร์ท่องเที่ยว'
    let msg = `📋 *การจองรถ ${refNumber}*\n\n`
    msg += `ประเภท: ${svcLabel}\n`
    if (data.serviceType === 'airport') {
      msg += `สนามบิน: ${data.airport}\nปลายทาง: ${data.destination === 'อื่นๆ' ? data.customDestination : data.destination}\n`
      msg += `ทิศทาง: ${data.direction === 'pickup' ? 'รับจากสนามบิน' : 'ส่งไปสนามบิน'}\n`
      if (data.flightNumber) msg += `เที่ยวบิน: ${data.flightNumber}\n`
    } else {
      msg += `รับ: ${data.pickupLocation}\nส่ง: ${data.dropoffLocation}\nจำนวนวัน: ${data.numDays}\n`
      if (data.hotelName) msg += `ที่พัก: ${data.hotelName}\n`
    }
    msg += `วันที่: ${data.date}\nเวลา: ${data.time}\n`
    msg += `ผู้โดยสาร: ${data.passengers} คน\nกระเป๋า: ${data.bags} ใบ\n`
    if (sv) msg += `รถ: ${sv.name} (${sv.type})\n`
    msg += `\nชื่อ: ${data.name}\nโทร: ${data.countryCode} ${data.phone}`
    return encodeURIComponent(msg)
  }

  /* ═══════════════════════════
     RENDER
     ═══════════════════════════ */
  return (
    <section style={{ maxWidth: 700, margin: '0 auto', padding: '20px 24px 120px' }}>

      {/* ── Page Header ── */}
      <div style={{ textAlign: 'center', marginBottom: 40 }}>
        <span style={{ color: '#C6A75E', fontSize: 13, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>Booking</span>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(24px, 4vw, 40px)', fontWeight: 700, color: '#FFFFFF', margin: '0 0 8px' }}>
          จองรถตู้ <span className="gold-shimmer">VIP</span> พร้อมคนขับ
        </h1>
        <p style={{ fontSize: 15, color: '#9CA3AF' }}>จองด่วนผ่าน LINE หรือกรอกแบบฟอร์มออนไลน์</p>
        <div style={{ width: 60, height: 3, background: 'linear-gradient(90deg, #B9973E, #E5C97A)', margin: '16px auto 0', borderRadius: 2 }} />
      </div>

      {/* ═══ CONFIRMATION VIEW ═══ */}
      {confirmed ? (
        <div style={{ background: '#12263A', borderRadius: 20, border: '1px solid rgba(198,167,94,0.3)', padding: 32 }}>
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <div style={{ fontSize: 56, marginBottom: 16 }}>✅</div>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 700, color: '#FFFFFF', marginBottom: 8 }}>จองสำเร็จ!</h3>
            <div style={{ display: 'inline-block', padding: '8px 20px', background: 'rgba(198,167,94,0.12)', border: '1px solid rgba(198,167,94,0.3)', borderRadius: 8, marginBottom: 12 }}>
              <span style={{ fontSize: 12, color: '#9CA3AF' }}>หมายเลขอ้างอิง</span>
              <div style={{ fontSize: 20, fontWeight: 700, color: '#C6A75E', letterSpacing: 1 }}>{refNumber}</div>
            </div>
            <p style={{ fontSize: 14, color: '#9CA3AF', lineHeight: 1.7 }}>
              ทีมงานจะติดต่อกลับภายใน 30 นาที ผ่าน <span style={{ color: '#C6A75E', fontWeight: 600 }}>{data.contactMethod}</span>
            </p>
          </div>

          {/* Summary */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 32 }}>
            {[
              { label: 'ประเภทบริการ', value: data.serviceType === 'airport' ? '✈️ รับส่งสนามบิน' : data.serviceType === 'daily' ? '🚐 เช่ารถรายวัน' : '🏖️ ทัวร์ท่องเที่ยว' },
              ...(data.serviceType === 'airport' ? [
                { label: 'สนามบิน', value: data.airport },
                { label: 'ปลายทาง', value: data.destination === 'อื่นๆ' ? data.customDestination : data.destination },
                { label: 'ทิศทาง', value: data.direction === 'pickup' ? 'รับจากสนามบิน' : 'ส่งไปสนามบิน' },
                ...(data.flightNumber ? [{ label: 'เที่ยวบิน', value: data.flightNumber }] : []),
              ] : [
                { label: 'สถานที่รับ', value: data.pickupLocation },
                { label: 'สถานที่ส่ง', value: data.dropoffLocation || '-' },
                { label: 'จำนวนวัน', value: `${data.numDays} วัน` },
                ...(data.hotelName ? [{ label: 'ที่พัก', value: data.hotelName }] : []),
              ]),
              { label: 'วันที่', value: data.date },
              { label: 'เวลา', value: data.time },
              { label: 'ผู้โดยสาร', value: `${data.passengers} คน` },
              { label: 'กระเป๋า', value: `${data.bags} ใบ` },
              ...(selectedVehicleObj ? [{ label: 'รถที่เลือก', value: `${selectedVehicleObj.name} (${selectedVehicleObj.type})` }] : []),
              ...(estimatedPrice ? [{ label: 'ราคาประมาณ', value: `Sedan ฿${estimatedPrice.sedan} / VAN ฿${estimatedPrice.van}` }] : []),
              { label: 'ชื่อ', value: data.name },
              { label: 'โทร', value: `${data.countryCode} ${data.phone}` },
              { label: 'อีเมล', value: data.email },
              { label: 'ติดต่อกลับผ่าน', value: data.contactMethod },
              ...(data.notes ? [{ label: 'หมายเหตุ', value: data.notes }] : []),
            ].map((row, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 16px', background: i % 2 === 0 ? 'rgba(26,47,69,0.5)' : 'transparent', borderRadius: 8 }}>
                <span style={{ fontSize: 13, color: '#9CA3AF' }}>{row.label}</span>
                <span style={{ fontSize: 13, color: '#F5F5F5', fontWeight: 500, textAlign: 'right', maxWidth: '60%' }}>{row.value}</span>
              </div>
            ))}
          </div>

          {/* ── Payment Info ── */}
          <div style={{ marginBottom: 32, padding: 24, background: 'rgba(198,167,94,0.06)', borderRadius: 16, border: '1px solid rgba(198,167,94,0.15)' }}>
            <h4 style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 700, color: '#FFFFFF', marginBottom: 4 }}>
              💳 ข้อมูลการชำระเงิน
            </h4>
            <p style={{ fontSize: 13, color: '#C6A75E', marginBottom: 20, fontWeight: 600 }}>
              ชำระเงินมัดจำ 30% เพื่อยืนยันการจอง — ส่วนที่เหลือชำระวันเดินทาง
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* Bank Transfer */}
              <div style={{ padding: 16, background: '#1A2F45', borderRadius: 12, border: '1px solid rgba(198,167,94,0.1)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                  <span style={{ fontSize: 20 }}>🏦</span>
                  <span style={{ fontSize: 14, fontWeight: 700, color: '#FFFFFF' }}>โอนเงินผ่านธนาคาร</span>
                </div>
                <div style={{ fontSize: 13, color: '#9CA3AF', lineHeight: 1.8 }}>
                  <div>ธนาคาร: <span style={{ color: '#F5F5F5' }}>กสิกรไทย (KBank)</span></div>
                  <div>ชื่อบัญชี: <span style={{ color: '#F5F5F5' }}>บจก. ซันซี ราปิดส์แคร์</span></div>
                  <div>เลขบัญชี: <span style={{ color: '#C6A75E', fontWeight: 600, letterSpacing: 1 }}>XXX-X-XXXXX-X</span></div>
                </div>
              </div>

              {/* PromptPay */}
              <div style={{ padding: 16, background: '#1A2F45', borderRadius: 12, border: '1px solid rgba(198,167,94,0.1)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                  <span style={{ fontSize: 20 }}>📱</span>
                  <span style={{ fontSize: 14, fontWeight: 700, color: '#FFFFFF' }}>พร้อมเพย์ (PromptPay)</span>
                </div>
                <div style={{ textAlign: 'center', padding: '16px 0' }}>
                  <div style={{ width: 120, height: 120, background: '#FFFFFF', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
                    <span style={{ fontSize: 48 }}>📲</span>
                  </div>
                  <span style={{ fontSize: 12, color: '#9CA3AF' }}>QR Code จะถูกส่งให้ทาง LINE / Email</span>
                </div>
              </div>

              {/* Credit Card */}
              <div style={{ padding: 16, background: '#1A2F45', borderRadius: 12, border: '1px solid rgba(198,167,94,0.1)', opacity: 0.6 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 20 }}>💳</span>
                  <span style={{ fontSize: 14, fontWeight: 700, color: '#FFFFFF' }}>บัตรเครดิต / เดบิต</span>
                  <span style={{ fontSize: 11, padding: '3px 10px', background: 'rgba(198,167,94,0.15)', border: '1px solid rgba(198,167,94,0.3)', borderRadius: 50, color: '#C6A75E', fontWeight: 600 }}>Coming Soon</span>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <a
              href={`https://line.me/R/ti/p/@sunsearapidscare?text=${buildShareMsg()}`}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '16px', background: '#06C755', borderRadius: 12, textDecoration: 'none', color: '#FFFFFF', fontSize: 15, fontWeight: 700 }}
            >
              💬 แชร์ข้อมูลจองผ่าน LINE
            </a>
            <button onClick={resetForm} style={{ padding: '14px', background: 'linear-gradient(135deg, #B9973E, #E5C97A)', border: 'none', borderRadius: 12, color: '#0B1C2D', fontSize: 15, fontWeight: 700, cursor: 'pointer' }}>
              จองอีกครั้ง
            </button>
            <Link href="/" style={{ display: 'block', padding: '14px', border: '1px solid rgba(198,167,94,0.3)', borderRadius: 12, color: '#C6A75E', fontSize: 15, fontWeight: 600, textAlign: 'center', textDecoration: 'none' }}>
              กลับหน้าหลัก
            </Link>
          </div>
        </div>
      ) : (
        <>
          {/* ═══ QUICK BOOKING ═══ */}
          <div style={{ marginBottom: 32 }}>
            <div style={{ textAlign: 'center', marginBottom: 20 }}>
              <div style={{ fontSize: 40, marginBottom: 8 }}>⚡</div>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 700, color: '#FFFFFF', marginBottom: 4 }}>จองด่วน</h2>
              <p style={{ fontSize: 13, color: '#9CA3AF' }}>ตอบกลับภายใน 5 นาที</p>
            </div>

            <div className="quick-booking-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
              {/* LINE */}
              <a
                href={lineUrl}
                style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '16px 20px', background: '#06C755', borderRadius: 14, textDecoration: 'none', color: '#FFFFFF', transition: 'all 0.2s' }}
              >
                <span style={{ fontSize: 24, flexShrink: 0 }}>💬</span>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 700 }}>จองผ่าน LINE</div>
                  <div style={{ fontSize: 11, opacity: 0.85 }}>นิยมสุด สำหรับคนไทย</div>
                </div>
              </a>

              {/* Phone */}
              <a
                href={`tel:${phoneRaw}`}
                style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '16px 20px', background: 'linear-gradient(135deg, #B9973E, #E5C97A)', borderRadius: 14, textDecoration: 'none', color: '#0B1C2D', transition: 'all 0.2s' }}
              >
                <span style={{ fontSize: 24, flexShrink: 0 }}>📞</span>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 700 }}>โทรจอง {phone}</div>
                  <div style={{ fontSize: 11, opacity: 0.7 }}>ตอบทันที 24 ชม.</div>
                </div>
              </a>

              {/* WhatsApp */}
              <a
                href={whatsappUrl}
                style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '16px 20px', background: '#25D366', borderRadius: 14, textDecoration: 'none', color: '#FFFFFF', transition: 'all 0.2s' }}
              >
                <span style={{ fontSize: 24, flexShrink: 0 }}>📱</span>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 700 }}>WhatsApp</div>
                  <div style={{ fontSize: 11, opacity: 0.85 }}>For international customers</div>
                </div>
              </a>
            </div>
          </div>

          {/* ═══ DIVIDER ═══ */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, margin: '32px 0' }}>
            <div style={{ flex: 1, height: 1, background: 'rgba(198,167,94,0.15)' }} />
            <span style={{ fontSize: 14, color: '#9CA3AF', fontWeight: 600, whiteSpace: 'nowrap' }}>หรือ กรอกแบบฟอร์มจองออนไลน์</span>
            <div style={{ flex: 1, height: 1, background: 'rgba(198,167,94,0.15)' }} />
          </div>

          {/* ═══ ONLINE FORM ═══ */}
          <div style={{ background: '#12263A', borderRadius: 20, border: '1px solid rgba(198,167,94,0.1)', overflow: 'hidden' }}>

              {/* ── Progress Bar ── */}
              <div style={{ padding: '20px 32px 0' }}>
                <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                  {[1, 2, 3].map((s) => (
                    <div key={s} style={{ flex: 1, height: 4, borderRadius: 2, background: s <= formStep ? 'linear-gradient(135deg, #B9973E, #E5C97A)' : '#1A2F45', transition: 'background 0.3s' }} />
                  ))}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#9CA3AF' }}>
                  <span style={{ color: formStep >= 1 ? '#C6A75E' : '#9CA3AF' }}>1. รายละเอียด</span>
                  <span style={{ color: formStep >= 2 ? '#C6A75E' : '#9CA3AF' }}>2. เลือกรถ</span>
                  <span style={{ color: formStep >= 3 ? '#C6A75E' : '#9CA3AF' }}>3. ข้อมูลผู้จอง</span>
                </div>
              </div>

              <div style={{ padding: 32 }}>

                {/* ═══ STEP 1 ═══ */}
                {formStep === 1 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                    {/* 1.1 Service Type */}
                    <div>
                      <label style={labelStyle}>ประเภทบริการ *</label>
                      <div className="service-type-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
                        {SERVICE_TYPES.map((st) => (
                          <button
                            key={st.value}
                            type="button"
                            onClick={() => update('serviceType', st.value)}
                            style={{
                              padding: '16px 12px',
                              background: data.serviceType === st.value ? 'rgba(198,167,94,0.15)' : '#1A2F45',
                              border: data.serviceType === st.value ? '2px solid #C6A75E' : '1px solid rgba(198,167,94,0.15)',
                              borderRadius: 14,
                              cursor: 'pointer',
                              textAlign: 'center',
                              transition: 'all 0.2s',
                            }}
                          >
                            <div style={{ fontSize: 28, marginBottom: 6 }}>{st.icon}</div>
                            <div style={{ fontSize: 14, fontWeight: 600, color: data.serviceType === st.value ? '#C6A75E' : '#FFFFFF' }}>{st.label}</div>
                            <div style={{ fontSize: 11, color: '#9CA3AF', marginTop: 2 }}>{st.sub}</div>
                          </button>
                        ))}
                      </div>
                      {errors.serviceType && <div style={errorStyle}>{errors.serviceType}</div>}
                    </div>

                    {/* 1.2 Airport fields */}
                    {data.serviceType === 'airport' && (
                      <>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }} className="booking-grid-2col">
                          <div>
                            <label style={labelStyle}>สนามบิน</label>
                            <select value={data.airport} onChange={(e) => update('airport', e.target.value)} style={inputStyle} onFocus={onFocus} onBlur={onBlur}>
                              {AIRPORTS.map((a) => <option key={a} value={a}>{a}</option>)}
                            </select>
                          </div>
                          <div>
                            <label style={labelStyle}>ปลายทาง</label>
                            <select value={data.destination} onChange={(e) => update('destination', e.target.value)} style={inputStyle} onFocus={onFocus} onBlur={onBlur}>
                              {DESTINATIONS.map((d) => <option key={d} value={d}>{d}</option>)}
                              <option value="อื่นๆ">อื่นๆ (พิมพ์เอง)</option>
                            </select>
                          </div>
                        </div>
                        {data.destination === 'อื่นๆ' && (
                          <div>
                            <label style={labelStyle}>ระบุปลายทาง *</label>
                            <input type="text" value={data.customDestination} onChange={(e) => update('customDestination', e.target.value)} placeholder="เช่น ชะอำ, ระยอง, นครราชสีมา" style={inputStyle} onFocus={onFocus} onBlur={onBlur} />
                            {errors.customDestination && <div style={errorStyle}>{errors.customDestination}</div>}
                          </div>
                        )}
                        <div>
                          <label style={labelStyle}>ทิศทาง</label>
                          <div style={{ display: 'flex', gap: 10 }}>
                            {[
                              { val: 'pickup' as const, label: '🛬 รับจากสนามบิน' },
                              { val: 'dropoff' as const, label: '🛫 ส่งไปสนามบิน' },
                            ].map((d) => (
                              <button
                                key={d.val}
                                type="button"
                                onClick={() => update('direction', d.val)}
                                style={{
                                  flex: 1,
                                  padding: '12px',
                                  background: data.direction === d.val ? 'rgba(198,167,94,0.15)' : '#1A2F45',
                                  border: data.direction === d.val ? '2px solid #C6A75E' : '1px solid rgba(198,167,94,0.15)',
                                  borderRadius: 12,
                                  color: data.direction === d.val ? '#C6A75E' : '#FFFFFF',
                                  fontSize: 14,
                                  fontWeight: 600,
                                  cursor: 'pointer',
                                  transition: 'all 0.2s',
                                }}
                              >
                                {d.label}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Price estimation */}
                        {estimatedPrice && (
                          <div style={{ padding: '16px 20px', background: 'rgba(198,167,94,0.08)', border: '1px solid rgba(198,167,94,0.2)', borderRadius: 12 }}>
                            <div style={{ fontSize: 12, color: '#9CA3AF', marginBottom: 8 }}>💰 ราคาประมาณการ ({estimatedPrice.time})</div>
                            <div style={{ display: 'flex', gap: 16 }}>
                              <div>
                                <span style={{ fontSize: 12, color: '#9CA3AF' }}>Sedan: </span>
                                <span style={{ fontSize: 16, fontWeight: 700, color: '#FFFFFF' }}>฿{estimatedPrice.sedan}</span>
                              </div>
                              <div>
                                <span style={{ fontSize: 12, color: '#9CA3AF' }}>VAN VIP: </span>
                                <span style={{ fontSize: 16, fontWeight: 700, color: '#C6A75E' }}>฿{estimatedPrice.van}</span>
                              </div>
                            </div>
                          </div>
                        )}
                      </>
                    )}

                    {/* 1.3 Daily/Tour fields */}
                    {(data.serviceType === 'daily' || data.serviceType === 'tour') && (
                      <>
                        <div>
                          <LocationPicker
                            label="สถานที่รับ *"
                            placeholder="พิมพ์ชื่อสถานที่ เช่น สนามบินสุวรรณภูมิ, โรงแรม..."
                            value={data.pickupLocation}
                            onChange={(val) => update('pickupLocation', val)}
                            required
                            inputStyle={inputStyle}
                            onFocus={onFocus}
                            onBlur={onBlur}
                          />
                          {errors.pickupLocation && <div style={errorStyle}>{errors.pickupLocation}</div>}
                        </div>
                        <div>
                          <LocationPicker
                            label="สถานที่ส่ง / จุดหมาย"
                            placeholder="พิมพ์จุดหมายปลายทาง เช่น พัทยา, หัวหิน..."
                            value={data.dropoffLocation}
                            onChange={(val) => update('dropoffLocation', val)}
                            inputStyle={inputStyle}
                            onFocus={onFocus}
                            onBlur={onBlur}
                          />
                        </div>
                        <div>
                          <label style={labelStyle}>จำนวนวัน</label>
                          <input type="number" min={1} max={30} value={data.numDays} onChange={(e) => update('numDays', Number(e.target.value))} style={{ ...inputStyle, maxWidth: 120 }} onFocus={onFocus} onBlur={onBlur} />
                        </div>
                      </>
                    )}

                    {/* 1.4 Common fields */}
                    {data.serviceType && (
                      <>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }} className="booking-grid-2col">
                          <div>
                            <label style={labelStyle}>วันที่เดินทาง *</label>
                            <input type="date" min={today} value={data.date} onChange={(e) => update('date', e.target.value)} style={inputStyle} onFocus={onFocus} onBlur={onBlur} />
                            {errors.date && <div style={errorStyle}>{errors.date}</div>}
                          </div>
                          <div>
                            <label style={labelStyle}>เวลารับ *</label>
                            <select value={data.time} onChange={(e) => update('time', e.target.value)} style={inputStyle} onFocus={onFocus} onBlur={onBlur}>
                              {TIME_SLOTS.map((t) => <option key={t} value={t}>{t}</option>)}
                            </select>
                            {errors.time && <div style={errorStyle}>{errors.time}</div>}
                          </div>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }} className="booking-grid-2col">
                          <div>
                            <label style={labelStyle}>จำนวนผู้โดยสาร</label>
                            <input type="number" min={1} max={40} value={data.passengers} onChange={(e) => update('passengers', Math.max(1, Math.min(40, Number(e.target.value))))} style={inputStyle} onFocus={onFocus} onBlur={onBlur} />
                            {errors.passengers && <div style={errorStyle}>{errors.passengers}</div>}
                          </div>
                          <div>
                            <label style={labelStyle}>จำนวนกระเป๋าใหญ่</label>
                            <input type="number" min={0} max={20} value={data.bags} onChange={(e) => update('bags', Math.max(0, Math.min(20, Number(e.target.value))))} style={inputStyle} onFocus={onFocus} onBlur={onBlur} />
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                )}

                {/* ═══ STEP 2 ═══ */}
                {formStep === 2 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                    <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700, color: '#FFFFFF' }}>เลือกรถ</h3>

                    {data.passengers > 13 ? (
                      <div style={{ textAlign: 'center', padding: '32px 24px' }}>
                        <div style={{ fontSize: 40, marginBottom: 16 }}>🚐🚐</div>
                        <h4 style={{ fontSize: 17, fontWeight: 700, color: '#FFFFFF', marginBottom: 8 }}>ต้องการมากกว่า 1 คัน</h4>
                        <p style={{ fontSize: 14, color: '#9CA3AF', marginBottom: 20, lineHeight: 1.7 }}>
                          สำหรับ {data.passengers} คน กรุณาติดต่อเราโดยตรงเพื่อจัดรถให้เหมาะสม
                        </p>
                        <a href={lineUrl} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '14px 32px', background: '#06C755', borderRadius: 50, textDecoration: 'none', color: '#FFFFFF', fontSize: 15, fontWeight: 700 }}>
                          💬 แจ้งผ่าน LINE
                        </a>
                      </div>
                    ) : (
                      <>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                          {recommendedVehicles.map((v) => {
                            const isSelected = data.selectedVehicle === v.slug
                            const fits = v.seats >= data.passengers
                            return (
                              <button
                                key={v.slug}
                                type="button"
                                onClick={() => update('selectedVehicle', v.slug)}
                                style={{
                                  display: 'flex',
                                  gap: 16,
                                  alignItems: 'center',
                                  padding: '16px 20px',
                                  background: isSelected ? 'rgba(198,167,94,0.12)' : '#1A2F45',
                                  border: isSelected ? '2px solid #C6A75E' : '1px solid rgba(198,167,94,0.1)',
                                  borderRadius: 14,
                                  cursor: 'pointer',
                                  textAlign: 'left',
                                  width: '100%',
                                  transition: 'all 0.2s',
                                  opacity: fits ? 1 : 0.5,
                                }}
                              >
                                <div style={{ width: 64, height: 64, borderRadius: 12, background: '#12263A', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, flexShrink: 0, border: '1px solid rgba(198,167,94,0.08)' }}>
                                  🚐
                                </div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
                                    <span style={{ fontSize: 15, fontWeight: 700, color: isSelected ? '#C6A75E' : '#FFFFFF' }}>{v.name}</span>
                                    <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 50, background: v.badgeColor, color: '#FFFFFF' }}>{v.badge}</span>
                                  </div>
                                  <div style={{ display: 'flex', gap: 12, fontSize: 12, color: '#9CA3AF', marginBottom: 4 }}>
                                    <span>🪑 {v.seats} ที่นั่ง</span>
                                    <span>🧳 {v.bags} กระเป๋า</span>
                                  </div>
                                  {!fits && <div style={{ fontSize: 11, color: '#EF4444' }}>⚠ ที่นั่งไม่พอ ({v.seats} ที่นั่ง)</div>}
                                </div>
                                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                                  <div style={{ fontSize: 16, fontWeight: 700, color: '#C6A75E' }}>{getVehiclePrice(v)}</div>
                                  {isSelected && <div style={{ fontSize: 11, color: '#C6A75E', marginTop: 4 }}>✓ เลือกแล้ว</div>}
                                </div>
                              </button>
                            )
                          })}
                        </div>
                        {errors.selectedVehicle && <div style={errorStyle}>{errors.selectedVehicle}</div>}

                        {topRecommendation && (
                          <div style={{ padding: '12px 16px', background: 'rgba(198,167,94,0.06)', borderRadius: 10, border: '1px solid rgba(198,167,94,0.1)' }}>
                            <span style={{ fontSize: 13, color: '#9CA3AF' }}>💡 แนะนำ </span>
                            <span style={{ fontSize: 13, color: '#C6A75E', fontWeight: 600 }}>{topRecommendation.name} ({topRecommendation.type})</span>
                            <span style={{ fontSize: 13, color: '#9CA3AF' }}> สำหรับ {data.passengers} คน</span>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                )}

                {/* ═══ STEP 3 ═══ */}
                {formStep === 3 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                    <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700, color: '#FFFFFF' }}>ข้อมูลผู้จอง</h3>

                    <div>
                      <label style={labelStyle}>ชื่อ-นามสกุล *</label>
                      <input type="text" value={data.name} onChange={(e) => update('name', e.target.value)} placeholder="Full Name" style={inputStyle} onFocus={onFocus} onBlur={onBlur} />
                      {errors.name && <div style={errorStyle}>{errors.name}</div>}
                    </div>

                    <div>
                      <label style={labelStyle}>อีเมล *</label>
                      <input type="email" value={data.email} onChange={(e) => update('email', e.target.value)} placeholder="email@example.com" style={inputStyle} onFocus={onFocus} onBlur={onBlur} />
                      {errors.email && <div style={errorStyle}>{errors.email}</div>}
                    </div>

                    <div>
                      <label style={labelStyle}>เบอร์โทร *</label>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <select
                          value={data.countryCode}
                          onChange={(e) => update('countryCode', e.target.value)}
                          style={{ ...inputStyle, width: 'auto', minWidth: 110, flexShrink: 0 }}
                          onFocus={onFocus}
                          onBlur={onBlur}
                        >
                          {COUNTRY_CODES.map((c) => (
                            <option key={c.code} value={c.code}>{c.flag} {c.label}</option>
                          ))}
                        </select>
                        <input
                          type="tel"
                          value={data.phone}
                          onChange={(e) => update('phone', e.target.value)}
                          placeholder="081-234-5678"
                          style={inputStyle}
                          onFocus={onFocus}
                          onBlur={onBlur}
                        />
                      </div>
                      {errors.phone && <div style={errorStyle}>{errors.phone}</div>}
                    </div>

                    <div>
                      <label style={labelStyle}>ช่องทางที่สะดวกให้ติดต่อกลับ</label>
                      <select value={data.contactMethod} onChange={(e) => update('contactMethod', e.target.value)} style={inputStyle} onFocus={onFocus} onBlur={onBlur}>
                        {['LINE', 'WhatsApp', 'Email', 'โทร'].map((m) => (
                          <option key={m} value={m}>{m}</option>
                        ))}
                      </select>
                    </div>

                    {data.contactMethod === 'LINE' && (
                      <div>
                        <label style={labelStyle}>LINE ID *</label>
                        <input type="text" value={data.lineId} onChange={(e) => update('lineId', e.target.value)} placeholder="@yourlineid" style={inputStyle} onFocus={onFocus} onBlur={onBlur} />
                        {errors.lineId && <div style={errorStyle}>{errors.lineId}</div>}
                      </div>
                    )}

                    {/* Flight Number — airport only */}
                    {data.serviceType === 'airport' && (
                      <div>
                        <label style={labelStyle}>หมายเลขเที่ยวบิน (ถ้ามี)</label>
                        <input type="text" value={data.flightNumber} onChange={(e) => update('flightNumber', e.target.value)} placeholder="เช่น TG 104, FD 3030" style={inputStyle} onFocus={onFocus} onBlur={onBlur} />
                      </div>
                    )}

                    {/* Hotel Name — daily/tour only */}
                    {(data.serviceType === 'daily' || data.serviceType === 'tour') && (
                      <div>
                        <label style={labelStyle}>ชื่อโรงแรม / สถานที่พัก (ถ้ามี)</label>
                        <input type="text" value={data.hotelName} onChange={(e) => update('hotelName', e.target.value)} placeholder="เช่น Hilton Pattaya, อโนมา แกรนด์" style={inputStyle} onFocus={onFocus} onBlur={onBlur} />
                      </div>
                    )}

                    <div>
                      <label style={labelStyle}>หมายเหตุพิเศษ (ไม่บังคับ)</label>
                      <textarea
                        value={data.notes}
                        onChange={(e) => update('notes', e.target.value)}
                        placeholder="เช่น มีเด็กเล็ก, ต้องการ child seat, มีวีลแชร์"
                        rows={3}
                        style={{ ...inputStyle, resize: 'vertical' }}
                        onFocus={onFocus as unknown as React.FocusEventHandler<HTMLTextAreaElement>}
                        onBlur={onBlur as unknown as React.FocusEventHandler<HTMLTextAreaElement>}
                      />
                    </div>

                    {/* Terms checkbox */}
                    <div>
                      <label style={{ display: 'flex', alignItems: 'flex-start', gap: 12, cursor: 'pointer' }}>
                        <input
                          type="checkbox"
                          checked={data.termsAccepted}
                          onChange={(e) => update('termsAccepted', e.target.checked)}
                          className="booking-checkbox"
                          style={{ width: 20, height: 20, marginTop: 2, accentColor: '#C6A75E', flexShrink: 0 }}
                        />
                        <span style={{ fontSize: 13, color: '#9CA3AF', lineHeight: 1.6 }}>
                          ยอมรับ{' '}
                          <Link href="/faq" style={{ color: '#C6A75E', textDecoration: 'underline' }}>เงื่อนไขการใช้บริการ</Link>
                          {' '}และนโยบายการยกเลิก *
                        </span>
                      </label>
                      {errors.termsAccepted && <div style={errorStyle}>{errors.termsAccepted}</div>}
                    </div>
                  </div>
                )}

                {/* ── Submit Error ── */}
                {submitError && (
                  <div style={{ marginTop: 24, padding: '16px 20px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 12 }}>
                    <p style={{ fontSize: 14, color: '#EF4444', fontWeight: 600, marginBottom: 12 }}>{submitError}</p>
                    <div style={{ display: 'flex', gap: 10 }}>
                      <button
                        type="button"
                        onClick={() => setSubmitError('')}
                        style={{ flex: 1, padding: '10px 16px', background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 8, color: '#FFFFFF', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
                      >
                        ลองใหม่
                      </button>
                      <a
                        href={lineUrl}
                        style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '10px 16px', background: '#06C755', borderRadius: 8, textDecoration: 'none', color: '#FFFFFF', fontSize: 13, fontWeight: 600 }}
                      >
                        💬 จองผ่าน LINE
                      </a>
                    </div>
                  </div>
                )}

                {/* ── Navigation Buttons ── */}
                <div style={{ display: 'flex', gap: 12, marginTop: 32 }}>
                  {formStep > 1 && (
                    <button
                      type="button"
                      onClick={goBack}
                      disabled={isSubmitting}
                      style={{
                        flex: 1,
                        padding: '16px',
                        background: 'transparent',
                        border: '1px solid rgba(198,167,94,0.3)',
                        borderRadius: 12,
                        color: '#C6A75E',
                        fontSize: 15,
                        fontWeight: 600,
                        cursor: isSubmitting ? 'not-allowed' : 'pointer',
                        transition: 'all 0.2s',
                        opacity: isSubmitting ? 0.5 : 1,
                      }}
                    >
                      ← ย้อนกลับ
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={goNext}
                    disabled={(!data.serviceType && formStep === 1) || isSubmitting}
                    style={{
                      flex: formStep > 1 ? 2 : 1,
                      padding: '16px',
                      background: ((!data.serviceType && formStep === 1) || isSubmitting) ? 'rgba(198,167,94,0.2)' : 'linear-gradient(135deg, #B9973E, #E5C97A)',
                      border: 'none',
                      borderRadius: 12,
                      color: ((!data.serviceType && formStep === 1) || isSubmitting) ? '#9CA3AF' : '#0B1C2D',
                      fontSize: 16,
                      fontWeight: 700,
                      cursor: ((!data.serviceType && formStep === 1) || isSubmitting) ? 'not-allowed' : 'pointer',
                      opacity: ((!data.serviceType && formStep === 1) || isSubmitting) ? 0.5 : 1,
                      transition: 'all 0.2s',
                      boxShadow: ((!data.serviceType && formStep === 1) || isSubmitting) ? 'none' : '0 4px 20px rgba(198,167,94,0.3)',
                    }}
                  >
                    {isSubmitting ? '⏳ กำลังส่งข้อมูล...' : formStep === 3 ? '✓ ยืนยันการจอง' : 'ถัดไป →'}
                  </button>
                </div>
              </div>
          </div>
        </>
      )}
    </section>
  )
}
