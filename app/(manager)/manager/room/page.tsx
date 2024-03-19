"use client";

import {Tooltip} from "@nextui-org/tooltip";
import {EyeIcon} from "@nextui-org/shared-icons";
import {HiMiniXMark} from "react-icons/hi2";
import React, {useEffect, useState} from "react";
import NextAuth from "@auth-kit/next";
import Container from "@/app/components/Container";
import Button from "@/app/components/Button";
import Loader from "@/app/components/Loader";
import MyTable from "@/app/components/MyTable";
import {Pagination} from "@nextui-org/pagination";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";
import {HotelData, Result, User} from "@/app/type";
import {useRouter} from "next/navigation";
import {SortDescriptor} from "@nextui-org/table";
import Link from "next/link";
import useAuthHeader from "react-auth-kit/hooks/useAuthHeader";
import {getRooms} from "@/app/actions/staff/getRooms";

const columns = [
  {
    key: "id",
    label: "ID",
  },
  {
    key: "hotel",
    label: "Hotel Id",
  },
  {
    key: "name",
    label: "Name",
  },
  {
    key: "adults",
    label: "Adults",
  },
  {
    key: "children",
    label: "Children",
  },
  {
    key: "price",
    label: "Price",
  },
  {
    key: "is_available",
    label: "Is available",
  },
  {
    key: "room_type",
    label: "Room type",
  },
  {
    key: "action",
    label: "Action",
  },
]

const action = (handleDetail: any, handleDelete: any) => {
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
      <Tooltip content="Delete">
        <span
          className="text-lg text-default-400 cursor-pointer active:opacity-50"
          onClick={handleDelete}
        >
          <HiMiniXMark color={"red"}/>
        </span>
      </Tooltip>
    </div>
  )
}


const ManagerRoomPage = () => {

  const [isLoading, setIsLoading] = useState(true)
  const user: User | null = useAuthUser()
  const token = useAuthHeader()
  const route = useRouter()
  const [data, setData] = useState<any[]>([])
  const [page, setPage] = useState(1)
  const [pages, setPages] = useState(1)
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: "id",
    direction: "ascending",
  })

  useEffect(() => {
    if (token) {
      getRooms(token, page, 10).then((res: Result) => {
        setData(res.results)
        setPages(Math.ceil(res.count / res.results.length))
      })
    }
    setIsLoading(false)
  }, []);


  const handleDetails = (id: number) => {
    route.push(`/manager/room/${id}`)
  }


  const handleDelete = (id: number) => {

  }


  const renderCell = React.useCallback((data: HotelData, columnKey: React.Key) => {
    const cellValue: any = data[columnKey as keyof HotelData];
    switch (columnKey) {
      case 'is_available':
        return cellValue ? 'Yes' : 'No';
      case 'hotel':
        return (
          <Link href={`/hotel/${cellValue}`}>{cellValue}</Link>
        )
      case 'action':
        return action(() => handleDetails(data.id), () => handleDelete(data.id));
      default:
        return cellValue
    }
  }, [])


  return (
    <div>
      {(user && user.role !== 'admin') ? (
        <div className={'flex justify-center items-center h-screen'}>
          <span className={'text-3xl'}>You don't have permission</span>
        </div>
      ) : (
        <NextAuth fallbackPath={'/'}>
          <Container>
            <div className={'flex flex-col gap-4 mt-4'}>
              <h1 className={'text-3xl font-bold'}>Rooms</h1>
              <Button label={'Create new room'} onClick={() => route.push('/manager/room/0')}/>
              <div>
                {isLoading ? (
                  <Loader/>
                ) : (
                  <MyTable
                    title={'Rooms'}
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
      )}
    </div>
  )
}


export default ManagerRoomPage