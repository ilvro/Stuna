import { useState, useEffect } from 'react'
import './App.css'
const apiURL = import.meta.env.VITE_API_URL;

function App() {
    const [data, setData] = useState([{}])

    useEffect(() => {
        fetch(apiURL + '/questions').then(
            res => res.json()
        ).then(
            data => {
                setData(data)
                console.log(data)
            }
        )
    }, [])
    
    return (
        <div>
            <h1>API test data</h1>
            {data && data.length > 0 ? (
                <div>
                    <pre>{JSON.stringify(data, null, 2)}</pre>
                </div>
            ) : (
                <p>Loading data...</p>
            )}
        </div>
    )
}

export default App;