"use client";

import useAuthUser from "react-auth-kit/hooks/useAuthUser"
import NextAuth from "@auth-kit/next";
import React, {useEffect, useState} from "react";
import Container from "@/app/components/Container";
import Loader from "@/app/components/Loader";
import MyTable from "@/app/components/MyTable";

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

const ManagerRoomsPage = () => {

  const user: any = useAuthUser()
  const [isLoading, setIsLoading] = useState(true)
  const [data, setData] = useState<any[]>([])

  useEffect(() => {
    setIsLoading(false)
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
              <h1 className={'text-3xl font-bold'}>Rooms of </h1>
              <div>
                {isLoading ? (
                  <Loader/>
                ) : (
                  <MyTable title={'Rooms'} columns={columns} rows={data}/>
                )}
              </div>
            </div>
          </Container>
        </NextAuth>
      )}
    </div>
  )
}

export default ManagerRoomsPage