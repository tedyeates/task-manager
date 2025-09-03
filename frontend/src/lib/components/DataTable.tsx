import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

type DataTableProps = {
    headers: string[]
    rows: {
        [key: string]: string
    }[]
}

function DataTable({headers, rows}: DataTableProps) {
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
                    <TableRow key={index}>
                        {Object.values(row).map((value) => (
                            <TableCell>{value}</TableCell>
                        ))}
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}

export default DataTable
