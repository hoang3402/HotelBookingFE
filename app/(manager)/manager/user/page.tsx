"use client";

import useAuthUser from "react-auth-kit/hooks/useAuthUser"
import Container from "@/app/components/Container";
import Loader from "@/app/components/Loader";
import MyTable from "@/app/components/MyTable";
import NextAuth from "@auth-kit/next";
import React, {useCallback, useEffect, useState} from "react";
import {Result, User} from "@/app/type";
import useAuthHeader from "react-auth-kit/hooks/useAuthHeader";
import getUsers from "@/app/actions/getUsers";
import {SortDescriptor} from "@nextui-org/table";
import Link from "next/link";
import {Tooltip} from "@nextui-org/tooltip";
import {EyeIcon} from "@nextui-org/shared-icons";
import {HiMiniXMark} from "react-icons/hi2";
import {useRouter} from "next/navigation";

const columns = [
  {
    key: "id",
    label: "ID",
  },
  {
    key: "first_name",
    label: "First name",
  },
  {
    key: "last_name",
    label: "Last name",
  },
  {
    key: "email",
    label: "Email",
  },
  {
    key: "role",
    label: "Role",
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


const ManagerUserPage = () => {

  const user: User | null = useAuthUser()
  const token = useAuthHeader()
  const route = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [data, setData] = useState<any[]>([])
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: 'id',
    direction: 'descending'
  })


  useEffect(() => {
    if (token) {
      getUsers(token).then((res: Result) => {
        setData(res.results)
      })
    }
    setIsLoading(false)
  }, [])


  const handleDetails = (id: number) => {
    route.push(`/manager/user/${id}`)
  }

  const handleDelete = (id: number) => {

  }


  const renderCell = useCallback((data: User, columnKey: React.Key) => {
    const cellValue: any = data[columnKey as keyof User];
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
      {(user && user.role) !== 'admin' ? (
        <div className={'flex justify-center items-center h-screen'}>
          <span className={'text-3xl'}>You don't have permission</span>
        </div>
      ) : (
        <NextAuth fallbackPath={'/'}>
          <Container>
            <div className={'flex flex-col gap-4 mt-4'}>
              <h1 className={'text-3xl font-bold'}>Users</h1>
              <div>
                {isLoading ? (
                  <Loader/>
                ) : (
                  <MyTable
                    title={'Users'}
                    columns={columns}
                    rows={data}
                    sortDescriptor={sortDescriptor}
                    setSortDescriptor={setSortDescriptor}
                    renderCell={renderCell}
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

export default ManagerUserPage