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
import {toast} from "react-hot-toast";
import {useRouter} from 'next/navigation';
import {Card} from "@nextui-org/card";
import {Tab, Tabs} from "@nextui-org/tabs";
import {Textarea} from "@nextui-org/input";
import ReactStars from 'react-stars'

interface IParams {
  id?: string;
}

const BookingDetailPage = ({params}: { params: IParams }) => {

  const token = useAuthHeader()
  const route = useRouter()
  const [selected, setSelected] = React.useState("detail");
  const [review, setReview] = useState("");
  const [star, setStar] = useState(4);
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

  function handleBack() {
    route.back()
  }

  function handleCreateReview() {
    fetch(`${domain}api/comment/create/`,{
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `${token}`
      },
      body: JSON.stringify({
        "rating": star,
        "title": `${params.id} - ${data.hotel.name} - ${data.room.name}`,
        "comment": review,
        "booking": params.id
      })
    }).then(() => {
      toast.success("Create review success!")
      route.back()
    })
  }

  return (
    <NextAuth fallbackPath={'/'}>
      {isLoading ? <Loader/> : (
        <Container>
          <div className={'flex flex-col gap-4'}>
            <h1 className={'text-2xl'}>{data.hotel.name} - {data.room.name}</h1>

            <div className={'flex gap-5'}>
              <div className={'flex w-1/2 flex-col gap-10'}>
                <Tabs className={'flex justify-center'}
                      selectedKey={selected}
                      onSelectionChange={(key: any) => setSelected(key)}
                >
                  <Tab key={'detail'} title={'Detail'}>
                    <Card className={'p-4 text-xl'}>
                      <p>Price: {FormattedPrice(data.total_price_usd, 'USD')}</p>
                      <p>Status: {data.status}</p>
                      <p>Check in: {FormattedDate(data.check_in_date)}</p>
                      <p>Check out: {FormattedDate(data.check_out_date)}</p>
                      <p>Sleeps: {data.room.adults} adults {data.room.children ? `and ${data.room.children} children` : ""}</p>
                      <p>Phone number: {data.hotel.phone_number}</p>
                      <p>Email: {data.hotel.email}</p>
                      <p>Created at: {FormattedDate(data.created_at)}</p>
                    </Card>
                  </Tab>
                  <Tab key={'Reviews'} title={'Reviews'}>
                    <Card className={'p-4 text-xl'}>
                      <ReactStars
                        count={5}
                        value={star}
                        onChange={setStar}
                        size={24}
                        color2={'#ffd700'} />
                      <Textarea value={review} onValueChange={setReview} label={'Leave a review'}/>
                    </Card>
                  </Tab>
                </Tabs>

                <div className={'flex gap-5'}>
                  {selected === 'detail' ?
                    <Button label={'Cancel'} onClick={handleCancel}/> :
                    <Button label={'Send review'} onClick={handleCreateReview}/>}
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
        </Container>)}
    </NextAuth>
  )
}

export default BookingDetailPage

