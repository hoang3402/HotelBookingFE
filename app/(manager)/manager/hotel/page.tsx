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
import {getKeyValue} from "@nextui-org/table";

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

const ManagerUserPage = () => {

  const user: any = useAuthUser()
  const token = useAuthHeader()
  const [isLoading, setIsLoading] = useState(true)
  const [data, setData] = useState<HotelData[]>([])

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
        setData(data)
        setIsLoading(false)
      })
  }, [])

  return (
    <div>
      {user?.role !== 'admin' ? <h1>Permission denied</h1> : (
        <NextAuth fallbackPath={'/'}>
          <Container>
            <div className={'flex flex-col gap-4 mt-4'}>
              <h1 className={'text-3xl font-bold'}>Hotels</h1>
              <div>
                {isLoading ? (
                  <Loader/>
                ) : (
                  <MyTable title={'Hotels'} columns={columns} rows={data} renderCell={getKeyValue}/>
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