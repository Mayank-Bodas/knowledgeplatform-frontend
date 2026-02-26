import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../api/api';
import { ArrowLeft, User, Calendar, Tag, FileText } from 'lucide-react';

export const ArticleDetail = () => {
    const { id } = useParams();
    const [article, setArticle] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchArticle = async () => {
            try {
                const { data } = await api.get(`/articles/${id}`);
                setArticle(data);
            } catch (err) {
                setError('Article not found or failed to load.');
            } finally {
                setLoading(false);
            }
        };
        fetchArticle();
    }, [id]);

    if (loading) return <div className="container mt-8">Loading article...</div>;
    if (error) return <div className="container mt-8"><div className="card text-center" style={{ padding: '3rem' }}><p className="text-danger">{error}</p><Link to="/" className="btn btn-primary mt-4">Back Home</Link></div></div>;
    if (!article) return null;

    const tags = article.tags ? article.tags.split(',').map(t => t.trim()).filter(Boolean) : [];

    return (
        <div className="container mt-8" style={{ maxWidth: '800px' }}>
            <button onClick={() => navigate(-1)} className="btn btn-secondary mb-4" style={{ padding: '0.4rem 0.8rem' }}>
                <ArrowLeft size={16} className="mr-2" style={{ marginRight: '0.5rem' }} /> Back
            </button>

            <div className="card" style={{ padding: '2rem' }}>
                <div style={{ display: 'inline-block', backgroundColor: 'rgba(88, 166, 255, 0.1)', color: 'var(--accent-color)', padding: '0.3rem 0.8rem', borderRadius: '16px', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '1rem', textTransform: 'uppercase' }}>
                    {article.category}
                </div>

                <h1 style={{ fontSize: '2.5rem', marginBottom: '1.5rem', lineHeight: '1.2' }}>{article.title}</h1>

                {article.summary && (
                    <div style={{ backgroundColor: 'var(--bg-tertiary)', padding: '1rem', borderLeft: '4px solid var(--accent-color)', borderRadius: '4px', marginBottom: '2rem', fontStyle: 'italic', color: 'var(--text-secondary)' }}>
                        <strong>AI Summary:</strong> {article.summary}
                    </div>
                )}

                <div style={{ display: 'flex', gap: '1.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '2rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border-color)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <User size={16} /> {article.authorName}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Calendar size={16} /> {new Date(article.createdAt).toLocaleDateString()}
                    </div>
                    {tags.length > 0 && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Tag size={16} /> {tags.join(', ')}
                        </div>
                    )}
                </div>

                <div
                    className="article-content"
                    dangerouslySetInnerHTML={{ __html: article.content }}
                    style={{ fontSize: '1.1rem', lineHeight: '1.8', color: 'var(--text-primary)', overflowWrap: 'break-word', wordBreak: 'break-word' }}
                />
            </div>
        </div>
    );
};
