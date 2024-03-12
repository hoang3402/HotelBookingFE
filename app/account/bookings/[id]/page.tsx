'use client';

import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';

import Container from "@/app/components/Container";
import {domain} from "@/app/actions/getRoomById";
import React, {useEffect, useState} from "react";
import useAuthHeader from "react-auth-kit/hooks/useAuthHeader";
import Loader from "@/app/components/Loader";
import NextAuth from "@auth-kit/next";
import {DateRange} from "react-date-range";
import {FormattedDate, FormattedPrice} from "@/app/components/Ultility";
import Button from "@/app/components/Button";
import {Toast} from "next/dist/client/components/react-dev-overlay/internal/components/Toast";
import {toast} from "react-hot-toast";

interface IParams {
  id?: string;
}

const BookingDetailPage = ({params}: { params: IParams }) => {

  const token = useAuthHeader()
  const [isLoading, setIsLoading] = useState(true)
  const [data, setData] = useState<any>({})
  const [selectedRange, setSelectedRange] = useState({
    startDate: new Date(),
    endDate: new Date(),
    key: 'selection'
  });

  useEffect(() => {
    fetch(`${domain}api/booking/${params.id}/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `${token}`
      }
    }).then(res => res.json())
      .then(data => {
        setData(data)
        setSelectedRange({
          startDate: new Date(data.check_in_date),
          endDate: new Date(data.check_out_date),
          key: 'selection'
        })
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, []);

  function handleCancel() {
    fetch(`${domain}api/booking/cancel/${params.id}/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `${token}`
      },
    }).then(() => {
      setData((prevData: any) => ({...prevData, status: 'Cancelled'}));
      toast.success("Cancel booking success!")
    }).catch(error => {
      toast.error(error.detail)
    })
  }

  return (
    <NextAuth fallbackPath={'/'}>
      {isLoading ? <Loader/> : (
        <Container>
          <div className={'flex flex-col gap-4'}>
            <h1 className={'text-2xl'}>{data.hotel.name} - {data.room.name}</h1>

            <div className={'flex'}>
              <div className={'flex w-1/2 flex-col gap-10'}>
                <div className={'text-xl'}>
                  <p>Price: {FormattedPrice(data.total_price_usd, 'USD')}</p>
                  <p>Status: {data.status}</p>
                  <p>Check in: {FormattedDate(data.check_in_date)}</p>
                  <p>Check out: {FormattedDate(data.check_out_date)}</p>
                  <p>Sleeps: {data.room.adults} adults {data.room.children ? `and ${data.room.children} children` : ""}</p>
                  <p>Phone number: {data.hotel.phone_number}</p>
                  <p>Email: {data.hotel.email}</p>
                  <p>Created at: {FormattedDate(data.created_at)}</p>
                </div>
                <div className={'w-[200px]'}>
                  <Button label={'Cancel'} onClick={handleCancel}/>
                </div>
              </div>
              <div className={'w-1/2 border-2'}>
                <DateRange
                  rangeColors={['#262626']}
                  ranges={[selectedRange]}
                  date={new Date()}
                  onChange={() => {
                  }}
                  direction="vertical"
                  showDateDisplay={false}
                />
              </div>
            </div>
          </div>
        </Container>)}
    </NextAuth>
  )
}

export default BookingDetailPage

