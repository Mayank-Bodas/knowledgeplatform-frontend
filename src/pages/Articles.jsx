import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/api';
import { AuthContext } from '../context/AuthContext';
import { Search, Filter, Edit, Trash2 } from 'lucide-react';

export const ArticleGrid = ({ articles, isDashboard = false, onDelete }) => (
    <div style={styles.grid}>
        {articles.map(article => (
            <div key={article.id} className="card" style={styles.card}>
                <div style={styles.cardHeader}>
                    <span style={styles.category}>{article.category}</span>
                    <span style={styles.date}>{new Date(article.createdAt).toLocaleDateString()}</span>
                </div>
                <h3 style={{ margin: '0.5rem 0' }}>{article.title}</h3>
                {article.summary ? (
                    <p style={styles.summary}>{article.summary}</p>
                ) : (
                    <p style={styles.summary}>{article.content.replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').substring(0, 100)}...</p>
                )}

                <div style={styles.cardFooter}>
                    <span style={styles.author}>By {article.authorName}</span>

                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <Link to={`/article/${article.id}`} className="btn btn-secondary" style={{ padding: '0.3rem 0.6rem', fontSize: '0.85rem' }}>Read</Link>

                        {isDashboard && (
                            <>
                                <Link to={`/editor/${article.id}`} className="btn btn-secondary" style={{ padding: '0.3rem 0.6rem', fontSize: '0.85rem' }}>
                                    <Edit size={14} />
                                </Link>
                                <button onClick={() => onDelete(article.id)} className="btn btn-danger" style={{ padding: '0.3rem 0.6rem', fontSize: '0.85rem' }}>
                                    <Trash2 size={14} />
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        ))}
    </div>
);

export const Home = () => {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [keyword, setKeyword] = useState('');
    const [category, setCategory] = useState('');

    const fetchArticles = async () => {
        setLoading(true);
        try {
            let url = '/articles';
            const params = new URLSearchParams();
            if (keyword) params.append('keyword', keyword);
            if (category) params.append('category', category);

            const paramStr = params.toString();
            if (paramStr) url += `?${paramStr}`;

            const { data } = await api.get(url);
            setArticles(data);
        } catch (err) {
            console.error('Failed to fetch articles', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchArticles();
    }, [category]);

    const handleSearch = (e) => {
        e.preventDefault();
        fetchArticles();
    };

    return (
        <div className="container mt-8">
            <div className="flex justify-between items-center mb-4" style={{ flexWrap: 'wrap', gap: '1rem' }}>
                <h1>Discover Articles</h1>

                <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.5rem', flexGrow: 1, maxWidth: '600px' }}>
                    <div style={{ position: 'relative', flexGrow: 1 }}>
                        <Search size={18} style={{ position: 'absolute', left: '0.75rem', top: '0.85rem', color: 'var(--text-secondary)' }} />
                        <input
                            type="text"
                            placeholder="Search title, content, or tags..."
                            className="form-input"
                            style={{ paddingLeft: '2.5rem' }}
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                        />
                    </div>
                    <div style={{ position: 'relative', minWidth: '150px' }}>
                        <Filter size={18} style={{ position: 'absolute', left: '0.75rem', top: '0.85rem', color: 'var(--text-secondary)' }} />
                        <select
                            className="form-input"
                            style={{ paddingLeft: '2.5rem', appearance: 'none' }}
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                        >
                            <option value="">All Categories</option>
                            <option value="Tech">Tech</option>
                            <option value="AI">AI</option>
                            <option value="Backend">Backend</option>
                            <option value="Frontend">Frontend</option>
                            <option value="DevOps">DevOps</option>
                        </select>
                    </div>
                    <button type="submit" className="btn btn-primary">Search</button>
                </form>
            </div>

            {loading ? (
                <p>Loading articles...</p>
            ) : articles.length === 0 ? (
                <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
                    <p style={{ color: 'var(--text-secondary)' }}>No articles found matching your criteria.</p>
                </div>
            ) : (
                <ArticleGrid articles={articles} />
            )}
        </div>
    );
};

export const Dashboard = () => {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useContext(AuthContext);

    useEffect(() => {
        const fetchMyArticles = async () => {
            try {
                // Technically backend sends all articles, we'll filter client side for now, 
                // or ideal would be a dedicated /api/articles/me endpoint.
                const { data } = await api.get('/articles');
                // Filter by logged-in user's username (or email prefix as fallback)
                const myArticles = data.filter(a =>
                    a.authorName === user?.username ||
                    a.authorName === user?.email?.split('@')[0]
                );
                setArticles(myArticles);
            } catch (err) {
                console.error('Failed to fetch dashboard articles', err);
            } finally {
                setLoading(false);
            }
        };

        if (user) fetchMyArticles();
    }, [user]);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this article?')) {
            try {
                await api.delete(`/articles/${id}`);
                setArticles(articles.filter(a => a.id !== id));
            } catch (err) {
                alert('Failed to delete article.');
            }
        }
    };

    return (
        <div className="container mt-8">
            <div className="flex justify-between items-center mb-4">
                <h1>My Articles</h1>
                <Link to="/editor" className="btn btn-primary">Write New Article</Link>
            </div>

            {loading ? (
                <p>Loading your articles...</p>
            ) : articles.length === 0 ? (
                <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
                    <p style={{ color: 'var(--text-secondary)' }}>You haven't written any articles yet.</p>
                    <Link to="/editor" className="btn btn-primary mt-4">Create your first article</Link>
                </div>
            ) : (
                <ArticleGrid articles={articles} isDashboard={true} onDelete={handleDelete} />
            )}
        </div>
    );
};

const styles = {
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
        gap: '1.5rem',
    },
    card: {
        display: 'flex',
        flexDirection: 'column',
    },
    cardHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '0.5rem',
    },
    category: {
        backgroundColor: 'rgba(88, 166, 255, 0.1)',
        color: 'var(--accent-color)',
        padding: '0.2rem 0.6rem',
        borderRadius: '12px',
        fontSize: '0.75rem',
        fontWeight: '600',
        textTransform: 'uppercase',
    },
    date: {
        fontSize: '0.8rem',
        color: 'var(--text-secondary)',
    },
    summary: {
        color: 'var(--text-secondary)',
        fontSize: '0.95rem',
        flexGrow: 1,
        marginBottom: '1.5rem',
    },
    cardFooter: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTop: '1px solid var(--border-color)',
        paddingTop: '1rem',
        marginTop: 'auto',
    },
    author: {
        fontSize: '0.85rem',
        fontWeight: '500',
        color: 'var(--text-primary)',
    }
};
