import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiSparkles, HiPlay, HiAcademicCap, HiLightBulb, HiBolt } from 'react-icons/hi2';
import { useQuiz } from '../context/QuizContext';
import { getQuestionsBySubject, getSubjects } from '../data/questions';
import { generateQuestions } from '../services/aiService';
import DifficultySelector from '../components/DifficultySelector';
import './Home.css';

export default function Home() {
    const navigate = useNavigate();
    const { state, dispatch } = useQuiz();
    const [selectedSubject, setSelectedSubject] = useState('');
    const [customTopic, setCustomTopic] = useState('');
    const [isAiMode, setIsAiMode] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [difficulty, setDifficulty] = useState(state.difficulty || 'medium');

    const subjects = getSubjects();

    const handleStartQuiz = async () => {
        setError('');
        dispatch({ type: 'SET_DIFFICULTY', payload: difficulty });

        if (isAiMode) {
            if (!customTopic.trim()) {
                setError('Please enter a topic to generate questions.');
                return;
            }

            setIsLoading(true);
            dispatch({ type: 'SET_LOADING', payload: true });

            try {
                const questions = await generateQuestions(customTopic.trim(), 10, difficulty);
                dispatch({ type: 'SET_CUSTOM_TOPIC', payload: customTopic.trim() });
                dispatch({ type: 'SET_QUESTIONS', payload: questions });
                navigate('/quiz');
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
                dispatch({ type: 'SET_LOADING', payload: false });
            }
        } else {
            if (!selectedSubject) {
                setError('Please select a subject.');
                return;
            }

            const questions = getQuestionsBySubject(selectedSubject);
            if (questions.length === 0) {
                setError('No questions found for this subject.');
                return;
            }

            dispatch({ type: 'SET_SUBJECT', payload: selectedSubject });
            dispatch({ type: 'SET_QUESTIONS', payload: questions });
            navigate('/quiz');
        }
    };

    return (
        <div className="home-page page-wrapper">
            <div className="hero-bg">
                <div className="blob blob-1"></div>
                <div className="blob blob-2"></div>
                <div className="blob blob-3"></div>
            </div>

            <div className="container home-container">
                <div className="hero animate-slide-up">
                    <div className="hero-badge badge badge-primary">
                        <HiBolt /> AI-Powered Quiz Platform
                    </div>
                    <h1 className="hero-title">
                        Ignite Your Mind<br />
                        <span className="gradient-text">With BrainSpark</span>
                    </h1>
                    <p className="hero-subtitle">
                        Challenge yourself with curated quizzes or AI-generated questions. Use lifelines, build streaks, and climb the leaderboard.
                    </p>
                </div>

                <div className="setup-card glass-card animate-slide-up" style={{ animationDelay: '0.15s' }}>
                    <div className="mode-toggle">
                        <button
                            className={`mode-btn ${!isAiMode ? 'active' : ''}`}
                            onClick={() => { setIsAiMode(false); setError(''); }}
                        >
                            <HiAcademicCap />
                            <span>Choose Subject</span>
                        </button>
                        <button
                            className={`mode-btn ${isAiMode ? 'active' : ''}`}
                            onClick={() => { setIsAiMode(true); setError(''); }}
                        >
                            <HiSparkles />
                            <span>AI Generate</span>
                        </button>
                    </div>

                    {!isAiMode ? (
                        <div className="input-group">
                            <label className="input-label">Select a Subject</label>
                            <select
                                className="select-field"
                                value={selectedSubject}
                                onChange={(e) => setSelectedSubject(e.target.value)}
                            >
                                <option value="">Choose a subject...</option>
                                {subjects.map(subject => (
                                    <option key={subject} value={subject}>{subject}</option>
                                ))}
                            </select>
                        </div>
                    ) : (
                        <div className="input-group">
                            <label className="input-label">
                                <HiLightBulb className="label-icon" />
                                Enter any topic for AI-generated questions
                            </label>
                            <input
                                type="text"
                                className="input-field"
                                placeholder='e.g., "Pointers in C", "World War II", "Machine Learning"'
                                value={customTopic}
                                onChange={(e) => setCustomTopic(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleStartQuiz()}
                            />
                        </div>
                    )}

                    <DifficultySelector difficulty={difficulty} setDifficulty={setDifficulty} />

                    {error && (
                        <div className="error-msg animate-fade-in">{error}</div>
                    )}

                    <button
                        className="btn btn-primary btn-lg start-btn"
                        onClick={handleStartQuiz}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <span className="spinner spinner-sm"></span>
                                Generating Questions...
                            </>
                        ) : (
                            <>
                                <HiPlay />
                                Start Quiz
                            </>
                        )}
                    </button>
                </div>

                <div className="features animate-slide-up" style={{ animationDelay: '0.3s' }}>
                    <div className="feature-card glass-card">
                        <span className="feature-icon">🛟</span>
                        <h3>Lifelines</h3>
                        <p>Use 50:50, Extra Time, or Skip to survive tough questions</p>
                    </div>
                    <div className="feature-card glass-card">
                        <span className="feature-icon">🔥</span>
                        <h3>Streak System</h3>
                        <p>Build answer streaks and unlock fire multipliers</p>
                    </div>
                    <div className="feature-card glass-card">
                        <span className="feature-icon">🏆</span>
                        <h3>Leaderboard</h3>
                        <p>Track your best scores and compete with yourself</p>
                    </div>
                    <div className="feature-card glass-card">
                        <span className="feature-icon">🤖</span>
                        <h3>AI Generation</h3>
                        <p>Quiz on any topic — AI creates questions instantly</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
