import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import type { FormDataType } from "../types"
import { Button } from "@/components/ui/button"

type DataTableProps = {
    headers: string[]
    rows: FormDataType[]
    onClick: (row: FormDataType) => void
    onDelete: (row: FormDataType) => void
}

function DataTable({headers, rows, onClick, onDelete}: DataTableProps) {
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
                        <TableCell className="text-center">
                            <Button
                                variant="destructive"
                                size="sm"
                                onClick={(e) => {
                                    e.stopPropagation() // ✅ prevents row click from firing
                                    onDelete(row)
                                }}
                            >
                                Delete
                            </Button>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}

export default DataTable
