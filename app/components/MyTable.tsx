import {Table, TableBody, TableCell, TableColumn, TableHeader, TableRow} from "@nextui-org/table";
import React from "react";
import {Tooltip} from "@nextui-org/tooltip";
import {EditIcon, EyeIcon} from "@nextui-org/shared-icons";
import {useRouter} from "next/navigation";
import {domain} from "@/app/actions/getRoomById";
import useAuthHeader from "react-auth-kit/hooks/useAuthHeader";
import {toast} from "react-hot-toast";

export interface BookingData {
  id: number
  hotel: string
  room: string
  check_in_date: string
  check_out_date: string
  total_price_usd: string
  status: string
}

const action = (handleDetail: any, handleComfirm: any) => {
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
          onClick={handleComfirm}
        >
          <EditIcon/>
        </span>
      </Tooltip>
    </div>
  )
}

const MyTable = ({title, columns, rows}: any) => {

  const route = useRouter()
  const token = useAuthHeader()

  const handleDetail = (id: number) => {
    route.push(`/manager/booking/${id}`)
  }

  const handleComfirm = (id: number) => {
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
          window.location.reload()
        }
      })
      .catch(error => {
        console.error("Error fetching data:", error);
        toast.error("Error: ", error)
      })
  }

  const renderCell = React.useCallback((data: BookingData, columnKey: React.Key) => {
    const cellValue = data[columnKey as keyof BookingData];
    switch (columnKey) {
      case 'action':
        return action(() => handleDetail(data.id), () => handleComfirm(data.id));
      default:
        return cellValue
    }
  }, [])

  return (
    <Table isStriped aria-label={title}>
      <TableHeader columns={columns}>
        {(column: any) => <TableColumn key={column?.key}>{column.label}</TableColumn>}
      </TableHeader>
      <TableBody items={rows} emptyContent={"No rows to display."}>
        {(item: any) => (
          <TableRow key={item}>
            {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export default MyTable;