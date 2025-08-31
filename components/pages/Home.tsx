import { useState, useEffect, useMemo } from 'react';
import { Target, BadgeCheck, Zap, Clock, BrainCircuit, Flame } from 'lucide-react';
import { getStatsSummary } from '../utilities/analysisUtils.tsx'
import AreaChartAnalysis from "../graphs/AreaChartAnalysis.tsx";
import QuestionCard from "../QuestionCards.tsx";
import StatCard from '../StatCards.tsx';
import Question from "../../types/types.tsx";

interface HomeProps {
    isDark: boolean;
}

function Home({ isDark }: HomeProps) {
    const [data, setData] = useState<Question[]>([]);
    const [previewImage, setPreviewImage] = useState<string | null>(null);

    useEffect(() => {
        fetch(import.meta.env.VITE_API_URL + '/questions')
        .then(res => res.json())
        .then(data => setData(data));
    }, []);

    let range = 30;
    const summary = useMemo(() => getStatsSummary(data, range), [data]);

    return (
        <>
            <div className="flex flex-col items-center mb-10" id="main-title">
                <h1 className="text-[#29b5be] transition-colors duration-300">Stuna</h1>
                <h2 className={`mt-2 transition-colors duration-300 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Track your studies with data analysis</h2>
            </div>
            
            <div className="grid grid-cols-3 gap-4 mb-12" id="stat-cards">
                <StatCard icon={Target} color="text-blue-600" background={`${isDark ? '' : 'bg-blue-50'}`} title='Total Questions' stat={summary.totalQuestions} isDark={isDark}></StatCard>
                <StatCard icon={BadgeCheck} color="text-green-600" background={`${isDark ? '' : 'bg-green-50'}`} title='Correct Questions' stat={summary.correct + summary.half/2} isDark={isDark}></StatCard>
                <StatCard icon={Zap} color="text-orange-500" background={`${isDark ? '' : 'bg-orange-50'}`} title='Precision' stat={summary.precision} isDark={isDark}></StatCard>
                <StatCard icon={Clock} color="text-blue-600" background={`${isDark ? '' : 'bg-blue-50'}`} title='Average Time' stat={summary.averageTime} isDark={isDark}></StatCard>
                <StatCard icon={BrainCircuit} color="text-indigo-600" background={`${isDark ? '' : 'bg-indigo-50'}`} title='Total Time' stat={summary.totalTime} isDark={isDark}></StatCard>
                <StatCard icon={Flame} color="text-orange-500" background={`${isDark ? '' : 'bg-orange-50'}`} title='Streak' stat={summary.streak} isDark={isDark}></StatCard>
            </div>
            
            <div className={`rounded-lg py-3 pt-6 mb-4 transition-colors duration-300 ${isDark ? 'bg-transparent' : `bg-white`}`}>
                <AreaChartAnalysis data={data} range={range}/>
            </div>
                
            <h1 className={`font-bold mb-4 transition-colors duration-300 ${isDark ? 'text-white' : 'text-gray-900'}`}>Questions</h1>
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
        </>
    );
}

export default Home;