import { useState, useEffect } from 'react'
import './App.css'
import '../styles/questionCards.css';
const apiURL = import.meta.env.VITE_API_URL;

interface Question {
    comment: string;
    emoji: string;
    field: string;
    question_number: string;
    test: string;
    timestamp: string;
}


function App() { 
    const [data, setData] = useState<Question[]>([]);

    useEffect(() => { // get data from API
        fetch(apiURL + '/questions').then(
            res => res.json()
        ).then(
            data => {
                setData(data)
            }
        )
    }, [])
    
    return ( // display data
        <div className="container">
          <h1>Questions</h1>
          {data.length > 0 ? (
            <div className="card-list">
              {data.map((q, i) => (
                <div key={i} className="card">
                  <div className="card-header">
                    <span className="emoji">{q.emoji} </span>
                    <strong>{q.question_number}</strong> - {q.test}
                  </div>
                  
                  <div className="card-body">
                    <p><strong>Field:</strong> {q.field}</p>
                    <p><strong>Time:</strong> {q.timestamp}</p>
                    {q.comment && <p className="comment"><em>{q.comment}</em></p>}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>Loading data...</p>
          )}
        </div>
    )  
}

export default App;