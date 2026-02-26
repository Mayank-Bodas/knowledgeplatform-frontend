import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css'; // Requires vanilla css tweaks later for dark mode
import api from '../api/api';
import { Sparkles, Loader2, Wand2 } from 'lucide-react';

export const Editor = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditing = Boolean(id);

    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('Tech');
    const [tags, setTags] = useState('');
    const [content, setContent] = useState('');

    const [loading, setLoading] = useState(false);
    const [aiLoading, setAiLoading] = useState(false);
    const [tagLoading, setTagLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (isEditing) {
            const fetchArticle = async () => {
                try {
                    const { data } = await api.get(`/articles/${id}`);
                    setTitle(data.title);
                    setCategory(data.category);
                    setTags(data.tags || '');
                    setContent(data.content);
                } catch (err) {
                    setError('Failed to load article for editing.');
                }
            };
            fetchArticle();
        }
    }, [id, isEditing]);

    const handleSave = async (e) => {
        e.preventDefault();
        if (!title || !content) {
            setError('Title and Content are required.');
            return;
        }
        setLoading(true);
        setError(null);

        const payload = { title, content, category, tags };

        try {
            if (isEditing) {
                await api.put(`/articles/${id}`, payload);
            } else {
                await api.post('/articles', payload);
            }
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to save article.');
            setLoading(false);
        }
    };

    const handleImproveWithAI = async () => {
        if (!content || content.length < 15) {
            setError('Please write some more content before improving with AI.');
            return;
        }

        setAiLoading(true);
        setError(null);
        try {
            // Strip HTML simply for the basic prompt, or send raw if backend handles it
            const strippedContent = content.replace(/<[^>]+>/g, '');
            const { data } = await api.post('/ai/improve', { content: strippedContent });
            // Setting improved result as is (Note backend might clear HTML formatting, we restore it simply)
            setContent(`<p>${data.result.replace(/\n\n/g, '</p><p>')}</p>`);
        } catch (err) {
            setError('Failed to reach AI service.');
        } finally {
            setAiLoading(false);
        }
    };

    const handleSuggestTags = async () => {
        if (!content || content.length < 15) return;

        setTagLoading(true);
        try {
            const strippedContent = content.replace(/<[^>]+>/g, '');
            const { data } = await api.post('/ai/suggest-tags', { content: strippedContent });
            setTags(data.result);
        } catch (err) {
            setError('Failed to suggest tags.');
        } finally {
            setTagLoading(false);
        }
    };

    return (
        <div className="container mt-8" style={{ maxWidth: '900px' }}>
            <div className="flex justify-between items-center mb-4">
                <h1>{isEditing ? 'Edit Article' : 'Write New Article'}</h1>
                <button onClick={handleSave} className="btn btn-primary" disabled={loading}>
                    {loading ? 'Saving...' : (isEditing ? 'Update Published' : 'Publish Article')}
                </button>
            </div>

            {error && <div style={{ padding: '1rem', backgroundColor: 'rgba(248, 81, 73, 0.1)', border: '1px solid var(--danger-color)', color: 'var(--danger-color)', borderRadius: '8px', marginBottom: '1rem' }}>{error}</div>}

            <div className="card">
                <div className="form-group">
                    <label className="form-label">Article Title</label>
                    <input
                        type="text"
                        className="form-input"
                        placeholder="Enter an engaging title..."
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        style={{ fontSize: '1.25rem', padding: '1rem' }}
                    />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                        <label className="form-label">Category</label>
                        <select
                            className="form-input"
                            value={category}
                            onChange={e => setCategory(e.target.value)}
                        >
                            <option value="Tech">Tech</option>
                            <option value="AI">AI</option>
                            <option value="Backend">Backend</option>
                            <option value="Frontend">Frontend</option>
                            <option value="DevOps">DevOps</option>
                        </select>
                    </div>

                    <div className="form-group" style={{ marginBottom: 0 }}>
                        <div className="flex justify-between">
                            <label className="form-label">Tags (comma-separated)</label>
                            <button type="button" onClick={handleSuggestTags} className="btn btn-secondary" style={{ padding: '0.1rem 0.5rem', fontSize: '0.8rem', backgroundColor: 'transparent', border: 'none', color: 'var(--accent-color)' }} disabled={tagLoading}>
                                {tagLoading ? <Loader2 size={12} className="mr-1" style={{ animation: 'spin 1s linear infinite' }} /> : <Wand2 size={12} className="mr-1" />}
                                {tagLoading ? ' Suggesting...' : ' Suggest tags with AI'}
                            </button>
                        </div>
                        <input
                            type="text"
                            className="form-input"
                            placeholder="java, react, api..."
                            value={tags}
                            onChange={e => setTags(e.target.value)}
                        />
                    </div>
                </div>

                <div className="form-group">
                    <div className="flex justify-between items-center mb-2">
                        <label className="form-label" style={{ marginBottom: 0 }}>Content</label>
                        <button
                            type="button"
                            onClick={handleImproveWithAI}
                            className="btn btn-primary"
                            style={{ padding: '0.3rem 0.8rem', fontSize: '0.85rem', backgroundColor: 'rgba(88, 166, 255, 0.15)', color: 'var(--accent-color)', border: '1px solid rgba(88, 166, 255, 0.3)' }}
                            disabled={aiLoading}
                        >
                            {aiLoading ? (
                                <><span style={{ marginRight: '0.5rem' }}>Improving...</span> <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /></>
                            ) : (
                                <><Sparkles size={14} style={{ marginRight: '0.5rem' }} /> Improve with AI</>
                            )}
                        </button>
                    </div>

                    <div className="quill-wrapper">
                        <ReactQuill
                            theme="snow"
                            value={content}
                            onChange={setContent}
                            style={{ height: '400px', marginBottom: '3rem' }}
                            modules={{
                                toolbar: [
                                    [{ 'header': [1, 2, 3, false] }],
                                    ['bold', 'italic', 'underline', 'strike'],
                                    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                                    ['link', 'history'],
                                    ['clean']
                                ],
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};
