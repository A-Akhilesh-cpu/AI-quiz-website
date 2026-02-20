import { createContext, useContext, useReducer } from 'react';

const QuizContext = createContext();

const initialState = {
    questions: [],
    currentIndex: 0,
    answers: {},
    subject: '',
    customTopic: '',
    isAI: false,
    isLoading: false,
    quizStarted: false,
    quizFinished: false,
    difficulty: 'medium',
    // Streak
    currentStreak: 0,
    maxStreak: 0,
    // Lifelines
    lifelines: {
        fiftyFifty: false,   // true = used
        extraTime: false,
        skip: false,
    },
    // 50:50 state — indices of eliminated options per question
    eliminatedOptions: {},
    // Extra time flag for current question
    extraTimeAdded: false,
    // Skipped questions
    skippedQuestions: {},
};

function quizReducer(state, action) {
    switch (action.type) {
        case 'SET_QUESTIONS':
            return {
                ...state,
                questions: action.payload,
                currentIndex: 0,
                answers: {},
                quizStarted: true,
                quizFinished: false,
                isLoading: false,
                currentStreak: 0,
                maxStreak: 0,
                lifelines: { fiftyFifty: false, extraTime: false, skip: false },
                eliminatedOptions: {},
                extraTimeAdded: false,
                skippedQuestions: {},
            };

        case 'SELECT_ANSWER': {
            const question = state.questions[state.currentIndex];
            const isCorrect = action.payload === question.correctAnswer;
            const newStreak = isCorrect ? state.currentStreak + 1 : 0;
            const newMaxStreak = Math.max(state.maxStreak, newStreak);

            return {
                ...state,
                answers: { ...state.answers, [state.currentIndex]: action.payload },
                currentStreak: newStreak,
                maxStreak: newMaxStreak,
            };
        }

        case 'NEXT_QUESTION': {
            const nextIndex = state.currentIndex + 1;
            if (nextIndex >= state.questions.length) {
                return { ...state, quizFinished: true };
            }
            return { ...state, currentIndex: nextIndex, extraTimeAdded: false };
        }

        case 'FINISH_QUIZ':
            return { ...state, quizFinished: true };

        case 'SET_SUBJECT':
            return { ...state, subject: action.payload, customTopic: '', isAI: false };

        case 'SET_CUSTOM_TOPIC':
            return { ...state, customTopic: action.payload, subject: '', isAI: true };

        case 'SET_LOADING':
            return { ...state, isLoading: action.payload };

        case 'SET_DIFFICULTY':
            return { ...state, difficulty: action.payload };

        case 'USE_FIFTY_FIFTY': {
            if (state.lifelines.fiftyFifty) return state;
            const question = state.questions[state.currentIndex];
            const correctIdx = question.correctAnswer;
            // Pick 2 random wrong indices to eliminate
            const wrongIndices = [0, 1, 2, 3].filter(i => i !== correctIdx);
            // Shuffle and take 2
            const shuffled = wrongIndices.sort(() => Math.random() - 0.5);
            const toEliminate = shuffled.slice(0, 2);

            return {
                ...state,
                lifelines: { ...state.lifelines, fiftyFifty: true },
                eliminatedOptions: {
                    ...state.eliminatedOptions,
                    [state.currentIndex]: toEliminate,
                },
            };
        }

        case 'USE_EXTRA_TIME':
            if (state.lifelines.extraTime) return state;
            return {
                ...state,
                lifelines: { ...state.lifelines, extraTime: true },
                extraTimeAdded: true,
            };

        case 'USE_SKIP': {
            if (state.lifelines.skip) return state;
            const updatedAnswers = { ...state.answers, [state.currentIndex]: -2 }; // -2 = skipped
            const nextIdx = state.currentIndex + 1;
            if (nextIdx >= state.questions.length) {
                return {
                    ...state,
                    lifelines: { ...state.lifelines, skip: true },
                    answers: updatedAnswers,
                    skippedQuestions: { ...state.skippedQuestions, [state.currentIndex]: true },
                    quizFinished: true,
                };
            }
            return {
                ...state,
                lifelines: { ...state.lifelines, skip: true },
                answers: updatedAnswers,
                skippedQuestions: { ...state.skippedQuestions, [state.currentIndex]: true },
                currentIndex: nextIdx,
                extraTimeAdded: false,
            };
        }

        case 'TIMEOUT': {
            const updatedAnswers = { ...state.answers, [state.currentIndex]: -1 };
            const nextIdx = state.currentIndex + 1;
            const newStreak = 0;
            if (nextIdx >= state.questions.length) {
                return { ...state, answers: updatedAnswers, quizFinished: true, currentStreak: newStreak };
            }
            return { ...state, answers: updatedAnswers, currentIndex: nextIdx, currentStreak: newStreak, extraTimeAdded: false };
        }

        case 'RESET':
            return { ...initialState };

        default:
            return state;
    }
}

export function QuizProvider({ children }) {
    const [state, dispatch] = useReducer(quizReducer, initialState);

    const getScore = () => {
        let correct = 0;
        let wrong = 0;
        let unanswered = 0;
        let skipped = 0;

        state.questions.forEach((q, index) => {
            const answer = state.answers[index];
            if (answer === -2) {
                skipped++;
            } else if (answer === undefined || answer === -1) {
                unanswered++;
            } else if (answer === q.correctAnswer) {
                correct++;
            } else {
                wrong++;
            }
        });

        const total = state.questions.length;
        const percentage = total > 0 ? Math.round((correct / total) * 100) : 0;

        return { correct, wrong, unanswered, skipped, total, percentage, maxStreak: state.maxStreak };
    };

    // Save to leaderboard
    const saveToLeaderboard = (score) => {
        const entry = {
            subject: state.subject || state.customTopic,
            isAI: state.isAI,
            difficulty: state.difficulty,
            percentage: score.percentage,
            correct: score.correct,
            total: score.total,
            maxStreak: score.maxStreak,
            date: new Date().toISOString(),
        };

        const stored = localStorage.getItem('brainsparkLeaderboard');
        const leaderboard = stored ? JSON.parse(stored) : [];
        leaderboard.unshift(entry);
        // Keep top 20
        localStorage.setItem('brainsparkLeaderboard', JSON.stringify(leaderboard.slice(0, 20)));
    };

    return (
        <QuizContext.Provider value={{ state, dispatch, getScore, saveToLeaderboard }}>
            {children}
        </QuizContext.Provider>
    );
}

export function useQuiz() {
    const context = useContext(QuizContext);
    if (!context) {
        throw new Error('useQuiz must be used within a QuizProvider');
    }
    return context;
}
