import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { HiOutlineHome, HiOutlineCog6Tooth, HiOutlineTrophy, HiOutlineUser } from 'react-icons/hi2';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from './ThemeToggle';
import './Navbar.css';

export default function Navbar({ darkMode, setDarkMode }) {
    const [mobileOpen, setMobileOpen] = useState(false);
    const location = useLocation();
    const { user } = useAuth();

    const isActive = (path) => location.pathname === path;

    return (
        <nav className="navbar glass-card">
            <div className="navbar-inner container">
                <Link to="/" className="navbar-brand" onClick={() => setMobileOpen(false)}>
                    <span className="brand-icon">⚡</span>
                    <span className="brand-text">BrainSpark</span>
                </Link>

                <button
                    className="mobile-toggle"
                    onClick={() => setMobileOpen(!mobileOpen)}
                    aria-label="Toggle menu"
                >
                    <span className={`hamburger ${mobileOpen ? 'open' : ''}`}>
                        <span></span>
                        <span></span>
                        <span></span>
                    </span>
                </button>

                <div className={`navbar-menu ${mobileOpen ? 'open' : ''}`}>
                    <Link
                        to="/"
                        className={`nav-link ${isActive('/') ? 'active' : ''}`}
                        onClick={() => setMobileOpen(false)}
                    >
                        <HiOutlineHome />
                        <span>Home</span>
                    </Link>
                    <Link
                        to="/leaderboard"
                        className={`nav-link ${isActive('/leaderboard') ? 'active' : ''}`}
                        onClick={() => setMobileOpen(false)}
                    >
                        <HiOutlineTrophy />
                        <span>Leaderboard</span>
                    </Link>
                    {user?.email === 'ak.anumanchipalle@gmail.com' && (
                        <Link
                            to="/admin"
                            className={`nav-link ${isActive('/admin') ? 'active' : ''}`}
                            onClick={() => setMobileOpen(false)}
                        >
                            <HiOutlineCog6Tooth />
                            <span>Admin</span>
                        </Link>
                    )}

                    {user ? (
                        <Link
                            to="/profile"
                            className={`nav-link user-link ${isActive('/profile') ? 'active' : ''}`}
                            onClick={() => setMobileOpen(false)}
                        >
                            <span className="nav-avatar">{user.name.charAt(0).toUpperCase()}</span>
                            <span>{user.name.split(' ')[0]}</span>
                        </Link>
                    ) : (
                        <Link
                            to="/login"
                            className={`nav-link ${isActive('/login') ? 'active' : ''}`}
                            onClick={() => setMobileOpen(false)}
                        >
                            <HiOutlineUser />
                            <span>Sign In</span>
                        </Link>
                    )}

                    <ThemeToggle darkMode={darkMode} setDarkMode={setDarkMode} />
                </div>
            </div>
        </nav>
    );
}
