import { useState, useEffect } from 'react';
import './Timer.css';

const BASE_TIME = 30;

export default function Timer({ onTimeout, questionIndex, extraTimeAdded }) {
    const [timeLeft, setTimeLeft] = useState(BASE_TIME);

    useEffect(() => {
        setTimeLeft(BASE_TIME);
    }, [questionIndex]);

    // Handle extra time lifeline
    useEffect(() => {
        if (extraTimeAdded) {
            setTimeLeft(prev => prev + 15);
        }
    }, [extraTimeAdded]);

    useEffect(() => {
        if (timeLeft <= 0) {
            onTimeout();
            return;
        }

        const interval = setInterval(() => {
            setTimeLeft(prev => prev - 1);
        }, 1000);

        return () => clearInterval(interval);
    }, [timeLeft, onTimeout]);

    const maxTime = extraTimeAdded ? BASE_TIME + 15 : BASE_TIME;
    const percentage = (timeLeft / maxTime) * 100;
    const radius = 28;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    const getColor = () => {
        if (timeLeft > 20) return 'var(--success)';
        if (timeLeft > 10) return 'var(--warning)';
        return 'var(--danger)';
    };

    return (
        <div className={`timer ${timeLeft <= 5 ? 'timer-critical' : ''}`}>
            <svg className="timer-ring" viewBox="0 0 64 64">
                <circle
                    className="timer-ring-bg"
                    cx="32"
                    cy="32"
                    r={radius}
                    fill="none"
                    strokeWidth="4"
                />
                <circle
                    className="timer-ring-progress"
                    cx="32"
                    cy="32"
                    r={radius}
                    fill="none"
                    strokeWidth="4"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    style={{ stroke: getColor() }}
                />
            </svg>
            <span className="timer-text" style={{ color: getColor() }}>
                {timeLeft}
            </span>
        </div>
    );
}
