'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { useJsApiLoader, GoogleMap, Marker, Autocomplete } from '@react-google-maps/api'

/* ── Types ── */
interface PlaceDetails {
  lat: number
  lng: number
  formatted_address: string
}

interface Props {
  label: string
  placeholder: string
  value: string
  onChange: (value: string, placeDetails?: PlaceDetails) => void
  required?: boolean
  country?: string
  inputStyle: React.CSSProperties
  onFocus: (e: React.FocusEvent<HTMLInputElement>) => void
  onBlur: (e: React.FocusEvent<HTMLInputElement>) => void
}

/* ── Constants ── */
const LIBRARIES: ('places')[] = ['places']
const BANGKOK = { lat: 13.7563, lng: 100.5018 }

const DARK_MAP_STYLE: google.maps.MapTypeStyle[] = [
  { elementType: 'geometry', stylers: [{ color: '#0F1B2E' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#0B1C2D' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#9CA3AF' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#1A2F45' }] },
  { featureType: 'road', elementType: 'geometry.stroke', stylers: [{ color: '#12263A' }] },
  { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#1A2F45' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#0B1C2D' }] },
  { featureType: 'poi', elementType: 'geometry', stylers: [{ color: '#12263A' }] },
  { featureType: 'poi.park', elementType: 'geometry', stylers: [{ color: '#1A2F45' }] },
  { featureType: 'transit', elementType: 'geometry', stylers: [{ color: '#12263A' }] },
]

/* ── Component ── */
export default function LocationPicker({
  label,
  placeholder,
  value,
  onChange,
  required,
  country = 'th',
  inputStyle,
  onFocus,
  onBlur,
}: Props) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''
  const hasApiKey = apiKey.length > 10

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: apiKey,
    libraries: LIBRARIES,
  })

  const [showMap, setShowMap] = useState(false)
  const [selectedAddress, setSelectedAddress] = useState('')
  const [markerPos, setMarkerPos] = useState(BANGKOK)
  const [mapAddress, setMapAddress] = useState('')
  const [isGeolocating, setIsGeolocating] = useState(false)

  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null)
  const mapRef = useRef<google.maps.Map | null>(null)
  const geocoderRef = useRef<google.maps.Geocoder | null>(null)

  // Initialize geocoder when loaded
  useEffect(() => {
    if (isLoaded && !geocoderRef.current) {
      geocoderRef.current = new google.maps.Geocoder()
    }
  }, [isLoaded])

  /* ── Autocomplete handlers ── */
  const onAutocompleteLoad = useCallback((ac: google.maps.places.Autocomplete) => {
    autocompleteRef.current = ac
  }, [])

  const onPlaceChanged = useCallback(() => {
    const ac = autocompleteRef.current
    if (!ac) return

    const place = ac.getPlace()
    if (place.geometry?.location) {
      const details: PlaceDetails = {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
        formatted_address: place.formatted_address || place.name || '',
      }
      const displayName = place.name || place.formatted_address || ''
      onChange(displayName, details)
      setSelectedAddress(details.formatted_address)
    }
  }, [onChange])

  /* ── Reverse geocode ── */
  const reverseGeocode = useCallback((lat: number, lng: number) => {
    if (!geocoderRef.current) return
    geocoderRef.current.geocode({ location: { lat, lng } }, (results, status) => {
      if (status === 'OK' && results && results[0]) {
        setMapAddress(results[0].formatted_address)
      } else {
        setMapAddress(`${lat.toFixed(5)}, ${lng.toFixed(5)}`)
      }
    })
  }, [])

  /* ── Map handlers ── */
  const onMapLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map
  }, [])

  const onMarkerDragEnd = useCallback((e: google.maps.MapMouseEvent) => {
    if (!e.latLng) return
    const lat = e.latLng.lat()
    const lng = e.latLng.lng()
    setMarkerPos({ lat, lng })
    reverseGeocode(lat, lng)
  }, [reverseGeocode])

  /* ── Open map modal ── */
  const openMap = () => {
    setShowMap(true)
    setMapAddress('')
    // If we already have coordinates from a previous selection, use them
    reverseGeocode(markerPos.lat, markerPos.lng)
  }

  /* ── Confirm map selection ── */
  const confirmMapSelection = () => {
    const details: PlaceDetails = {
      lat: markerPos.lat,
      lng: markerPos.lng,
      formatted_address: mapAddress,
    }
    onChange(mapAddress, details)
    setSelectedAddress(mapAddress)
    setShowMap(false)
  }

  /* ── Geolocation ── */
  const goToCurrentLocation = () => {
    if (!navigator.geolocation) return
    setIsGeolocating(true)
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude
        const lng = pos.coords.longitude
        setMarkerPos({ lat, lng })
        if (mapRef.current) {
          mapRef.current.panTo({ lat, lng })
          mapRef.current.setZoom(15)
        }
        reverseGeocode(lat, lng)
        setIsGeolocating(false)
      },
      () => {
        setIsGeolocating(false)
      },
      { enableHighAccuracy: true, timeout: 8000 }
    )
  }

  /* ── Clear selection ── */
  const clearSelection = () => {
    onChange('', undefined)
    setSelectedAddress('')
  }

  /* ── Fallback: plain input (no API key or not loaded) ── */
  if (!hasApiKey) {
    return (
      <div>
        <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#C6A75E', marginBottom: 8 }}>
          {label}
        </label>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          style={inputStyle}
          onFocus={onFocus}
          onBlur={onBlur}
        />
      </div>
    )
  }

  if (!isLoaded) {
    return (
      <div>
        <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#C6A75E', marginBottom: 8 }}>
          {label}
        </label>
        <div style={{ ...inputStyle, display: 'flex', alignItems: 'center', gap: 8, color: '#9CA3AF' }}>
          <div style={{ width: 16, height: 16, border: '2px solid #C6A75E', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
          กำลังโหลดแผนที่...
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    )
  }

  return (
    <div>
      <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#C6A75E', marginBottom: 8 }}>
        {label}
      </label>

      {/* ── Autocomplete Input ── */}
      <Autocomplete
        onLoad={onAutocompleteLoad}
        onPlaceChanged={onPlaceChanged}
        options={{
          componentRestrictions: { country },
          types: ['establishment', 'geocode'],
        }}
      >
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          style={inputStyle}
          onFocus={onFocus}
          onBlur={onBlur}
        />
      </Autocomplete>

      {/* ── Selected address display ── */}
      {selectedAddress && value && (
        <div style={{
          marginTop: 8,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          background: 'rgba(198,167,94,0.1)',
          border: '1px solid rgba(198,167,94,0.3)',
          borderRadius: 8,
          padding: '8px 12px',
          fontSize: 13,
          color: '#FFFFFF',
        }}>
          <span style={{ fontSize: 14 }}>📍</span>
          <span style={{ flex: 1, lineHeight: 1.4 }}>{selectedAddress}</span>
          <button
            type="button"
            onClick={clearSelection}
            style={{
              background: 'none', border: 'none', color: '#9CA3AF',
              cursor: 'pointer', fontSize: 16, padding: '0 2px', flexShrink: 0,
            }}
          >
            ✕
          </button>
        </div>
      )}

      {/* ── "เลือกจากแผนที่" button ── */}
      <button
        type="button"
        onClick={openMap}
        style={{
          marginTop: 8,
          width: '100%',
          padding: '10px 16px',
          background: 'transparent',
          border: '1px dashed rgba(198,167,94,0.5)',
          borderRadius: 12,
          color: '#C6A75E',
          fontSize: 13,
          fontWeight: 600,
          cursor: 'pointer',
          transition: 'background 0.2s',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 6,
        }}
        onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(198,167,94,0.1)' }}
        onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
      >
        📍 เลือกจากแผนที่
      </button>

      {/* ═══ Map Modal ═══ */}
      {showMap && (
        <div
          style={{
            position: 'fixed', inset: 0,
            background: 'rgba(0,0,0,0.7)',
            zIndex: 10000,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: 16,
          }}
          onClick={(e) => { if (e.target === e.currentTarget) setShowMap(false) }}
        >
          <div style={{
            background: '#12263A',
            borderRadius: 20,
            border: '1px solid rgba(198,167,94,0.3)',
            width: '100%', maxWidth: 600,
            maxHeight: 'calc(100vh - 32px)',
            display: 'flex', flexDirection: 'column',
            overflow: 'hidden',
          }}>
            {/* Header */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '16px 20px',
              borderBottom: '1px solid rgba(198,167,94,0.15)',
            }}>
              <h4 style={{ fontFamily: "'Playfair Display', serif", fontSize: 17, fontWeight: 700, color: '#FFFFFF', margin: 0 }}>
                📍 เลือกตำแหน่งบนแผนที่
              </h4>
              <button
                type="button"
                onClick={() => setShowMap(false)}
                style={{
                  background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '50%',
                  width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#9CA3AF', fontSize: 16, cursor: 'pointer',
                }}
              >
                ✕
              </button>
            </div>

            {/* Map */}
            <div style={{ position: 'relative', flex: 1, minHeight: 350 }}>
              <GoogleMap
                onLoad={onMapLoad}
                center={markerPos}
                zoom={12}
                mapContainerStyle={{ width: '100%', height: '100%', minHeight: 350 }}
                options={{
                  styles: DARK_MAP_STYLE,
                  disableDefaultUI: true,
                  zoomControl: true,
                  zoomControlOptions: { position: typeof google !== 'undefined' ? google.maps.ControlPosition.LEFT_BOTTOM : undefined },
                  gestureHandling: 'greedy',
                }}
              >
                <Marker
                  position={markerPos}
                  draggable
                  onDragEnd={onMarkerDragEnd}
                />
              </GoogleMap>

              {/* Current location button */}
              <button
                type="button"
                onClick={goToCurrentLocation}
                disabled={isGeolocating}
                style={{
                  position: 'absolute', top: 12, right: 12, zIndex: 1,
                  background: '#12263A',
                  border: '1px solid rgba(198,167,94,0.3)',
                  borderRadius: 10, padding: '8px 14px',
                  color: '#C6A75E', fontSize: 13, fontWeight: 600,
                  cursor: isGeolocating ? 'wait' : 'pointer',
                  display: 'flex', alignItems: 'center', gap: 6,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
                }}
              >
                {isGeolocating ? (
                  <>
                    <div style={{ width: 14, height: 14, border: '2px solid #C6A75E', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                    กำลังค้นหา...
                  </>
                ) : (
                  <>📍 ตำแหน่งปัจจุบัน</>
                )}
              </button>
            </div>

            {/* Footer: address + confirm button */}
            <div style={{ padding: '16px 20px', borderTop: '1px solid rgba(198,167,94,0.15)' }}>
              {mapAddress && (
                <div style={{
                  marginBottom: 12, padding: '10px 14px',
                  background: 'rgba(198,167,94,0.08)',
                  border: '1px solid rgba(198,167,94,0.15)',
                  borderRadius: 10, fontSize: 13, color: '#F5F5F5', lineHeight: 1.5,
                }}>
                  📍 {mapAddress}
                </div>
              )}
              <button
                type="button"
                onClick={confirmMapSelection}
                disabled={!mapAddress}
                style={{
                  width: '100%', padding: '14px 24px',
                  background: mapAddress ? 'linear-gradient(135deg, #B9973E, #E5C97A)' : 'rgba(198,167,94,0.2)',
                  border: 'none', borderRadius: 12,
                  color: mapAddress ? '#0B1C2D' : '#9CA3AF',
                  fontSize: 15, fontWeight: 700, cursor: mapAddress ? 'pointer' : 'not-allowed',
                  boxShadow: mapAddress ? '0 4px 16px rgba(198,167,94,0.3)' : 'none',
                }}
              >
                ✅ ยืนยันตำแหน่ง
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
