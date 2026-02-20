import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    HiCheckCircle,
    HiXCircle,
    HiChartBar,
    HiFire,
    HiLightBulb,
    HiArrowLeft,
    HiClock,
} from 'react-icons/hi2';
import './HistoryDetail.css';

const difficultyEmoji = { easy: '🌱', medium: '⚡', hard: '🔥' };

export default function HistoryDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { getHistory } = useAuth();

    const history = getHistory();
    const entry = history.find(h => h.id === id);

    if (!entry || !entry.questions) {
        return (
            <div className="history-detail-page page-wrapper">
                <div className="container detail-container">
                    <div className="glass-card empty-detail animate-scale-in">
                        <span className="empty-icon">📋</span>
                        <h2>Quiz Not Found</h2>
                        <p>This quiz doesn't have detailed data available.</p>
                        <Link to="/profile" className="btn btn-primary">Back to Profile</Link>
                    </div>
                </div>
            </div>
        );
    }

    const formatDate = (iso) => {
        const d = new Date(iso);
        return d.toLocaleDateString('en-US', {
            month: 'long', day: 'numeric', year: 'numeric',
            hour: '2-digit', minute: '2-digit',
        });
    };

    return (
        <div className="history-detail-page page-wrapper">
            <div className="container detail-container">
                {/* Back + Summary Header */}
                <div className="detail-header animate-scale-in">
                    <button className="back-btn" onClick={() => navigate('/profile')}>
                        <HiArrowLeft /> Back to Profile
                    </button>

                    <div className="detail-summary glass-card">
                        <div className="summary-left">
                            {entry.isAI && <span className="ai-tag-lg">AI Generated</span>}
                            <h1 className="detail-subject">{entry.subject}</h1>
                            <div className="detail-meta">
                                <span><HiClock /> {formatDate(entry.date)}</span>
                                <span className={`badge badge-${entry.difficulty === 'easy' ? 'success' : entry.difficulty === 'hard' ? 'danger' : 'warning'}`}>
                                    {difficultyEmoji[entry.difficulty]} {entry.difficulty}
                                </span>
                                {entry.maxStreak > 0 && (
                                    <span className="badge badge-primary"><HiFire /> ×{entry.maxStreak}</span>
                                )}
                            </div>
                        </div>
                        <div className="summary-score">
                            <span className="score-big">{entry.percentage}%</span>
                            <span className="score-fraction">{entry.correct}/{entry.total} correct</span>
                        </div>
                    </div>
                </div>

                {/* Question-by-Question Review */}
                <div className="detail-review animate-slide-up" style={{ animationDelay: '0.15s' }}>
                    <h2 className="section-title"><HiChartBar /> Question Review</h2>
                    <div className="detail-questions">
                        {entry.questions.map((q, idx) => {
                            const userAnswer = entry.answers[idx];
                            const isCorrect = userAnswer === q.correctAnswer;
                            const isUnanswered = userAnswer === undefined || userAnswer === -1;
                            const isSkipped = userAnswer === -2;

                            return (
                                <div key={idx} className={`detail-q glass-card ${isCorrect ? 'correct' : isSkipped ? 'skipped' : isUnanswered ? 'unanswered' : 'wrong'}`}>
                                    <div className="dq-header">
                                        <span className="dq-number">Q{idx + 1}</span>
                                        <span className={`badge ${isCorrect ? 'badge-success' : isSkipped ? 'badge-primary' : isUnanswered ? 'badge-warning' : 'badge-danger'}`}>
                                            {isCorrect ? '✓ Correct' : isSkipped ? 'Skipped' : isUnanswered ? 'Timed Out' : '✗ Wrong'}
                                        </span>
                                    </div>
                                    <p className="dq-question">{q.question}</p>

                                    {/* Options */}
                                    <div className="dq-options">
                                        {q.options.map((opt, oi) => {
                                            let cls = 'dq-option';
                                            if (oi === q.correctAnswer) cls += ' is-correct';
                                            if (oi === userAnswer && !isCorrect && !isUnanswered && !isSkipped) cls += ' is-wrong';
                                            return (
                                                <div key={oi} className={cls}>
                                                    <span className="opt-letter">{String.fromCharCode(65 + oi)}</span>
                                                    <span className="opt-text">{opt}</span>
                                                    {oi === q.correctAnswer && <HiCheckCircle className="opt-icon correct" />}
                                                    {oi === userAnswer && !isCorrect && !isUnanswered && !isSkipped && <HiXCircle className="opt-icon wrong" />}
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {/* Explanation — shown for ALL questions */}
                                    {q.explanation && (
                                        <div className="dq-explanation">
                                            <HiLightBulb className="explanation-icon" />
                                            <div>
                                                <span className="explanation-label">Solution</span>
                                                <p className="explanation-text">{q.explanation}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
