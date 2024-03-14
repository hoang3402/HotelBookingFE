export interface BookingDataDetails {
  id: number
  hotel: {
    id: number
    name: string
    image: string
  }
  room: {
    id: number
    name: string
    adults: number
    children: number
  }
  check_in_date: string
  check_out_date: string
  total_price: string
  created_at: string
  updated_at: string
  status: string
  currency: string
  total_price_usd: string
}
