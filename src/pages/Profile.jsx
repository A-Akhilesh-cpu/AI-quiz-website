import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    HiUser,
    HiTrophy,
    HiChartBar,
    HiFire,
    HiArrowRightOnRectangle,
    HiClock,
    HiCheckCircle,
    HiAcademicCap,
} from 'react-icons/hi2';
import './Profile.css';

const difficultyEmoji = { easy: '🌱', medium: '⚡', hard: '🔥' };

export default function Profile() {
    const navigate = useNavigate();
    const { user, logout, getHistory } = useAuth();

    if (!user) {
        navigate('/login');
        return null;
    }

    const history = getHistory();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const memberSince = new Date(user.createdAt).toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric',
    });

    const avgScore = user.totalQuestions > 0
        ? Math.round((user.totalCorrect / user.totalQuestions) * 100)
        : 0;

    const formatDate = (iso) => {
        const d = new Date(iso);
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="profile-page page-wrapper">
            <div className="container profile-container">
                {/* Profile Header */}
                <div className="profile-header glass-card animate-scale-in">
                    <div className="profile-avatar">
                        <span>{user.name.charAt(0).toUpperCase()}</span>
                    </div>
                    <div className="profile-info">
                        <h1 className="profile-name">{user.name}</h1>
                        <p className="profile-email">{user.email}</p>
                        <p className="profile-since">
                            <HiClock /> Member since {memberSince}
                        </p>
                    </div>
                    <button className="btn btn-secondary btn-sm logout-btn" onClick={handleLogout}>
                        <HiArrowRightOnRectangle /> Logout
                    </button>
                </div>

                {/* Stats Overview */}
                <div className="profile-stats animate-slide-up" style={{ animationDelay: '0.1s' }}>
                    <div className="profile-stat-card glass-card">
                        <div className="stat-icon-wrap primary"><HiAcademicCap /></div>
                        <div className="stat-data">
                            <span className="stat-val">{user.totalQuizzes || 0}</span>
                            <span className="stat-label">Quizzes Taken</span>
                        </div>
                    </div>
                    <div className="profile-stat-card glass-card">
                        <div className="stat-icon-wrap success"><HiCheckCircle /></div>
                        <div className="stat-data">
                            <span className="stat-val">{user.totalCorrect || 0}/{user.totalQuestions || 0}</span>
                            <span className="stat-label">Correct Answers</span>
                        </div>
                    </div>
                    <div className="profile-stat-card glass-card">
                        <div className="stat-icon-wrap warning"><HiTrophy /></div>
                        <div className="stat-data">
                            <span className="stat-val">{user.bestScore || 0}%</span>
                            <span className="stat-label">Best Score</span>
                        </div>
                    </div>
                    <div className="profile-stat-card glass-card">
                        <div className="stat-icon-wrap info"><HiChartBar /></div>
                        <div className="stat-data">
                            <span className="stat-val">{avgScore}%</span>
                            <span className="stat-label">Avg Score</span>
                        </div>
                    </div>
                </div>

                {/* Quiz History */}
                <div className="history-section animate-slide-up" style={{ animationDelay: '0.2s' }}>
                    <h2 className="section-title"><HiClock /> Quiz History</h2>

                    {history.length === 0 ? (
                        <div className="empty-history glass-card">
                            <span className="empty-icon">📋</span>
                            <h3>No History Yet</h3>
                            <p>Complete a quiz to see your history here!</p>
                        </div>
                    ) : (
                        <div className="history-list">
                            {history.map((entry, idx) => (
                                <div
                                    key={idx}
                                    className={`history-item glass-card ${entry.questions ? 'clickable' : ''}`}
                                    onClick={() => entry.id && entry.questions ? navigate(`/history/${entry.id}`) : null}
                                    role={entry.questions ? 'button' : undefined}
                                    tabIndex={entry.questions ? 0 : undefined}
                                >
                                    <div className="history-main">
                                        <div className="history-subject">
                                            {entry.isAI && <span className="ai-tag">AI</span>}
                                            <span className="subject-name">{entry.subject}</span>
                                        </div>
                                        <div className="history-details">
                                            <span>{formatDate(entry.date)}</span>
                                            <span>{difficultyEmoji[entry.difficulty]} {entry.difficulty}</span>
                                        </div>
                                    </div>
                                    <div className="history-score">
                                        <span className="history-percent">{entry.percentage}%</span>
                                        <span className="history-fraction">{entry.correct}/{entry.total}</span>
                                    </div>
                                    {entry.maxStreak > 0 && (
                                        <div className="history-streak">
                                            <HiFire /> ×{entry.maxStreak}
                                        </div>
                                    )}
                                    {entry.questions && (
                                        <span className="history-arrow">View →</span>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
