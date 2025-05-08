interface Question {
    comment: string;
    emoji: string;
    field: string;
    question_number: string;
    test: string;
    timestamp: string;
  }
  
interface Props {
    question: Question;
}
  
  export default function QuestionCard({ question }: Props) {
    return (
      <div
        className="border border-white/30 rounded-xl p-4 shadow-md duration-200 hover:scale-[1.01]">
        <div className="text-[1.1rem] mb-2 flex items-center gap-2">
          <span className="text-[1.4rem]">{question.emoji}</span>
          <strong>{question.question_number}</strong> - {question.test}
        </div>
  
        <div>
          <p className="my-1"><strong>Field:</strong> {question.field}</p>
          <p className="my-1"><strong>Time:</strong> {question.timestamp}</p>
          <p className="text-gray-400"> {question.comment}</p>
        </div>
      </div>
    );
  }