import { useEffect, useState } from 'react'
import './App.css'
import DataTable from './lib/components/DataTable'
import CreateButton from './lib/components/CreateButton'

function App() {
    const [data, setData] = useState([])

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
            <CreateButton />
            {data.length > 0 ? (
                <DataTable headers={Object.keys(data[0])} rows={data} />
            ) : (
                <p>Loading...</p>
            )}
        </>
    )
}

export default App
