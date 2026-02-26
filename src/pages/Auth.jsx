import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/api';
import { AuthContext } from '../context/AuthContext';
import { User, Lock, Mail } from 'lucide-react';

export const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const { data } = await api.post('/auth/login', { email, password });
            login(data.token, data.email, data.username);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-8 flex items-center justify-center p-4">
            <div className="card" style={{ maxWidth: '400px', width: '100%' }}>
                <h2 className="text-center" style={{ marginBottom: '1.5rem', textAlign: 'center' }}>Welcome Back</h2>
                {error && <div style={styles.errorBanner}>{error}</div>}

                <form onSubmit={handleLogin}>
                    <div className="form-group">
                        <label className="form-label">Email</label>
                        <div style={styles.inputWrapper}>
                            <Mail style={styles.inputIcon} size={18} />
                            <input
                                type="email"
                                className="form-input"
                                style={{ paddingLeft: '2.5rem' }}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                    <div className="form-group">
                        <label className="form-label">Password</label>
                        <div style={styles.inputWrapper}>
                            <Lock style={styles.inputIcon} size={18} />
                            <input
                                type="password"
                                className="form-input"
                                style={{ paddingLeft: '2.5rem' }}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                    <button type="submit" className="btn btn-primary w-full" disabled={loading}>
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>
                <p style={{ marginTop: '1.5rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                    Don't have an account? <Link to="/signup" style={{ color: 'var(--accent-color)' }}>Sign up</Link>
                </p>
            </div>
        </div>
    );
};

export const Signup = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await api.post('/auth/signup', { username, email, password });
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.message || 'Signup failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-8 flex items-center justify-center p-4">
            <div className="card" style={{ maxWidth: '400px', width: '100%' }}>
                <h2 className="text-center" style={{ marginBottom: '1.5rem', textAlign: 'center' }}>Create Account</h2>
                {error && <div style={styles.errorBanner}>{error}</div>}

                <form onSubmit={handleSignup}>
                    <div className="form-group">
                        <label className="form-label">Username</label>
                        <div style={styles.inputWrapper}>
                            <User style={styles.inputIcon} size={18} />
                            <input
                                type="text"
                                className="form-input"
                                style={{ paddingLeft: '2.5rem' }}
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                    <div className="form-group">
                        <label className="form-label">Email</label>
                        <div style={styles.inputWrapper}>
                            <Mail style={styles.inputIcon} size={18} />
                            <input
                                type="email"
                                className="form-input"
                                style={{ paddingLeft: '2.5rem' }}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                    <div className="form-group">
                        <label className="form-label">Password</label>
                        <div style={styles.inputWrapper}>
                            <Lock style={styles.inputIcon} size={18} />
                            <input
                                type="password"
                                className="form-input"
                                style={{ paddingLeft: '2.5rem' }}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                    <button type="submit" className="btn btn-primary w-full" disabled={loading}>
                        {loading ? 'Creating account...' : 'Sign Up'}
                    </button>
                </form>
                <p style={{ marginTop: '1.5rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                    Already have an account? <Link to="/login" style={{ color: 'var(--accent-color)' }}>Sign in</Link>
                </p>
            </div>
        </div>
    );
};

const styles = {
    inputWrapper: {
        position: 'relative',
        display: 'flex',
        alignItems: 'center'
    },
    inputIcon: {
        position: 'absolute',
        left: '0.75rem',
        color: 'var(--text-secondary)'
    },
    errorBanner: {
        padding: '0.75rem',
        backgroundColor: 'rgba(248, 81, 73, 0.1)',
        border: '1px solid var(--danger-color)',
        color: 'var(--danger-color)',
        borderRadius: 'var(--border-radius)',
        marginBottom: '1rem',
        fontSize: '0.875rem'
    }
};
