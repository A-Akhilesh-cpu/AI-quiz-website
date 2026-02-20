import { useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuiz } from '../context/QuizContext';
import Timer from '../components/Timer';
import ProgressBar from '../components/ProgressBar';
import QuestionCard from '../components/QuestionCard';
import Lifelines from '../components/Lifelines';
import StreakCounter from '../components/StreakCounter';
import { HiArrowRight, HiTrophy } from 'react-icons/hi2';
import './Quiz.css';

const difficultyBadge = {
    easy: { label: '🌱 Easy', class: 'badge-success' },
    medium: { label: '⚡ Medium', class: 'badge-warning' },
    hard: { label: '🔥 Hard', class: 'badge-danger' },
};

export default function Quiz() {
    const navigate = useNavigate();
    const { state, dispatch } = useQuiz();
    const { questions, currentIndex, answers, quizFinished, currentStreak, difficulty, eliminatedOptions, extraTimeAdded } = state;

    useEffect(() => {
        if (questions.length === 0) {
            navigate('/');
        }
    }, [questions, navigate]);

    useEffect(() => {
        if (quizFinished) {
            navigate('/result');
        }
    }, [quizFinished, navigate]);

    const handleTimeout = useCallback(() => {
        dispatch({ type: 'TIMEOUT' });
    }, [dispatch]);

    const handleSelectAnswer = (optionIndex) => {
        dispatch({ type: 'SELECT_ANSWER', payload: optionIndex });
    };

    const handleNext = () => {
        if (currentIndex === questions.length - 1) {
            dispatch({ type: 'FINISH_QUIZ' });
        } else {
            dispatch({ type: 'NEXT_QUESTION' });
        }
    };

    if (questions.length === 0) return null;

    const currentQuestion = questions[currentIndex];
    const selectedAnswer = answers[currentIndex];
    const hasAnswered = selectedAnswer !== undefined;
    const isLastQuestion = currentIndex === questions.length - 1;
    const currentEliminated = eliminatedOptions[currentIndex] || [];
    const badge = difficultyBadge[difficulty] || difficultyBadge.medium;

    return (
        <div className="quiz-page page-wrapper">
            <div className="container quiz-container">
                {/* Top Bar */}
                <div className="quiz-top-bar animate-slide-down">
                    <div className="quiz-top-left">
                        <span className={`badge ${badge.class}`}>{badge.label}</span>
                        <StreakCounter streak={currentStreak} />
                    </div>
                    <Lifelines hasAnswered={hasAnswered} />
                </div>

                {/* Header */}
                <div className="quiz-header">
                    <ProgressBar current={currentIndex} total={questions.length} />
                    <Timer
                        onTimeout={handleTimeout}
                        questionIndex={currentIndex}
                        extraTimeAdded={extraTimeAdded}
                    />
                </div>

                {/* Question */}
                <div className="quiz-body" key={currentIndex}>
                    <QuestionCard
                        question={currentQuestion}
                        selectedAnswer={selectedAnswer}
                        onSelectAnswer={handleSelectAnswer}
                        eliminatedOptions={currentEliminated}
                    />
                </div>

                {/* Footer */}
                <div className="quiz-footer animate-slide-up">
                    <button
                        className={`btn ${isLastQuestion ? 'btn-success' : 'btn-primary'} btn-lg next-btn`}
                        onClick={handleNext}
                        disabled={!hasAnswered}
                    >
                        {isLastQuestion ? (
                            <>
                                <HiTrophy />
                                Finish Quiz
                            </>
                        ) : (
                            <>
                                Next Question
                                <HiArrowRight />
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
