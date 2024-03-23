"use client";


import useAuthUser from "react-auth-kit/hooks/useAuthUser"
import Container from "@/app/components/Container";
import Loader from "@/app/components/Loader";
import MyTable from "@/app/components/MyTable";
import NextAuth from "@auth-kit/next";
import React, {useEffect, useState} from "react";
import {HotelData, User} from "@/app/type";
import {domain} from "@/app/actions/getRoomById";
import useAuthHeader from "react-auth-kit/hooks/useAuthHeader";
import Link from "next/link";
import {Tooltip} from "@nextui-org/tooltip";
import {EyeIcon} from "@nextui-org/shared-icons";
import {HiMiniXMark} from "react-icons/hi2";
import Button from "@/app/components/Button";
import {useRouter} from "next/navigation";
import {toast} from "react-hot-toast";
import {SortDescriptor} from "@nextui-org/table";
import {getHotels} from "@/app/actions/staff/getHotels";
import {Pagination} from "@nextui-org/pagination";


const columns = [
  {
    key: "id",
    label: "ID",
  },
  {
    key: "name",
    label: "Name",
  },
  {
    key: "phone_number",
    label: "Phone number",
  },
  {
    key: "email",
    label: "Email",
  },
  {
    key: "location",
    label: "Location",
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


const ManagerHotelPage = () => {

  const user: User | null = useAuthUser()
  const token = useAuthHeader()
  const route = useRouter()
  const [reload, setReload] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [page, setPage] = React.useState(1);
  const [pages, setPages] = React.useState(1);
  const [data, setData] = useState<any[]>([])
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: 'id',
    direction: 'descending'
  })


  const handleDelete = (id: number) => {
    fetch(`${domain}api/hotel/${id}/delete/`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `${token}`
      }
    }).then(res => res.json())
      .then(data => {
        if (data.detail) {
          toast.error(data.detail)
          return
        }
        toast.success('Delete hotel success!')
      })
      .finally(() => setReload(reload + 1))
  }


  useEffect(() => {
    if (token) {
      getHotels(token, page).then(res => {
        let _temp: any = []
        res.results.forEach((item: HotelData) => {
          _temp.push({
            id: item.id,
            name: item.name,
            phone_number: item.phone_number,
            email: item.email,
            location: `${item.city.province.name} - ${item.city.province.country.name}`,
            action: item.id
          })
        })
        setData(_temp)
        setPages(Math.ceil(res.count / res.results.length))
        setIsLoading(false)
      })
    }
  }, [reload, page])


  const handleDetails = (id: number) => {
    route.push(`/manager/hotel/${id}`)
  }


  const renderCell = React.useCallback((data: HotelData, columnKey: React.Key) => {
    const cellValue: any = data[columnKey as keyof HotelData];
    switch (columnKey) {
      case 'name':
        return (
          <Link href={`/hotel/${data.id}`}>{cellValue}</Link>
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
              <h1 className={'text-3xl font-bold'}>Hotels</h1>
              <Button label={'Create new hotel'} onClick={() => route.push('/manager/hotel/0')}/>
              <div>
                {isLoading ? (
                  <Loader/>
                ) : (
                  <MyTable
                    title={'Hotels'}
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

export default ManagerHotelPage