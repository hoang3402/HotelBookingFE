export interface Result {
  count: number
  next: string
  previous: string
  results: any[]
}

export interface User {
  id: number
  first_name: string
  last_name: string
  email: string
  phone_number: string
  role: string
}

export interface Country {
  code: string
  name: string
  currency: string
}


export interface Province {
  id: number
  slug: string
  name: string
  country: Country
}


export interface City {
  code: string
  name: string
  province: Province
}


export interface RoomType {
  id: number
  name: string
}


export interface HotelData {
  id: number
  name: string
  phone_number: string
  average_rating: number
  email: string
  image: string
  province: Province
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
  province: Province
  features: {
    description: string
  }[]
  room_set: RoomData[]
}


export interface BookingData {
  id: number
  hotel: string
  room: string
  check_in_date: string
  check_out_date: string
  total_price_usd: string
  status: string
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


export interface RoomData {
  id: number
  name: string
  description: string
  adults: number
  children: number
  price: string
  image: string
  is_available: boolean
  room_type: RoomType
  hotel: HotelData
}