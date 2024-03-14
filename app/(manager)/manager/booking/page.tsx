'use client';

import Container from "@/app/components/Container";
import MyTable, {BookingData} from "@/app/components/MyTable";
import React, {useEffect, useState} from "react";
import {domain} from "@/app/actions/getRoomById";
import useAuthHeader from "react-auth-kit/hooks/useAuthHeader";
import Loader from "@/app/components/Loader";
import {FormattedPrice} from "@/app/components/Ultility";
import NextAuth from "@auth-kit/next";

const columns = [
  {
    key: "id",
    label: "Booking ID",
  },
  {
    key: "hotel",
    label: "Hotel",
  },
  {
    key: "room",
    label: "Room",
  },
  {
    key: "check_in_date",
    label: "Check in",
  },
  {
    key: "check_out_date",
    label: "Check out",
  },
  {
    key: "total_price_usd",
    label: "Price",
  },
  {
    key: "status",
    label: "Status",
  },
  {
    key: "action",
    label: "Action",
  },
]

const StaffBookingPage = () => {
  const token = useAuthHeader()
  const [data, setData] = useState<BookingData[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetch(`${domain}api/staff/booking/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `${token}`
      },
      cache: 'reload'
    }).then(res => res.json())
      .then(res => {
        let _date: BookingData[] = []
        res.forEach((item: any) => {
            _date.push({
              id: item.id,
              hotel: `${item.hotel.id} - ${item.hotel.name}`,
              room: `${item.room.id} - ${item.room.name}`,
              check_in_date: item.check_in_date,
              check_out_date: item.check_out_date,
              total_price_usd: FormattedPrice(item.total_price_usd, 'USD'),
              status: item.status
            })
          }
        )
        setData(_date)
        setIsLoading(false);
        console.log(data)
      })
      .catch(error => console.error("Error fetching data:", error));
  }, [])


  return (
    <NextAuth fallbackPath={'/'}>
      <Container>
        <div className={'flex flex-col gap-4 mt-4'}>
          <h1 className={'text-3xl font-bold'}>Booking</h1>
          <div>
            {isLoading ? (
              <Loader/>
            ) : (
              <MyTable title={'Booking'} columns={columns} rows={data}/>
            )}
          </div>
        </div>
      </Container>
    </NextAuth>
  )
}

export default StaffBookingPage;