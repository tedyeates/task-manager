import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import type { FormDataType } from "../types"

type DataTableProps = {
    headers: string[]
    rows: FormDataType[]
    onClick: (row: FormDataType) => void
}

function DataTable({headers, rows, onClick}: DataTableProps) {
    return (
        <Table className="table-fixed w-full">
            <TableHeader>
                <TableRow>
                    {headers.map((header) => (
                        <TableHead key={header}>{header}</TableHead>
                    ))}
                </TableRow>
            </TableHeader>
            <TableBody>
                {rows.map((row, index) => (
                    <TableRow key={index} onClick={() => onClick(row)}>
                        {Object.values(row).map((value, cellIndex) => (
                            <TableCell key={cellIndex}>{value}</TableCell>
                        ))}
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}

export default DataTable
