import './StreakCounter.css';

export default function StreakCounter({ streak }) {
    if (streak === 0) return null;

    const getStreakLevel = () => {
        if (streak >= 7) return { label: 'INFERNO', class: 'inferno', emojis: '🔥🔥🔥' };
        if (streak >= 5) return { label: 'ON FIRE', class: 'fire', emojis: '🔥🔥' };
        if (streak >= 3) return { label: 'HOT', class: 'hot', emojis: '🔥' };
        return { label: 'STREAK', class: 'warm', emojis: '✨' };
    };

    const level = getStreakLevel();

    return (
        <div className={`streak-counter ${level.class}`}>
            <span className="streak-emojis">{level.emojis}</span>
            <span className="streak-number">×{streak}</span>
            <span className="streak-label">{level.label}</span>
        </div>
    );
}
