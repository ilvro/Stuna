import Question from '../types/types.tsx'
import { formatDate } from './utilities/formatDate.tsx'
  
interface Props {
    question: Question;
    setPreviewImage: (url: string) => void;
    isDark: boolean;
}
  
export default function QuestionCard({ question, setPreviewImage, isDark }: Props) {
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
  
        <div className={isDark ? 'text-white' : 'text-gray-900'}>
          <p className="my-1"><strong>Field:</strong> {question.field}</p>
          <p className="my-1"><strong>Time:</strong> {question.timestamp}</p>
          <p className={isDark ? 'text-gray-400' : 'text-gray-500'}> {question.comment}</p>
        </div>
      </div>
    );
}