import { BarChart, Bar, ResponsiveContainer, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { formatShortDate } from '../utilities/formatDate.tsx'
import { processReport } from '../utilities/analysisUtils.tsx'
import Question from '../../types/types.tsx';
import React from 'react';

interface AnalysisProps {
    data: Question[];
    range: number
}

function BarAnalysis({ data, range }: AnalysisProps) {
    if (!data || data.length === 0) return null;

    return (
        <ResponsiveContainer width="100%" height={300}>
            <BarChart
                data={processReport(data, range)} /* recharts automatically loops through every data item */
                margin={{
                    top: 5,
                    right: 30,
                    left: 0,
                    bottom: 5,
                }}>
                <CartesianGrid strokeDasharray="3 3"></CartesianGrid>
                <XAxis 
                    dataKey={range > 7 ? "day" : "weekDay"}

                    /* format text for when the full date is displayed */
                    tickFormatter={(date) => {
                        return range > 7 ? formatShortDate(date) : date;
                    }}
                    angle={range > 7 ? -45 : 0}
                    textAnchor={range > 7 ? "end" : "middle"}
                    tick={{ fontSize: 10 }}
                    />
                <YAxis></YAxis>

                <Tooltip></Tooltip>
                <Legend></Legend>
                
                <Bar dataKey="correct" stackId='a' fill="#1699b8"></Bar>
                <Bar dataKey="half" stackId='a' fill="#1699b8" fillOpacity="0.5"></Bar>
                <Bar dataKey="incorrect" stackId='a' fill="#8884d8"></Bar>

            </BarChart>
        </ResponsiveContainer>
        /*
        <div>
            {data.map((q) => (
                <div>{q.emoji}</div>
            ))}
        </div>*/
    )
}

export default React.memo(BarAnalysis);