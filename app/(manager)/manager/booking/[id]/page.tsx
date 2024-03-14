'use client';

import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';

import React, {useEffect, useState} from "react";
import {domain} from "@/app/actions/getRoomById";
import useAuthHeader from "react-auth-kit/hooks/useAuthHeader";
import {toast} from "react-hot-toast";
import Loader from "@/app/components/Loader";
import {FormattedDate, FormattedPrice} from "@/app/components/Ultility";
import Button from "@/app/components/Button";
import {DateRange} from "react-date-range";
import Container from "@/app/components/Container";
import {useRouter} from "next/navigation";

interface IParams {
  id?: string;
}

interface BookingDataDetails {
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

const StaffBookingDetailPage = ({params}: { params: IParams }) => {

  let id = params.id
  const token = useAuthHeader()
  const route = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [data, setData] = useState<BookingDataDetails>({} as BookingDataDetails)
  const [selectedRange, setSelectedRange] = useState({
    startDate: new Date(),
    endDate: new Date(),
    key: 'selection'
  });

  const handleBack = () => {
    route.back()
  }

  const handleDone = () => {

  }

  useEffect(() => {

    fetch(`${domain}api/staff/booking/${id}/`, {
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
      .catch(err => {
        console.log(err)
        toast.error(err)
      })
      .finally(() => {
        setIsLoading(false)
      })

  }, [])

  return (
    <div>
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
                  <p>Created at: {FormattedDate(data.created_at)}</p>
                </div>
                <div className={'w-[400px] flex gap-4'}>
                  <Button label={'Done'} onClick={handleDone}/>
                  <Button label={'Back'} onClick={handleBack}/>
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
        </Container>
      )}
    </div>
  )
}

export default StaffBookingDetailPage