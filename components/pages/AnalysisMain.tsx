import { useState, useEffect } from 'react';
//import { TrendingUp, BarChart3, PieChart, Activity } from 'lucide-react';
import { getTestData} from '../utilities/analysisUtils.tsx';
import Question from "../../types/types.tsx";

interface AnalysisMainProps {
    isDark: boolean;
}

function AnalysisMain( {isDark}: AnalysisMainProps) {
    const [data, setData] = useState<Question[]>([]);

    useEffect(() => {
        fetch(import.meta.env.VITE_API_URL + '/questions')
        .then(res => res.json())
        .then(data => setData(data));
    }, []);

    // make a list of tests
    let testArray: Record<string, Question[]> = {};
    for (let i = 0; i < data.length; i++) {
        const test = data[i].test;
        if (!testArray[test]) {
            testArray[test] = [];
        }
        testArray[test].push(data[i])
    }

    // sorting by alphabetical order
    const sortedKeys = Object.keys(testArray).sort();
    const sortedTests: Record<string, Question[]> = {};
    for (const key of sortedKeys) {
        sortedTests[key] = testArray[key];
    }

    console.log(getTestData(sortedTests["UNICAMP 2025"]))

    return (
        <div className={`min-h-screen transition-colors duration-300 ${isDark ? 'bg-[#101115]' : 'bg-white'}`}>
            <div className="px-24">
                <div className="flex flex-col items-center mb-10">
                    <h1 className="text-[#29b5be] transition-colors duration-300">Analysis</h1>
                    <h2 className={`mt-2 transition-colors duration-300 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Deep dive into your study patterns</h2>
                </div>
            </div>

            <div>
                
            </div>
        </div>
    );
}

export default AnalysisMain;