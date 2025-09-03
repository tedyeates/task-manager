import { useEffect, useState } from 'react'
import './App.css'
import DataTable from './lib/components/DataTable'
import { ModalPopup } from './lib/components/ModalPopup'
import { Button } from './components/ui/button'

function App() {
    const [data, setData] = useState([])
    const [open, setOpen] = useState(false)
    const [modalType, setModalType] = useState<"Create" | "Edit">("Create")

    useEffect(() => {
        fetch("http://localhost:3000/task").then(
            res => res.json()
        ).then(
            data => {
                console.log(data)
                setData(data.tasks)
            }
        )
    }, [])

    return (
        <>
            <Button onClick={() => {
                setOpen(true)
                setModalType("Create")
            }}>
                Create
            </Button>
            <ModalPopup modalType={modalType} open={open} setOpen={setOpen} />
            {data.length > 0 ? (
                <DataTable 
                    onClick={() => {
                        setOpen(true)
                        setModalType("Edit")
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
