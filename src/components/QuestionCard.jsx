import './QuestionCard.css';

export default function QuestionCard({ question, selectedAnswer, onSelectAnswer, eliminatedOptions = [] }) {
    return (
        <div className="question-card glass-card animate-scale-in">
            <h2 className="question-text">{question.question}</h2>
            <div className="options-grid">
                {question.options.map((option, index) => {
                    const isEliminated = eliminatedOptions.includes(index);

                    return (
                        <button
                            key={index}
                            className={`option-btn ${selectedAnswer === index ? 'selected' : ''} ${isEliminated ? 'eliminated' : ''}`}
                            onClick={() => !isEliminated && onSelectAnswer(index)}
                            disabled={isEliminated}
                        >
                            <span className="option-letter">
                                {String.fromCharCode(65 + index)}
                            </span>
                            <span className="option-text">
                                {isEliminated ? '—' : option}
                            </span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
