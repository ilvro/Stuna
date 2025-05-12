import { useState, useEffect } from 'react';
import SideBar from "../components/SideBar.tsx";
import QuestionCard from "../components/QuestionCards.tsx";
import Question from "../types/types.tsx";

function App() {
    const [data, setData] = useState<Question[]>([]);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    useEffect(() => {
        fetch(import.meta.env.VITE_API_URL + '/questions')
        .then(res => res.json())
        .then(data => setData(data));
    }, []);

  return (
    <div className="container max-w-screen-xl mx-auto">
      <SideBar isOpen={isSidebarOpen} toggle={() => setIsSidebarOpen(prev => !prev)} />
      
      <div className={`duration-250 ${isSidebarOpen ? 'ml-42' : 'ml-16'} p-4 w-full`}>
        <button 
          onClick={() => setIsSidebarOpen(prev => !prev)} 
          className="mb-4 text-white rounded">
          ☰
        </button>
        
        <h1 className="font-bold mb-4">Questions</h1>
        <div className="space-y-4">
          {data.slice(0,12).map((q, i) => (
            <QuestionCard key={i} question={q} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
