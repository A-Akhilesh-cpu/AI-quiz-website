import './DifficultySelector.css';

const difficulties = [
    { value: 'easy', label: 'Easy', icon: '🌱', color: 'var(--success)' },
    { value: 'medium', label: 'Medium', icon: '⚡', color: 'var(--warning)' },
    { value: 'hard', label: 'Hard', icon: '🔥', color: 'var(--danger)' },
];

export default function DifficultySelector({ difficulty, setDifficulty }) {
    return (
        <div className="difficulty-selector">
            <label className="difficulty-label">Difficulty</label>
            <div className="difficulty-options">
                {difficulties.map(d => (
                    <button
                        key={d.value}
                        className={`difficulty-btn ${difficulty === d.value ? 'active' : ''}`}
                        onClick={() => setDifficulty(d.value)}
                        style={difficulty === d.value ? { '--active-color': d.color } : {}}
                    >
                        <span className="difficulty-icon">{d.icon}</span>
                        <span className="difficulty-name">{d.label}</span>
                    </button>
                ))}
            </div>
        </div>
    );
}
