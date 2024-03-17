import {Table, TableBody, TableCell, TableColumn, TableHeader, TableRow} from "@nextui-org/table";
import React, {useMemo} from "react";


const MyTable = (
  {title, columns, rows, renderCell, setSortDescriptor, sortDescriptor, bottomContent}: any
) => {

  const sortedItems = useMemo(() => {
    return [...rows].sort((a: any, b: any) => {
      const first = a[sortDescriptor.column as keyof any] as string
      const second = b[sortDescriptor.column as keyof any] as string
      const cmp = first < second ? -1 : first > second ? 1 : 0

      return sortDescriptor.direction === 'descending' ? -cmp : cmp
    })
  }, [sortDescriptor, rows])

  return (
    <Table
      isStriped
      aria-label={title}
      sortDescriptor={sortDescriptor}
      onSortChange={setSortDescriptor}
      bottomContent={bottomContent}
    >
      <TableHeader columns={columns}>
        {(column: any) =>
          <TableColumn key={column?.key} allowsSorting>{column.label}</TableColumn>}
      </TableHeader>
      <TableBody items={sortedItems} emptyContent={"No rows to display."}>
        {(item: any) => (
          <TableRow key={item.id}>
            {(columnKey) =>
              <TableCell>{renderCell(item, columnKey)}</TableCell>}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export default MyTable;
