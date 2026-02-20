import { useQuiz } from '../context/QuizContext';
import { HiScissors, HiClock, HiForward } from 'react-icons/hi2';
import './Lifelines.css';

export default function Lifelines({ hasAnswered }) {
    const { state, dispatch } = useQuiz();
    const { lifelines } = state;

    const handleFiftyFifty = () => {
        if (!lifelines.fiftyFifty && !hasAnswered) {
            dispatch({ type: 'USE_FIFTY_FIFTY' });
        }
    };

    const handleExtraTime = () => {
        if (!lifelines.extraTime && !hasAnswered) {
            dispatch({ type: 'USE_EXTRA_TIME' });
        }
    };

    const handleSkip = () => {
        if (!lifelines.skip) {
            dispatch({ type: 'USE_SKIP' });
        }
    };

    return (
        <div className="lifelines">
            <span className="lifelines-label">Lifelines</span>
            <div className="lifelines-row">
                <button
                    className={`lifeline-btn ${lifelines.fiftyFifty ? 'used' : ''}`}
                    onClick={handleFiftyFifty}
                    disabled={lifelines.fiftyFifty || hasAnswered}
                    title="50:50 — Remove 2 wrong options"
                >
                    <span className="lifeline-icon"><HiScissors /></span>
                    <span className="lifeline-name">50:50</span>
                </button>

                <button
                    className={`lifeline-btn ${lifelines.extraTime ? 'used' : ''}`}
                    onClick={handleExtraTime}
                    disabled={lifelines.extraTime || hasAnswered}
                    title="Extra Time — Add 15 seconds"
                >
                    <span className="lifeline-icon"><HiClock /></span>
                    <span className="lifeline-name">+15s</span>
                </button>

                <button
                    className={`lifeline-btn ${lifelines.skip ? 'used' : ''}`}
                    onClick={handleSkip}
                    disabled={lifelines.skip}
                    title="Skip — Skip without penalty"
                >
                    <span className="lifeline-icon"><HiForward /></span>
                    <span className="lifeline-name">Skip</span>
                </button>
            </div>
        </div>
    );
}
