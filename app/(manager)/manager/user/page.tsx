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
import {domain} from "@/app/actions/getRoomById";
import {toast} from "react-hot-toast";
import {Pagination} from "@nextui-org/pagination";
import {Input} from "@nextui-org/input";

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
  const [page, setPage] = React.useState(1);
  const [pages, setPages] = React.useState(1);
  const [filterValue, setFilterValue] = React.useState("");
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: 'id',
    direction: 'descending'
  })


  useEffect(() => {
    if (token) {
      getUsers(token, page, 10).then((res: Result) => {
        setData(res.results)
        setPages(Math.ceil(res.count / res.results.length))
      })
    }
    setIsLoading(false)
  }, [])


  const handleDetails = (id: number) => {
    route.push(`/manager/user/${id}`)
  }

  const handleDelete = (id: number) => {
    fetch(`${domain}api/user/${id}/delete/`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `${token}`
      }
    })
      .then(res => res.ok ? toast.success('Delete user success!') : toast.error('Delete user failed!'))
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


  const onSearchChange = React.useCallback((value: any) => {
    if (value) {
      setFilterValue(value);
      setPage(1);
    } else {
      setFilterValue("");
    }
  }, []);

  const filteredItems = React.useMemo(() => {
    if (filterValue) {
      return data.filter((item: User) => {
        return item.first_name.toLowerCase().includes(filterValue.toLowerCase()) ||
          item.last_name.toLowerCase().includes(filterValue.toLowerCase()) ||
          item.email.toLowerCase().includes(filterValue.toLowerCase())
      });
    }
    return data;
  }, [filterValue])


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
                  <div className={'flex flex-col gap-5'}>
                    <Input value={filterValue} onValueChange={setFilterValue} placeholder="Search"/>
                    <MyTable
                      title={'Users'}
                      columns={columns}
                      rows={filteredItems}
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
                  </div>
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