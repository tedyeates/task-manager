import { useEffect, useState } from 'react'
import './App.css'
import DataTable from './lib/components/DataTable'
import { ModalPopup } from './lib/components/ModalPopup'
import { Button } from './components/ui/button'
import type { FormDataType } from './lib/types'

function App() {
    const [data, setData] = useState([])
    const [open, setOpen] = useState(false)
    const [modalType, setModalType] = useState<"Create" | "Edit">("Create")
    const [modalData, setModalData] = useState<FormDataType | null>(null)

    async function loadData()  {
        const response = await fetch("http://localhost:3000/task")
        const data = await response.json()
        setData(data.tasks)
    }

    useEffect(() => {
        loadData()
    }, [])

    return (
        <>
            <Button onClick={() => {
                setOpen(true)
                setModalType("Create")
            }}>
                Create
            </Button>
            <ModalPopup 
                modalType={modalType} 
                open={open} 
                setOpen={setOpen} 
                modalData={modalData}
                loadData={loadData}
            />
            {data.length > 0 ? (
                <DataTable 
                    onClick={(row) => {
                        setOpen(true)
                        setModalType("Edit")
                        setModalData(row)
                    }} 
                    onDelete={async (row) => {
                        await fetch(`http://localhost:3000/task/${row.id}`, { method: "DELETE" })
                        loadData()
                    }}
                    headers={Object.keys(data[0])} 
                    rows={data} 
                />
            ) : (
                <p>Loading...</p>
            )}
        </>
    )
}

export default App
