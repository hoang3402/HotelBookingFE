'use client';

import Container from "@/app/components/Container";
import {useEffect, useState} from "react";
import NextAuth from "@auth-kit/next";
import {domain} from "@/app/actions/getRoomById";
import useAuthHeader from "react-auth-kit/hooks/useAuthHeader";
import Loader from "@/app/components/Loader";
import {useRouter} from "next/navigation";
import {Tab, Tabs} from "@nextui-org/tabs";
import Image from 'next/image'
import Button from "@/app/components/Button";
import {FormattedDate, FormattedPrice} from "@/app/components/Ultility";

export default function Page() {
  const token = useAuthHeader()
  const [isLoading, setIsLoading] = useState(true)
  const [bookings, setBookings] = useState([])
  const route = useRouter()
  const [activeTab, setActiveTab] = useState('upcoming');
  const handleTabChange = (newTabKey: any) => setActiveTab(newTabKey);
  const filteredBookings = (status: any) =>
    bookings.filter((booking: any) => booking.status === status);

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
            <br/>
            <div>
              <Tabs onSelect={handleTabChange}>
                <Tab key="upcoming" title="Upcoming">
                  <div className={'grid grid-cols-1 md:grid-cols-2 gap-4'}>
                    {filteredBookings('Pending').map((booking: any) => (
                      <BookingCard key={booking.id} booking={booking} route={route}/>
                    ))}
                  </div>
                </Tab>
                <Tab key="confirmed" title="Confirmed">
                  <div className={'grid grid-cols-1 md:grid-cols-2 gap-4'}>
                    {filteredBookings('Confirmed').map((booking: any) => (
                      <BookingCard key={booking.id} booking={booking} route={route}/>
                    ))}
                  </div>
                </Tab>
                <Tab key="cancelled" title="Cancelled">
                  <div className={'grid grid-cols-1 md:grid-cols-2 gap-4'}>
                    {filteredBookings('Cancelled').map((booking: any) => (
                      <BookingCard key={booking.id} booking={booking} route={route}/>
                    ))}
                  </div>
                </Tab>
              </Tabs>
            </div>
          </div>
        </Container>
      )}
    </NextAuth>
  )
}

const BookingCard = ({booking, route}: any) => {
  return (
    <div className={'w-full flex gap-4 border rounded-2xl p-4 hover:shadow-md transition'}>
      <div key={booking.id} className={'w-4/5 h-full cursor-pointer'}
           onClick={() => {
             route.push('/hotel/' + booking.hotel.id)
           }}>
        <Image
          className={'size-full object-cover rounded-2xl hover:scale-105 transition'}
          src={booking.hotel.image}
          alt={booking.hotel.name}
          width={200} height={200}
        />
      </div>
      <div className={'w-full overflow-hidden'}>
        <h1 className={'truncate text-xl'}>{booking.hotel.name}: {booking.room.name}</h1>
        <p>Price: {FormattedPrice(booking.total_price_usd, 'USD')}</p>
        <p>Status: {booking.status}</p>
        <p>Check in: {FormattedDate(booking.check_in_date)}</p>
        <p>Check out: {FormattedDate(booking.check_out_date)}</p>
        <div>
          <Button
            onClick={() => {
              route.push('/account/bookings/' + booking.id)
            }}
            label={'Details'}
          />
        </div>
      </div>
    </div>
  )
};