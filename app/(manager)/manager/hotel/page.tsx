"use client";

import useAuthUser from "react-auth-kit/hooks/useAuthUser"
import Container from "@/app/components/Container";
import Loader from "@/app/components/Loader";
import MyTable from "@/app/components/MyTable";
import NextAuth from "@auth-kit/next";
import React, {useEffect, useState} from "react";
import {HotelData} from "@/app/type";
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

  const user: any = useAuthUser()
  const token = useAuthHeader()
  const [reload, setReload] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [data, setData] = useState<any[]>([])
  const route = useRouter()

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
    fetch(`${domain}api/hotel/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `${token}`
      }
    })
      .then((res) => res.json())
      .then((data: HotelData[]) => {
        let _data: any = []
        data.forEach(item => {
          _data.push({
            id: item.id,
            name: item.name,
            phone_number: item.phone_number,
            email: item.email,
            location: `${item.province.name} - ${item.province.country.name}`,
            action: item.id
          })
        })
        setData(_data)
        setIsLoading(false)
      })
  }, [reload])

  const handleDetails = (id: number) => {
    route.push(`/manager/hotel/detail/${id}`)
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

  function sort(descriptor: SortDescriptor) {
    data.sort((a: any, b: any) => {
      if (a[descriptor.column as keyof any] < b[descriptor.column as keyof any]) {
        return -1
      }
      if (a[descriptor.column as keyof any] > b[descriptor.column as keyof any]) {
        return 1
      }
      return 0
    })
  }


  return (
    <div>
      {user?.role !== 'admin' ? (
        <div className={'flex justify-center items-center h-screen'}>
          <span className={'text-3xl'}>You don't have permission</span>
        </div>
      ) : (
        <NextAuth fallbackPath={'/'}>
          <Container>
            <div className={'flex flex-col gap-4 mt-4'}>
              <h1 className={'text-3xl font-bold'}>Hotels</h1>
              <Button label={'Create new hotel'} onClick={() => route.push('/manager/hotel/detail/0')}/>
              <div>
                {isLoading ? (
                  <Loader/>
                ) : (
                  <MyTable
                    title={'Hotels'}
                    columns={columns}
                    rows={data}
                    renderCell={renderCell}
                    sort={sort}
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