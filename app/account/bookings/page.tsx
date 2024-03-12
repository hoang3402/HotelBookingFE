'use client';

import Container from "@/app/components/Container";
import {useEffect, useState} from "react";
import NextAuth from "@auth-kit/next";
import {domain} from "@/app/actions/getRoomById";
import useAuthHeader from "react-auth-kit/hooks/useAuthHeader";
import Loader from "@/app/components/Loader";
import Image from "next/image";
import FormattedPrice from "@/app/components/currency";
import {useRouter} from "next/navigation";

export default function Page() {
  const token = useAuthHeader()
  const [isLoading, setIsLoading] = useState(true)
  const [bookings, setBookings] = useState([])
  const route = useRouter()

  useEffect(() => {
    fetch(`${domain}api/booking/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `${token}`
      }
    }).then(res => res.json())
      .then(data => {
        setBookings(data)
        setIsLoading(false)
      })
  }, [])

  return (
    <NextAuth fallbackPath={'/'}>
      {isLoading ? <Loader/> : (
        <Container>
          <div className="max-w-screen-lg mx-auto">
            <h1>You have {bookings.length} booking</h1>

            <div className={'grid grid-cols-1 md:grid-cols-2 gap-4'}>
              {bookings.map((booking: any) => (
                <div key={booking.id} className={'w-full flex gap-4 border rounded-2xl p-4 hover:shadow-md transition'}>
                  <div className={'w-4/5 cursor-pointer'}
                       onClick={() => {
                         route.push('/hotel/' + booking.hotel.id)
                       }}>
                    <Image
                      className={'w-full object-cover rounded-2xl'}
                      src={booking.hotel.image}
                      alt={booking.hotel.name}
                      width={200} height={200}
                    />
                  </div>
                  <div className={'w-full'}>
                    <h1 className={'truncate'}>{booking.hotel.name}: {booking.room.name}</h1>
                    <p>Price: {FormattedPrice(booking.total_price, booking.currency)}</p>
                    <p>Status: {booking.status}</p>
                    <p>Check in: {booking.check_in_date}</p>
                    <p>Check out: {booking.check_out_date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Container>
      )}
    </NextAuth>
  )
}