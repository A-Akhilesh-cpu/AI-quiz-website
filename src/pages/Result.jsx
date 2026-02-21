import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuiz } from '../context/QuizContext';
import { useAuth } from '../context/AuthContext';
import {
    HiTrophy,
    HiCheckCircle,
    HiXCircle,
    HiArrowPath,
    HiHome,
    HiChartBar,
    HiShare,
    HiFire,
    HiLightBulb,
} from 'react-icons/hi2';
import './Result.css';

function Confetti() {
    const colors = ['#6C63FF', '#FF6B9D', '#00D2FF', '#10B981', '#F59E0B', '#EF4444'];
    const confettiPieces = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 2,
        duration: 1.5 + Math.random() * 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: 6 + Math.random() * 8,
        rotation: Math.random() * 360,
    }));

    return (
        <div className="confetti-container">
            {confettiPieces.map((piece) => (
                <div
                    key={piece.id}
                    className="confetti-piece"
                    style={{
                        left: `${piece.left}%`,
                        animationDelay: `${piece.delay}s`,
                        animationDuration: `${piece.duration}s`,
                        backgroundColor: piece.color,
                        width: `${piece.size}px`,
                        height: `${piece.size}px`,
                        transform: `rotate(${piece.rotation}deg)`,
                    }}
                />
            ))}
        </div>
    );
}

const difficultyEmoji = { easy: '🌱', medium: '⚡', hard: '🔥' };

export default function Result() {
    const navigate = useNavigate();
    const { state, getScore, dispatch, saveToLeaderboard } = useQuiz();
    const { user, updateUserStats } = useAuth();
    const { questions, difficulty } = state;
    const [copied, setCopied] = useState(false);
    const savedRef = useRef(false);

    const score = getScore();

    useEffect(() => {
        if (questions.length === 0) {
            navigate('/');
            return;
        }
        if (!savedRef.current) {
            savedRef.current = true;
            const resultId = Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
            const questionData = questions.map(q => ({
                question: q.question,
                options: q.options,
                correctAnswer: q.correctAnswer,
                explanation: q.explanation || null,
            }));
            const answersData = [...state.answers];

            saveToLeaderboard(score, {
                id: resultId,
                questions: questionData,
                answers: answersData,
            });
            if (user) {
                updateUserStats({
                    id: resultId,
                    subject: state.subject || state.customTopic,
                    isAI: state.isAI,
                    difficulty: state.difficulty,
                    percentage: score.percentage,
                    correct: score.correct,
                    total: score.total,
                    maxStreak: score.maxStreak,
                    date: new Date().toISOString(),
                    questions: questionData,
                    answers: answersData,
                });
            }
        }
    }, [questions, navigate]);

    const getPerformance = () => {
        if (score.percentage >= 90) return { label: 'Excellent!', emoji: '🏆', color: 'var(--success)', class: 'excellent' };
        if (score.percentage >= 70) return { label: 'Good Job!', emoji: '👏', color: 'var(--primary)', class: 'good' };
        return { label: 'Keep Practicing!', emoji: '💪', color: 'var(--warning)', class: 'improve' };
    };

    const performance = getPerformance();

    const handleShare = async () => {
        const subject = state.subject || state.customTopic;
        const text = `⚡ BrainSpark Results\n📚 ${subject} | ${difficultyEmoji[difficulty]} ${difficulty}\n🎯 Score: ${score.percentage}% (${score.correct}/${score.total})\n🔥 Best Streak: ×${score.maxStreak}\n${performance.emoji} ${performance.label}\n\nChallenge yourself at BrainSpark!`;

        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 2500);
        } catch {
            const textArea = document.createElement('textarea');
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            setCopied(true);
            setTimeout(() => setCopied(false), 2500);
        }
    };

    const handleRestart = () => {
        dispatch({ type: 'RESET' });
        navigate('/');
    };

    if (questions.length === 0) return null;

    return (
        <div className="result-page page-wrapper">
            {score.percentage >= 90 && <Confetti />}

            <div className="container result-container">
                <div className="score-hero animate-scale-in">
                    <div className={`score-circle ${performance.class}`}>
                        <span className="score-emoji">{performance.emoji}</span>
                        <span className="score-value">{score.percentage}%</span>
                        <span className="score-label">Score</span>
                    </div>
                    <h1 className="performance-label" style={{ color: performance.color }}>
                        {performance.label}
                    </h1>
                    <div className="result-meta">
                        <span className={`badge badge-${difficulty === 'easy' ? 'success' : difficulty === 'hard' ? 'danger' : 'warning'}`}>
                            {difficultyEmoji[difficulty]} {difficulty}
                        </span>
                        {score.maxStreak > 0 && (
                            <span className="badge badge-primary">
                                <HiFire /> Best Streak: ×{score.maxStreak}
                            </span>
                        )}
                    </div>
                </div>

                <div className="stats-grid animate-slide-up" style={{ animationDelay: '0.2s' }}>
                    <div className="stat-card glass-card">
                        <div className="stat-icon correct"><HiCheckCircle /></div>
                        <div className="stat-info">
                            <span className="stat-number">{score.correct}</span>
                            <span className="stat-text">Correct</span>
                        </div>
                    </div>
                    <div className="stat-card glass-card">
                        <div className="stat-icon wrong"><HiXCircle /></div>
                        <div className="stat-info">
                            <span className="stat-number">{score.wrong}</span>
                            <span className="stat-text">Wrong</span>
                        </div>
                    </div>
                    <div className="stat-card glass-card">
                        <div className="stat-icon total"><HiChartBar /></div>
                        <div className="stat-info">
                            <span className="stat-number">{score.correct}/{score.total}</span>
                            <span className="stat-text">Total</span>
                        </div>
                    </div>
                    <div className="stat-card glass-card">
                        <div className="stat-icon trophy"><HiFire /></div>
                        <div className="stat-info">
                            <span className="stat-number">×{score.maxStreak}</span>
                            <span className="stat-text">Best Streak</span>
                        </div>
                    </div>
                </div>

                <div className="review-section animate-slide-up" style={{ animationDelay: '0.35s' }}>
                    <h2 className="section-title"><HiChartBar /> Answer Review</h2>
                    <div className="review-list">
                        {questions.map((q, idx) => {
                            const userAnswer = state.answers[idx];
                            const isCorrect = userAnswer === q.correctAnswer;
                            const isUnanswered = userAnswer === undefined || userAnswer === -1;
                            const isSkipped = userAnswer === -2;
                            const showExplanation = !isCorrect; // Show for wrong, timed out, and skipped

                            return (
                                <div key={idx} className={`review-item glass-card ${isCorrect ? 'correct' : isSkipped ? 'skipped' : isUnanswered ? 'unanswered' : 'wrong'}`}>
                                    <div className="review-header">
                                        <span className="review-number">Q{idx + 1}</span>
                                        <span className={`review-badge badge ${isCorrect ? 'badge-success' : isSkipped ? 'badge-primary' : isUnanswered ? 'badge-warning' : 'badge-danger'}`}>
                                            {isCorrect ? 'Correct' : isSkipped ? 'Skipped' : isUnanswered ? 'Timed Out' : 'Wrong'}
                                        </span>
                                    </div>
                                    <p className="review-question">{q.question}</p>
                                    <div className="review-answers">
                                        {!isCorrect && !isUnanswered && !isSkipped && (
                                            <p className="your-answer">
                                                <span>Your answer:</span> {q.options[userAnswer]}
                                            </p>
                                        )}
                                        <p className="correct-answer">
                                            <span>Correct answer:</span> {q.options[q.correctAnswer]}
                                        </p>
                                    </div>

                                    {/* Explanation for wrong/timed-out/skipped */}
                                    {showExplanation && q.explanation && (
                                        <div className="review-explanation">
                                            <HiLightBulb className="explanation-icon" />
                                            <div>
                                                <span className="explanation-label">Explanation</span>
                                                <p className="explanation-text">{q.explanation}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="result-actions animate-slide-up" style={{ animationDelay: '0.5s' }}>
                    <button className="btn btn-primary btn-lg" onClick={handleRestart}>
                        <HiArrowPath /> Play Again
                    </button>
                    <button className="btn btn-secondary btn-lg" onClick={handleShare}>
                        <HiShare /> {copied ? 'Copied! ✓' : 'Share Score'}
                    </button>
                    <button className="btn btn-secondary btn-lg" onClick={() => { dispatch({ type: 'RESET' }); navigate('/'); }}>
                        <HiHome /> Home
                    </button>
                </div>
            </div>
        </div>
    );
}
