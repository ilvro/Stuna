import { useState, useEffect, useMemo } from 'react';
import { Target, BadgeCheck, Zap, Clock, BrainCircuit, BookOpen, Sun, MoonIcon } from 'lucide-react';
import { getStatsSummary, getStreak } from '../components/utilities/analysisUtils.tsx'
import BarAnalysis from "../components/graphs/BarChartAnalysis.tsx";
import AreaChartAnalysis from "../components/graphs/AreaChartAnalysis.tsx";

import QuestionCard from "../components/QuestionCards.tsx";
import StatCard from '../components/StatCards.tsx';
import Question from "../types/types.tsx";

function App() {
    const [isDark, setIsDark] = useState(true); // dark/light mode management
    const [data, setData] = useState<Question[]>([]);
    const [previewImage, setPreviewImage] = useState<string | null>(null); // for question cards

    const toggleTheme = () => {
        setIsDark(!isDark);
    }

    useEffect(() => {
        // initialize theme on load and apply changes
        if (isDark) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [isDark]); // add isDark as dependency to trigger on theme change

    useEffect(() => {
        fetch(import.meta.env.VITE_API_URL + '/questions')
        .then(res => res.json())
        .then(data => setData(data));
    }, []);

    let range = 30;
    const summary = useMemo(() => getStatsSummary(data, range), [data]);
    getStreak(data)

  return (
        <div className={`min-h-screen transition-colors duration-200 ${isDark ? 'bg-[#101115]' : 'bg-gray-50'}`}>
            <nav className={`flex items-center shadow-lg h-14 mb-10 space-x-8 px-12 border-b transition-colors duration-200 ${isDark ? 'bg-[#101115] border-white/30' : 'bg-white border-gray-200'}`} id="main-nav-bar">
                <a className={isDark ? 'text-white' : 'text-gray-900'}>Stuna</a>
                <a className={isDark ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-900'}>Guide</a>
                <a className={isDark ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-900'}>History</a>{/*show monthly report, streak)*/}
                <a className={isDark ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-900'}>Analysis</a>{/*proportional analysis: in month 1 the correct over total proportion was 35%, the next month it would show 47%, showing the progress over time. this would be an area chart. this month analysis, last 3 months analysis, year analysis, radar charts showing the fields of study in which you are strongest and the ones in which you are the weakest (using proportion again)*/}
                
                <div className="flex items-center space-x-4 ml-auto"> {/* dark mode button */}
                <button
                    onClick={toggleTheme}
                    className={`group flex items-center justify-center w-8 h-8 rounded-full !bg-transparent
                        ${isDark 
                            ? 'text-yellow-400 hover:text-yellow-300' 
                            : 'text-gray-600 hover:text-gray-500'}
                        transition-colors duration-200
                    `}
                    >
                        {/* current theme icon (deactivates when hovering) */}
                        <div className="transition-all duration-300 ease-in-out scale-100 group-hover:rotate-180 group-hover:opacity-0">
                            {isDark ? <MoonIcon size={18} /> : <Sun size={18} />}
                        </div>

                        {/* opposite theme icon (activates when hovering) */}
                        <div className="absolute flex items-center justify-center transition-all duration-300 ease-in-out opacity-0 scale-0 group-hover:scale-100 group-hover:rotate-180 group-hover:opacity-100">
                            {isDark ? <Sun size={18} /> : <MoonIcon size={18} />}
                        </div>
                    </button>

                    <a className={`flex ${isDark ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-900'}`} href="https://github.com/ilvro/Stuna" target='_blank'>GitHub</a>
                </div>

                
            </nav>


            <div className="px-100">
                {/* the graphs on the first page will be 
                    weekly report with correct/total (bar chart)
                */}

                <div className="flex flex-col items-center mb-10" id="main-title">
                    <h1 className="text-[#208eaf]">Stuna</h1>
                    <h2 className={`mt-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Track your studies with data analysis</h2>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-12" id="stat-cards">
                    <StatCard icon={<Target className="text-blue-600" />} title='Total Questions' stat={summary.totalQuestions} isDark={isDark}></StatCard>
                    <StatCard icon={<BadgeCheck className="text-green-600" />} title='Correct Questions' stat={summary.correct + summary.half/2} isDark={isDark}></StatCard>
                    <StatCard icon={<Zap className="text-orange-500" />} title='Precision' stat={summary.precision} isDark={isDark}></StatCard>
                    <StatCard icon={<Clock className="text-blue-500" />} title='Average Time' stat={summary.averageTime} isDark={isDark}></StatCard>
                    <StatCard icon={<BrainCircuit className="text-indigo-600" />} title='Total Time' stat={summary.totalTime} isDark={isDark}></StatCard>
                    <StatCard icon={<BookOpen className={isDark ? 'text-black' : 'text-gray-700'} />} title='Streak' stat={summary.streak} isDark={isDark}></StatCard>
                </div>
                

                <BarAnalysis data={data} range={range}/>
                <AreaChartAnalysis data={data} range={range}/>
                    
                <h1 className={`font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Questions</h1>
                <div className="space-y-4">
                    {data.slice(0,12).map((q, i) => (
                        <QuestionCard key={i} question={q} setPreviewImage={setPreviewImage} isDark={isDark}/>
                    ))}
                </div>

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