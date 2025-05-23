import Question from '../types/types.tsx'
import { formatDate } from './utilities/formatDate.tsx'
  
interface Props {
    question: Question;
    setPreviewImage: (url: string) => void;
}
  
export default function QuestionCard({ question, setPreviewImage }: Props) {
    return (
      <div className="relative border border-white/30 rounded-xl p-4 shadow-md duration-200 hover:scale-[1.01]">
        <div className="flex justify-between">
            <div className="text-[1.1rem] mb-2 flex items-center gap-2">
                <span className="text-[1.4rem]">{question.emoji}</span>
                <strong>{question.question_number}</strong> - {question.test}
            </div>

            <div className="absolute top-4 right-4 text-sm text-gray-400 text-right">
                <p>{formatDate(question.created_at)}</p>
                {question.image_url && (
                    <img src={question.image_url} alt="attachment" className="mt-2 h-24 w-48 rounded cursor-pointer hover:opacity-80 transition"
                    onClick={() => question.image_url && setPreviewImage(question.image_url)} />
                )}
            </div>
        </div>
  
        <div>
          <p className="my-1"><strong>Field:</strong> {question.field}</p>
          <p className="my-1"><strong>Time:</strong> {question.timestamp}</p>
          <p className="text-gray-400"> {question.comment}</p>
        </div>
      </div>
    );
  }