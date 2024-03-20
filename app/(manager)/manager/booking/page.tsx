'use client';

import Container from "@/app/components/Container";
import MyTable from "@/app/components/MyTable";
import React, {useEffect, useState} from "react";
import {domain} from "@/app/actions/getRoomById";
import useAuthHeader from "react-auth-kit/hooks/useAuthHeader";
import Loader from "@/app/components/Loader";
import NextAuth from "@auth-kit/next";
import {BookingData, BookingDataDetails, Result} from "@/app/type";
import {toast} from "react-hot-toast";
import Link from "next/link";
import {Tooltip} from "@nextui-org/tooltip";
import {EyeIcon} from "@nextui-org/shared-icons";
import {MdOutlineDone} from "react-icons/md";
import {HiMiniXMark} from "react-icons/hi2";
import {useRouter} from "next/navigation";
import {SortDescriptor} from "@nextui-org/table";
import {getBookings} from "@/app/actions/staff/getBookings";
import {Pagination} from "@nextui-org/pagination";
import {FormattedPrice} from "@/app/components/Ultility";

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
  const [isLoading, setIsLoading] = useState(true)
  const [reload, setReload] = useState(0)
  const [data, setData] = useState<any[]>([])
  const [page, setPage] = React.useState(1);
  const [pages, setPages] = React.useState(1);
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: 'id',
    direction: 'descending'
  })


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
      .finally(() => setReload(reload + 1))
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
      .finally(() => setReload(reload + 1))
  }


  useEffect(() => {
    if (token) {
      getBookings(token, page, 10).then((res: any) => {
        let _data: BookingData[] = []
        res.results.forEach((item: BookingDataDetails) => {
            _data.push({
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
        setData(_data)
        setPages(Math.ceil(res.count / res.results.length))
        setIsLoading(false)
      })
    }
  }, [reload, page])


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
              <MyTable
                title={'Booking'}
                columns={columns}
                rows={data}
                renderCell={renderCell}
                sortDescriptor={sortDescriptor}
                setSortDescriptor={setSortDescriptor}
                bottomContent={
                  <div className="flex w-full justify-center">
                    <Pagination
                      isCompact
                      showControls
                      showShadow
                      color="secondary"
                      page={page}
                      total={pages}
                      onChange={(page) => setPage(page)}
                    />
                  </div>
                }
              />
            )}
          </div>
        </div>
      </Container>
    </NextAuth>
  )
}

export default StaffBookingPage;