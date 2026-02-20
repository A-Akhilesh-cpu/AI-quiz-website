import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { HiBolt, HiEnvelope, HiLockClosed, HiEye, HiEyeSlash } from 'react-icons/hi2';
import './Auth.css';

export default function Login() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!email.trim() || !password) {
            setError('Please fill in all fields.');
            return;
        }

        setIsLoading(true);
        try {
            // Small delay for UX feel
            await new Promise(r => setTimeout(r, 400));
            login(email, password);
            navigate('/');
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="auth-page page-wrapper">
            <div className="auth-bg">
                <div className="blob blob-1"></div>
                <div className="blob blob-2"></div>
            </div>

            <div className="auth-card glass-card animate-scale-in">
                <div className="auth-header">
                    <div className="auth-logo">
                        <HiBolt />
                    </div>
                    <h1>Welcome Back</h1>
                    <p>Sign in to continue to BrainSpark</p>
                </div>

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="auth-input-group">
                        <label>Email</label>
                        <div className="auth-input-wrapper">
                            <HiEnvelope className="input-icon" />
                            <input
                                type="email"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                autoComplete="email"
                            />
                        </div>
                    </div>

                    <div className="auth-input-group">
                        <label>Password</label>
                        <div className="auth-input-wrapper">
                            <HiLockClosed className="input-icon" />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                autoComplete="current-password"
                            />
                            <button
                                type="button"
                                className="toggle-password"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <HiEyeSlash /> : <HiEye />}
                            </button>
                        </div>
                    </div>

                    {error && <div className="auth-error animate-fade-in">{error}</div>}

                    <button type="submit" className="btn btn-primary btn-lg auth-submit" disabled={isLoading}>
                        {isLoading ? (
                            <>
                                <span className="spinner spinner-sm"></span>
                                Signing in...
                            </>
                        ) : (
                            'Sign In'
                        )}
                    </button>
                </form>

                <div className="auth-footer">
                    <p>Don't have an account? <Link to="/register">Create one</Link></p>
                </div>
            </div>
        </div>
    );
}
