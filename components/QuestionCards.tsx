import Question from '../types/types.tsx'
import { formatDate } from './utilities/formatDate.tsx'

interface Props {
    question: Question;
    setPreviewImage: (url: string) => void;
    isDark: boolean;
}

export default function QuestionCard({ question, setPreviewImage, isDark }: Props) {
    const fields = question.field.split('/')

    return (
      <div className={`relative border rounded-xl p-4 shadow-md duration-200 transition-all hover:scale-[1.01] ${isDark ? 'border-white/30 bg-transparent' : 'border-gray-300 bg-white'}`}>
        <div className="flex justify-between">
            <div className={`text-[1.1rem] mb-2 flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                <span className="text-[1.4rem]">{question.emoji}</span>
                <strong>{question.question_number}</strong> - {question.test}
            </div>

            <div className={`absolute top-4 right-4 text-sm text-right ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                <p>{formatDate(question.created_at)}</p>
                {question.image_url && (
                    <img src={question.image_url} alt="attachment" className="mt-2 h-24 w-48 rounded cursor-pointer hover:opacity-80 transition"
                    onClick={() => question.image_url && setPreviewImage(question.image_url)} />
                )}
            </div>
        </div>

        {/* field cards, time card and comment*/}
        <div className={isDark ? 'text-white' : 'text-gray-900'}>
            <div className="flex gap-2">
                {fields.map((field, i) => (
                    <div key={i} className={`rounded-lg px-2 py-1 text-sm ${isDark ? 'bg-blue-900/50 text-blue-200' : 'bg-blue-100 text-blue-800'}`}>
                        {field}
                    </div>
                ))}
            </div>

            <div className={`inline-block rounded-lg px-2 py-1 text-sm my-2 ${isDark ? 'bg-gray-800/50 text-gray-300' : 'bg-gray-100 text-gray-700'}`}>
                <strong>⏱️</strong> {question.timestamp}
            </div>
            <p className={isDark ? 'text-gray-400' : 'text-gray-500'}> {question.comment}</p>
        </div>
      </div>
    );
}