import {getKeyValue, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow} from "@nextui-org/table";

const MyTable = ({title, columns, rows}: any) => {
  return (
    <Table isStriped aria-label={title}>
      <TableHeader columns={columns}>
        {(column: any) => <TableColumn key={column?.key}>{column.label}</TableColumn>}
      </TableHeader>
      <TableBody items={rows} emptyContent={"No rows to display."}>
        {(item: any) => (
          <TableRow key={item}>
            {(columnKey) => <TableCell>{getKeyValue(item, columnKey)}</TableCell>}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export default MyTable;