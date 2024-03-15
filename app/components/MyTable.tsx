import {Table, TableBody, TableCell, TableColumn, TableHeader, TableRow} from "@nextui-org/table";
import React from "react";


const MyTable = ({title, columns, rows, renderCell, sort, sortDescriptor}: any) => {


  return (
    <Table isStriped aria-label={title} onSortChange={sort} sortDescriptor={sortDescriptor}>
      <TableHeader columns={columns}>
        {(column: any) => <TableColumn key={column?.key} allowsSorting>{column.label}</TableColumn>}
      </TableHeader>
      <TableBody items={rows} emptyContent={"No rows to display."}>
        {(item: any) => (
          <TableRow key={item.id}>
            {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export default MyTable;
