import { AreaChart, Area, ResponsiveContainer, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { formatShortDate } from '../utilities/formatDate.tsx'
import { processReport } from '../utilities/analysisUtils.tsx'
import Question from '../../types/types.tsx';
import React from 'react';

interface AnalysisProps {
    data: Question[];
    range: number
}

function AreaChartAnalysis({ data, range }: AnalysisProps) {
    if (!data || data.length === 0) return null;

    return (
        <ResponsiveContainer width="100%" height={300}>
            <AreaChart
                data={processReport(data, range).map(data => ({
                    ...data,
                    correct: data.correct + data.half
                }))} /* for this chart, process half as correct */

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
                
                <Area type="monotone" dataKey="correct" stroke="#1699b8" fill="#1699b8"></Area>
                <Area type="monotone" dataKey="incorrect" stroke="#8884d8" fill="#8884d8"></Area>

            </AreaChart>
        </ResponsiveContainer>
        /*
        <div>
            {data.map((q) => (
                <div>{q.emoji}</div>
            ))}
        </div>*/
    )
}

export default React.memo(AreaChartAnalysis);