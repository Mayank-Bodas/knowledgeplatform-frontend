import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { BookOpen, User, LogOut, PenTool } from 'lucide-react';

const Navbar = () => {
    const { isAuthenticated, logout, user } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav style={styles.nav}>
            <div className="container" style={styles.container}>
                <Link to="/" style={styles.logo}>
                    <BookOpen className="mr-2" size={24} />
                    KnowledgeBase
                </Link>

                <div style={styles.links}>
                    <Link to="/" style={styles.link}>Home</Link>

                    {isAuthenticated ? (
                        <>
                            <Link to="/editor" style={styles.link}>
                                <PenTool size={16} style={{ marginRight: '6px' }} />
                                New Article
                            </Link>
                            <Link to="/dashboard" style={styles.link}>
                                <User size={16} style={{ marginRight: '6px' }} />
                                My Articles
                            </Link>
                            <button onClick={handleLogout} className="btn btn-secondary" style={styles.logoutBtn}>
                                <LogOut size={16} style={{ marginRight: '6px' }} />
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="btn btn-secondary" style={{ marginRight: '1rem' }}>Login</Link>
                            <Link to="/signup" className="btn btn-primary">Sign Up</Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

const styles = {
    nav: {
        backgroundColor: 'var(--bg-secondary)',
        borderBottom: '1px solid var(--border-color)',
        padding: '1rem 0',
        position: 'sticky',
        top: 0,
        zIndex: 100,
    },
    container: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    logo: {
        display: 'flex',
        alignItems: 'center',
        fontSize: '1.25rem',
        fontWeight: '700',
        color: 'var(--text-primary)',
        textDecoration: 'none',
    },
    links: {
        display: 'flex',
        alignItems: 'center',
        gap: '1.5rem',
    },
    link: {
        display: 'flex',
        alignItems: 'center',
        color: 'var(--text-secondary)',
        fontWeight: '500',
        transition: 'color 0.2s ease',
    },
    logoutBtn: {
        padding: '0.4rem 0.8rem',
        display: 'flex',
        alignItems: 'center'
    }
};

export default Navbar;
