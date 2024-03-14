import {Table, TableBody, TableCell, TableColumn, TableHeader, TableRow} from "@nextui-org/table";
import React from "react";
import {Tooltip} from "@nextui-org/tooltip";
import {EditIcon, EyeIcon} from "@nextui-org/shared-icons";

export interface BookingData {
  id: number
  hotel: string
  room: string
  check_in_date: string
  check_out_date: string
  total_price_usd: string
  status: string
}

const MyTable = ({title, columns, rows}: any) => {

  const renderCell = React.useCallback((data: BookingData, columnKey: React.Key) => {
    const cellValue = data[columnKey as keyof BookingData];
    switch (columnKey) {
      case 'action':
        return (
          <div className="relative flex items-center gap-2">
          <Tooltip content="Details">
            <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
              <EyeIcon/>
            </span>
          </Tooltip>
          <Tooltip content="Comfirm">
            <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
              <EditIcon/>
            </span>
          </Tooltip>
        </div>
        )
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