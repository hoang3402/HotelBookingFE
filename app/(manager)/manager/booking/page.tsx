'use client';

import Container from "@/app/components/Container";
import MyTable from "@/app/components/MyTable";
import React, {useEffect, useState} from "react";
import {domain} from "@/app/actions/getRoomById";
import useAuthHeader from "react-auth-kit/hooks/useAuthHeader";
import Loader from "@/app/components/Loader";
import {FormattedPrice} from "@/app/components/Ultility";
import NextAuth from "@auth-kit/next";
import {BookingData, BookingDataDetails} from "@/app/type";
import {toast} from "react-hot-toast";
import Link from "next/link";
import {Tooltip} from "@nextui-org/tooltip";
import {EyeIcon} from "@nextui-org/shared-icons";
import {MdOutlineDone} from "react-icons/md";
import {HiMiniXMark} from "react-icons/hi2";
import {useRouter} from "next/navigation";

const columns = [
  {
    key: "id",
    label: "ID",
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

const action = (handleDetail: any, handleConfirmed: any, handleCancel: any) => {
  return (
    <div className="relative flex items-center gap-2">
      <Tooltip content="Details">
        <span
          className="text-lg text-default-400 cursor-pointer active:opacity-50"
          onClick={handleDetail}
        >
          <EyeIcon/>
        </span>
      </Tooltip>
      <Tooltip content="Comfirm">
        <span
          className="text-lg text-default-400 cursor-pointer active:opacity-50"
          onClick={handleConfirmed}
        >
          <MdOutlineDone color={"green"}/>
        </span>
      </Tooltip>
      <Tooltip content="Cancel">
        <span
          className="text-lg text-default-400 cursor-pointer active:opacity-50"
          onClick={handleCancel}
        >
          <HiMiniXMark color={"red"}/>
        </span>
      </Tooltip>
    </div>
  )
}

const StaffBookingPage = () => {
  const token = useAuthHeader()
  const route = useRouter()
  const [data, setData] = useState<BookingData[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const handleDetail = (id: number) => {
    route.push(`/manager/booking/${id}`)
  }

  const handleConfirmed = (id: number) => {
    fetch(`${domain}api/staff/booking/${id}/edit/`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `${token}`
      },
      body: JSON.stringify({
        status: "Confirmed"
      })
    })
      .then(res => res.json())
      .then(res => {
        if (res.status === "success") {
          toast.success(res.message)
        }
      })
      .catch(error => {
        console.error("Error fetching data:", error);
        toast.error("Error: ", error)
      })
  }

  const handleCancel = (id: number) => {
    fetch(`${domain}api/staff/booking/${id}/edit/`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `${token}`
      },
      body: JSON.stringify({
        status: "Cancelled"
      })
    })
      .then(res => res.json())
      .then(res => {
        if (res.status === "success") {
          toast.success(res.message)
        }
      })
      .catch(error => {
        console.error("Error fetching data:", error);
        toast.error("Error: ", error)
      })
  }

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
        res.forEach((item: BookingDataDetails) => {
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
  }, [handleConfirmed, handleCancel])


  const renderCell = React.useCallback((data: BookingData, columnKey: React.Key) => {
    const cellValue = data[columnKey as keyof BookingData];
    switch (columnKey) {
      case 'hotel':
        return (
          <Link href={`/hotel/${data.id}`}>{cellValue}</Link>
        )
      case 'action':
        return action(() => handleDetail(data.id), () => handleConfirmed(data.id), () => handleCancel(data.id));
      default:
        return cellValue
    }
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
              <MyTable title={'Booking'} columns={columns} rows={data} renderCell={renderCell}/>
            )}
          </div>
        </div>
      </Container>
    </NextAuth>
  )
}

export default StaffBookingPage;