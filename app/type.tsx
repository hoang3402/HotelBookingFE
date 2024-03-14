
export interface HotelData {
  id: number
  name: string
  phone_number: string
  average_rating: number
  email: string
  image: string
  province: {
    id: number
    slug: string
    name: string
    country: {
      code: string
      name: string
      currency: string
    }
  }
}

export interface HotelDataDetails {
  id: number
  name: string
  address: string
  description: string
  phone_number: string
  average_rating: number
  email: string
  image: string
  province: {
    id: number
    slug: string
    name: string
    country: {
      code: string
      name: string
      currency: string
    }
  }
  features: {
    description: string
  }[]
  room_set: {
    id: number
    name: string
    description: string
    price: string
    image: string
    is_available: boolean
    room_type: {
      id: number
      name: string
    }
  }[]
}

export interface BookingDataDetails {
  id: number
  check_in_date: string
  check_out_date: string
  total_price: string
  created_at: string
  updated_at: string
  status: string
  currency: string
  total_price_usd: string
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
}
