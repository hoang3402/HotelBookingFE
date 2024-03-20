"use client";

import Modal from "@/app/components/modals/Modal";
import useRoomModal from "@/app/hooks/useRoomModal";
import React, {useEffect, useState} from "react";
import {DateRange} from "react-date-range";
import {domain} from "@/app/actions/getRoomById";
import {toast} from "react-hot-toast";
import {eachDayOfInterval, endOfMonth, startOfMonth} from "date-fns";
import useAuthHeader from "react-auth-kit/hooks/useAuthHeader";
import {FormattedPrice} from "@/app/components/Ultility";
import {useRouter} from "next/navigation";

const RoomModal = () => {

  let roomModal = useRoomModal((state) => state)
  const route = useRouter()
  const token = useAuthHeader()
  const [roomData, setRoomData] = useState<any>(null)
  const [selectedRange, setSelectedRange] = useState({
    startDate: new Date(),
    endDate: new Date(),
    key: 'selection'
  });
  const [totalPrice, setTotalPrice] = useState("")

  const [disabledDates, setDisabledDates] = useState<any>([])

  useEffect(() => {
    if (!roomModal.isOpen || !roomModal.roomId || roomModal.roomId === roomData?.id) {
      return
    }

    if (roomModal.roomId !== roomData?.id) {
      setDisabledDates([])
      setTotalPrice("")
    }

    fetch(`${domain}api/days-available/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        "room_id": roomModal.roomId,
        "year": selectedRange.startDate.getFullYear(),
        "month": selectedRange.startDate.getMonth() + 1
      })
    }).then(res => res.json())
      .then(data => {
        let daysAvailable = data.days
        const startOfMonthDate = startOfMonth(selectedRange.startDate);
        const endOfMonthDate = endOfMonth(selectedRange.startDate);

        const days = eachDayOfInterval({
          start: startOfMonthDate,
          end: endOfMonthDate
        })

        days.forEach((day: any) => {
          if (!daysAvailable.includes(day.toISOString().split('T')[0])) {
            setDisabledDates((prev: any) => [...prev, day])
          }
        })
      })
      .catch(error => console.log(error))

  }, [roomModal.isOpen, selectedRange])

  const handleSelect = (ranges: any) => {
    // Update the state with the new range
    setSelectedRange(ranges.selection);
  };

  useEffect(() => {
    if (!roomModal.isOpen || !roomModal.roomId) {
      return
    }

    console.log(`Start loading room modal ${roomModal.roomId}`)

    fetch(`${domain}api/room/${roomModal.roomId}/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => res.json())
      .then((data) => {
        setRoomData(data)
      })
      .catch((error) => {
        console.log(error)
      })
  }, [roomModal.isOpen]);

  useEffect(() => {
    if (!selectedRange.startDate || !selectedRange.endDate || !roomModal.roomId) {
      setTotalPrice("")
      return
    }

    fetch(`${domain}api/booking/price/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        "check_in_date": selectedRange.startDate.toISOString().split('T')[0],
        "check_out_date": selectedRange.endDate.toISOString().split('T')[0],
        "room_id": roomModal.roomId,
        "currency": "USD"
      })
    }).then(res => res.json())
      .then(data => {
        setTotalPrice(FormattedPrice(data.price, "USD"))
      })
  }, [selectedRange])

  const bodyContent = (
    <div className="flex flex-col gap-4">
      <div className={'flex flex-col'}>
        <h2 className={'text-xl'}>{roomData?.description}</h2>
        <span>Room type: {roomData?.room_type?.name}</span>
        <span>Sleeps: {roomData?.adults} adults {roomData?.children ? `and ${roomData?.children} children` : ""}</span>
      </div>

      <DateRange
        rangeColors={['#262626']}
        ranges={[selectedRange]}
        date={selectedRange.startDate}
        onChange={handleSelect}
        direction="vertical"
        showDateDisplay={false}
        minDate={new Date()}
        disabledDates={disabledDates}
      />
      <hr/>
      <div className={'flex justify-center text-3xl font-bold'}>
        {totalPrice ? <p>Total price: {totalPrice}</p> : <p>Please select a date</p>}
      </div>
    </div>
  )


  const handelSubmit = () => {

    fetch(`${domain}api/booking/create/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": token ?? ''
      },
      body: JSON.stringify({
        "room_id": roomData.id,
        "check_in_date": selectedRange.startDate.toISOString().split('T')[0],
        "check_out_date": selectedRange.endDate.toISOString().split('T')[0],
        "currency": roomData.hotel.province.country.currency
      })
    }).then((res) => res.json())
      .then((data) => {
        console.log(data)
        toast.success("Booking success")
        goToPayment(data)
      })
      .catch((error) => {
        console.log(error)
        toast.error("Booking failed")
      })
      .finally(() => {
        roomModal.onClose()
      })
  }


  const goToPayment = (data: any) => {

    let amount = 0

    fetch(`${domain}api/exchange_rate/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        "amount": data.total_price_usd,
        "from_currency": "USD",
        "to_currency": "VND" // VNPay only support VND
      })
    }).then((res) => res.json())
      .then((data) => {
        amount = data.price
        fetch(`${domain}api/vnpay/payment_url/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": token ?? ''
          },
          body: JSON.stringify({
            "amount": amount,
          })
        }).then((res) => res.json())
          .then((data) => {
            window.location.href = data.payment_url
          })
      })
  }


  return (
    <Modal
      disabled={totalPrice === "" || totalPrice === "$0"}
      isOpen={roomModal.isOpen}
      title={roomData ? roomData.name : "Loading..."}
      actionLabel="Book"
      onClose={roomModal.onClose}
      body={bodyContent}
      onSubmit={handelSubmit}/>
  )
}

export default RoomModal;