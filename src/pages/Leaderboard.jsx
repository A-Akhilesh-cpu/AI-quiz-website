import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiTrophy, HiTrash, HiFire } from 'react-icons/hi2';
import './Leaderboard.css';

const difficultyEmoji = { easy: '🌱', medium: '⚡', hard: '🔥' };

function getRankBadge(index) {
    if (index === 0) return { emoji: '🥇', class: 'gold' };
    if (index === 1) return { emoji: '🥈', class: 'silver' };
    if (index === 2) return { emoji: '🥉', class: 'bronze' };
    return { emoji: `#${index + 1}`, class: '' };
}

export default function Leaderboard() {
    const [entries, setEntries] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const stored = localStorage.getItem('brainsparkLeaderboard');
        if (stored) {
            const parsed = JSON.parse(stored);
            // Sort by percentage descending
            parsed.sort((a, b) => b.percentage - a.percentage);
            setEntries(parsed);
        }
    }, []);

    const clearLeaderboard = () => {
        if (confirm('Clear all leaderboard data?')) {
            localStorage.removeItem('brainsparkLeaderboard');
            setEntries([]);
        }
    };

    const formatDate = (iso) => {
        const d = new Date(iso);
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    const handleEntryClick = (entry) => {
        if (entry.id && entry.questions) {
            navigate(`/history/${entry.id}`, { state: { fromLeaderboard: true, entry } });
        }
    };

    return (
        <div className="leaderboard-page page-wrapper">
            <div className="container leaderboard-container">
                <div className="leaderboard-header animate-slide-down">
                    <div>
                        <h1 className="leaderboard-title">
                            <HiTrophy /> Leaderboard
                        </h1>
                        <p className="leaderboard-subtitle">Your best quiz performances</p>
                    </div>
                    {entries.length > 0 && (
                        <button className="btn btn-secondary btn-sm" onClick={clearLeaderboard}>
                            <HiTrash /> Clear
                        </button>
                    )}
                </div>

                {entries.length === 0 ? (
                    <div className="empty-leaderboard glass-card animate-scale-in">
                        <span className="empty-icon">🏆</span>
                        <h3>No Scores Yet</h3>
                        <p>Complete a quiz to see your results here!</p>
                    </div>
                ) : (
                    <div className="leaderboard-list">
                        {entries.map((entry, index) => {
                            const rank = getRankBadge(index);
                            const isClickable = entry.id && entry.questions;
                            return (
                                <div
                                    key={index}
                                    className={`leaderboard-row glass-card animate-slide-up ${rank.class} ${isClickable ? 'clickable' : ''}`}
                                    style={{ animationDelay: `${index * 0.05}s`, cursor: isClickable ? 'pointer' : 'default' }}
                                    onClick={() => handleEntryClick(entry)}
                                    role={isClickable ? 'button' : undefined}
                                    tabIndex={isClickable ? 0 : undefined}
                                >
                                    <div className="rank-cell">
                                        <span className={`rank-badge ${rank.class}`}>{rank.emoji}</span>
                                    </div>

                                    <div className="entry-info">
                                        <div className="entry-subject">
                                            {entry.isAI && <span className="ai-tag">AI</span>}
                                            <span className="subject-text">{entry.subject}</span>
                                        </div>
                                        <div className="entry-meta">
                                            <span className="entry-date">{formatDate(entry.date)}</span>
                                            <span className="entry-difficulty">
                                                {difficultyEmoji[entry.difficulty] || '⚡'} {entry.difficulty}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="entry-stats">
                                        <div className="entry-score">
                                            <span className="score-big">{entry.percentage}%</span>
                                            <span className="score-detail">{entry.correct}/{entry.total}</span>
                                        </div>
                                        {entry.maxStreak > 0 && (
                                            <div className="entry-streak">
                                                <HiFire className="streak-icon" />
                                                <span>×{entry.maxStreak}</span>
                                            </div>
                                        )}
                                    </div>
                                    {isClickable && (
                                        <span className="leaderboard-arrow">View →</span>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
