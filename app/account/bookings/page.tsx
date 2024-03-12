'use client';

import Container from "@/app/components/Container";
import {useEffect, useState} from "react";
import NextAuth from "@auth-kit/next";
import {domain} from "@/app/actions/getRoomById";
import useAuthHeader from "react-auth-kit/hooks/useAuthHeader";
import Loader from "@/app/components/Loader";

export default function Page() {
  const token = useAuthHeader()
  const [isLoading, setIsLoading] = useState(true)
  const [bookings, setBookings] = useState([])

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
                <div key={booking.id} className={'border rounded-2xl p-4 hover:shadow-md transition'}>
                  <h1>{booking.room}</h1>
                  <p>{booking.price}</p>
                  <p>{booking.status}</p>
                  <p>{booking.check_in_date}</p>
                  <p>{booking.check_out_date}</p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      )}
    </NextAuth>
  )
}