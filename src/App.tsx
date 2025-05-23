import { useState, useEffect } from 'react';
import SideBar from "../components/SideBar.tsx";
import BarAnalysis from "../components/GraphAnalysis.tsx";
import QuestionCard from "../components/QuestionCards.tsx";
import Question from "../types/types.tsx";

function App() {
    const [data, setData] = useState<Question[]>([]);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState<string | null>(null);

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

        <BarAnalysis data={data}/>
        
        <h1 className="font-bold mb-4">Questions</h1>
        <div className="space-y-4">
          {data.slice(0,12).map((q, i) => (
            <QuestionCard key={i} question={q} setPreviewImage={setPreviewImage}/>
          ))}
        </div>
      </div>

      {/* commented code to pick up react better */}
      {previewImage && (
        <div
            className="fixed inset-0 bg-black/60 backdrop-blur-none z-50 flex items-center justify-center"
            onClick={() => setPreviewImage(null)}> {/* clicking on the dimmer means you clicked out of the image, so set the image to null to close it*/}

            <img
                src={previewImage}
                alt="preview"
                className="max-w-[90%] max-h-[90%] rounded-lg animate-fadeInZoom"
                onClick={(e) => e.stopPropagation()}>
            </img>
            {/* add stopPropagation in the image so clicking on the image doesnt trigger the close event*/}
        </div>
      )}

    </div>
  );
}

export default App;
