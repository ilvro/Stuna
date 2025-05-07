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
        <div className="card">
            <div className="card-header">
                <span className="emoji">{question.emoji} </span>
                <strong>{question.question_number}</strong> - {question.test}
            </div>
  
        <div className="card-body">
            <p><strong>Field:</strong> {question.field}</p>
            <p><strong>Time:</strong> {question.timestamp}</p>
            {question.comment && <p className="comment"><em>{question.comment}</em></p>}
        </div>
    </div>
);
}
  