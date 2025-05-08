import { useState, useEffect } from 'react'
import QuestionCard from '../components/questionCards.tsx';
import './App.css'
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
    
    return (
        <div className="container">
          <h1>Questions</h1>
          {data.length > 0 ? (
            <div className="card-list">
              {data.map((q, i) => (
                <QuestionCard key={i} question={q} />
              ))}
            </div>
          ) : (
            <p>Loading data...</p>
          )}
        </div>
    )
}

export default App;