'use client';

import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';

import React, {useEffect, useState} from "react";
import useAuthHeader from "react-auth-kit/hooks/useAuthHeader";
import Loader from "@/app/components/Loader";
import {FormattedDate, FormattedPrice} from "@/app/components/Ultility";
import Button from "@/app/components/Button";
import {DateRange} from "react-date-range";
import Container from "@/app/components/Container";
import {useRouter} from "next/navigation";
import {BookingDataDetails} from "@/app/type";
import {getBookingById} from "@/app/actions/staff/getBookings";

interface IParams {
  id?: string;
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
    if (id && token) {
      setIsLoading(true)
      getBookingById(id, token).then((res) => {
        setData(res)
        setSelectedRange({
          startDate: new Date(res.check_in_date),
          endDate: new Date(res.check_out_date),
          key: 'selection'
        })
        setIsLoading(false)
      })
    }
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
                <div className={'w-2/3 flex gap-4 overflow-hidden'}>
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