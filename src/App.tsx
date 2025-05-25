import { useState, useEffect } from 'react';
import GraphAnalysis from "../components/GraphAnalysis.tsx";
import QuestionCard from "../components/QuestionCards.tsx";
import Question from "../types/types.tsx";

function App() {
    const [data, setData] = useState<Question[]>([]);
    const [previewImage, setPreviewImage] = useState<string | null>(null);

    useEffect(() => {
        fetch(import.meta.env.VITE_API_URL + '/questions')
        .then(res => res.json())
        .then(data => setData(data));
    }, []);

  return (

        <div>
            <nav className="flex items-center shadow-lg h-14 mb-10 space-x-8 px-12" id="main-nav-bar">
                <a className="">Stuna</a>
                <a>Guide</a>
                <a>History</a>{/*show monthly report, streak)*/}
                <a>Analysis</a>{/*proportional analysis: in month 1 the correct over total proportion was 35%, the next month it would show 47%, showing the progress over time. this would be an area chart. this month analysis, last 3 months analysis, year analysis, radar charts showing the fields of study in which you are strongest and the ones in which you are the weakest (using proportion again)*/}
                <a className="flex ml-auto" href="https://github.com/ilvro/Stuna" rel="noreferrer">GitHub</a>
            </nav>


            <div className="px-100">
                {/* the graphs on the first page will be 
                    weekly report with correct/total (bar chart)
                */}

                {/* stat cards with total questions done, streak, correct questions, total precision, average question time, total time studied*/}

                <div className="flex flex-col items-center mb-20">
                    <h1 className="text-[#208eaf]">Stuna</h1>
                    <h2 className="mt-2">Track your studies with data analysis</h2>
                </div>
                <GraphAnalysis data={data} range={30}/>
                    
                <h1 className="font-bold mb-4">Questions</h1>
                <div className="space-y-4">
                    {data.slice(0,12).map((q, i) => (
                        <QuestionCard key={i} question={q} setPreviewImage={setPreviewImage}/>
                    ))}
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
        </div>
    );
}

export default App;
