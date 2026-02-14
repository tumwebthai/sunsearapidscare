export interface Booking {
  id: string
  reference_number: string
  service_type: string
  pickup_location: string
  dropoff_location: string
  airport: string
  direction: string
  travel_date: string
  travel_time: string
  num_days: number
  passengers: number
  luggage: number
  vehicle_slug: string
  vehicle_name: string
  estimated_price: number
  customer_name: string
  customer_email: string
  customer_phone: string
  country_code: string
  preferred_contact: string
  line_id: string
  flight_number: string
  hotel_name: string
  special_notes: string
  status: string
  payment_status: string
  created_at: string
  updated_at: string
}

export type BookingInsert = Omit<Booking, 'id' | 'created_at' | 'updated_at'>
