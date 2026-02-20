import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { HiBolt, HiEnvelope, HiLockClosed, HiUser, HiEye, HiEyeSlash, HiCheckCircle, HiXCircle } from 'react-icons/hi2';
import './Auth.css';

function getPasswordStrength(password) {
    if (!password) return { score: 0, label: '', class: '' };

    let score = 0;
    const checks = {
        length: password.length >= 8,
        lowercase: /[a-z]/.test(password),
        uppercase: /[A-Z]/.test(password),
        number: /\d/.test(password),
        special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
    };

    Object.values(checks).forEach(v => { if (v) score++; });

    if (score <= 2) return { score, label: 'Weak', class: 'weak', checks };
    if (score <= 3) return { score, label: 'Fair', class: 'fair', checks };
    if (score <= 4) return { score, label: 'Good', class: 'good', checks };
    return { score, label: 'Strong', class: 'strong', checks };
}

function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default function Register() {
    const navigate = useNavigate();
    const { register } = useAuth();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [touched, setTouched] = useState({});

    const strength = getPasswordStrength(password);
    const emailValid = validateEmail(email);
    const passwordsMatch = password && confirmPassword && password === confirmPassword;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setTouched({ name: true, email: true, password: true, confirm: true });

        if (!name.trim()) {
            setError('Please enter your full name.');
            return;
        }

        if (!email.trim() || !emailValid) {
            setError('Please enter a valid email address.');
            return;
        }

        if (password.length < 8) {
            setError('Password must be at least 8 characters.');
            return;
        }

        if (strength.score < 3) {
            setError('Password is too weak. Add uppercase, numbers, or special characters.');
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        setIsLoading(true);
        try {
            await new Promise(r => setTimeout(r, 400));
            register(name, email, password);
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
                    <h1>Create Account</h1>
                    <p>Join BrainSpark and start learning</p>
                </div>

                <form onSubmit={handleSubmit} className="auth-form">
                    {/* Name */}
                    <div className="auth-input-group">
                        <label>Full Name</label>
                        <div className="auth-input-wrapper">
                            <HiUser className="input-icon" />
                            <input
                                type="text"
                                placeholder="John Doe"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                onBlur={() => setTouched(t => ({ ...t, name: true }))}
                                autoComplete="name"
                                className={touched.name && !name.trim() ? 'input-error' : ''}
                            />
                        </div>
                    </div>

                    {/* Email */}
                    <div className="auth-input-group">
                        <label>Email</label>
                        <div className="auth-input-wrapper">
                            <HiEnvelope className="input-icon" />
                            <input
                                type="email"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                onBlur={() => setTouched(t => ({ ...t, email: true }))}
                                autoComplete="email"
                                className={touched.email && email && !emailValid ? 'input-error' : ''}
                            />
                            {touched.email && email && (
                                <span className={`validation-icon ${emailValid ? 'valid' : 'invalid'}`}>
                                    {emailValid ? <HiCheckCircle /> : <HiXCircle />}
                                </span>
                            )}
                        </div>
                        {touched.email && email && !emailValid && (
                            <span className="field-hint error">Enter a valid email address</span>
                        )}
                    </div>

                    {/* Password */}
                    <div className="auth-input-group">
                        <label>Password</label>
                        <div className="auth-input-wrapper">
                            <HiLockClosed className="input-icon" />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Min. 8 characters"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                onBlur={() => setTouched(t => ({ ...t, password: true }))}
                                autoComplete="new-password"
                            />
                            <button
                                type="button"
                                className="toggle-password"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <HiEyeSlash /> : <HiEye />}
                            </button>
                        </div>

                        {/* Password Strength Bar */}
                        {password && (
                            <div className="password-strength animate-fade-in">
                                <div className="strength-bar">
                                    <div
                                        className={`strength-fill ${strength.class}`}
                                        style={{ width: `${(strength.score / 5) * 100}%` }}
                                    />
                                </div>
                                <span className={`strength-label ${strength.class}`}>{strength.label}</span>
                            </div>
                        )}

                        {/* Password Requirements */}
                        {password && strength.checks && (
                            <div className="password-checks animate-fade-in">
                                <div className={`check-item ${strength.checks.length ? 'pass' : 'fail'}`}>
                                    {strength.checks.length ? <HiCheckCircle /> : <HiXCircle />} 8+ characters
                                </div>
                                <div className={`check-item ${strength.checks.uppercase ? 'pass' : 'fail'}`}>
                                    {strength.checks.uppercase ? <HiCheckCircle /> : <HiXCircle />} Uppercase letter
                                </div>
                                <div className={`check-item ${strength.checks.number ? 'pass' : 'fail'}`}>
                                    {strength.checks.number ? <HiCheckCircle /> : <HiXCircle />} Number
                                </div>
                                <div className={`check-item ${strength.checks.special ? 'pass' : 'fail'}`}>
                                    {strength.checks.special ? <HiCheckCircle /> : <HiXCircle />} Special character
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Confirm Password */}
                    <div className="auth-input-group">
                        <label>Confirm Password</label>
                        <div className="auth-input-wrapper">
                            <HiLockClosed className="input-icon" />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Re-enter password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                onBlur={() => setTouched(t => ({ ...t, confirm: true }))}
                                autoComplete="new-password"
                                className={touched.confirm && confirmPassword && !passwordsMatch ? 'input-error' : ''}
                            />
                            {touched.confirm && confirmPassword && (
                                <span className={`validation-icon ${passwordsMatch ? 'valid' : 'invalid'}`}>
                                    {passwordsMatch ? <HiCheckCircle /> : <HiXCircle />}
                                </span>
                            )}
                        </div>
                        {touched.confirm && confirmPassword && !passwordsMatch && (
                            <span className="field-hint error">Passwords do not match</span>
                        )}
                    </div>

                    {error && <div className="auth-error animate-fade-in">{error}</div>}

                    <button type="submit" className="btn btn-primary btn-lg auth-submit" disabled={isLoading}>
                        {isLoading ? (
                            <>
                                <span className="spinner spinner-sm"></span>
                                Creating Account...
                            </>
                        ) : (
                            'Create Account'
                        )}
                    </button>
                </form>

                <div className="auth-footer">
                    <p>Already have an account? <Link to="/login">Sign in</Link></p>
                </div>
            </div>
        </div>
    );
}
