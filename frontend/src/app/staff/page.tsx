"use client";

import { useState, useEffect } from 'react';

// Define TS Interfaces
interface Company { id: number; name: string; }
interface JobRole { id: number; title: string; requiredSkills: string; companyId: number; }
interface Application {
    id: number; applicantName: string; applicantEmail: string; aiScore: number;
    extractedSkills: string; humanScore: number; humanFeedback: string; appDate: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export default function StaffPortal() {
    const [companies, setCompanies] = useState<Company[]>([]);
    const [jobs, setJobs] = useState<JobRole[]>([]);
    const [applications, setApplications] = useState<Application[]>([]);

    const [selectedCompanyId, setSelectedCompanyId] = useState<string>("");
    const [selectedJobId, setSelectedJobId] = useState<string>("");

    // Review State
    const [reviewAppId, setReviewAppId] = useState<number | null>(null);
    const [humanScore, setHumanScore] = useState<string>("");
    const [humanFeedback, setHumanFeedback] = useState<string>("");
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetch(`${API_URL}/api/companies`)
            .then(res => res.json())
            .then(data => setCompanies(data))
            .catch(err => console.error(err));
    }, []);

    useEffect(() => {
        if (selectedCompanyId) {
            fetch(`${API_URL}/api/jobs/company/${selectedCompanyId}`)
                .then(res => res.json())
                .then(data => setJobs(data))
                .catch(err => console.error(err));
        } else {
            setJobs([]);
        }
    }, [selectedCompanyId]);

    useEffect(() => {
        if (selectedJobId) {
            fetch(`${API_URL}/api/applications/job/${selectedJobId}`)
                .then(res => res.json())
                .then(data => setApplications(data))
                .catch(err => console.error(err));
        } else {
            setApplications([]);
        }
    }, [selectedJobId]);

    const handleReviewSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!reviewAppId) return;

        setSubmitting(true);
        try {
            await fetch(`${API_URL}/api/applications/${reviewAppId}/review`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    humanScore: parseInt(humanScore),
                    humanFeedback
                })
            });

            // Refresh applications array
            const res = await fetch(`${API_URL}/api/applications/job/${selectedJobId}`);
            const data = await res.json();
            setApplications(data);

            setReviewAppId(null);
            setHumanScore("");
            setHumanFeedback("");
        } catch (err) {
            console.error("Failed to submit review", err);
        } finally {
            setSubmitting(false);
        }
    };

    const getScoreColor = (score: number) => {
        if (score >= 80) return 'var(--success-text)';
        if (score >= 50) return 'var(--warning-text)';
        return '#dc2626';
    };

    const getScoreBg = (score: number) => {
        if (score >= 80) return 'var(--success-bg)';
        if (score >= 50) return 'var(--warning-bg)';
        return '#fee2e2';
    };

    return (
        <div className="animate-fade-in" style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem', height: 'calc(100vh - 120px)' }}>

            {/* Left Sidebar - Filters */}
            <div className="card" style={{ alignSelf: 'start' }}>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>Dashboard Filters</h2>

                <div className="form-group">
                    <label className="form-label">Select Company</label>
                    <select
                        className="form-select"
                        value={selectedCompanyId}
                        onChange={(e) => {
                            setSelectedCompanyId(e.target.value);
                            setSelectedJobId("");
                        }}
                    >
                        <option value="">-- All Companies --</option>
                        {companies.map(c => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label className="form-label">Select Job Role</label>
                    <select
                        className="form-select"
                        value={selectedJobId}
                        onChange={(e) => setSelectedJobId(e.target.value)}
                        disabled={!selectedCompanyId || jobs.length === 0}
                    >
                        <option value="">-- Select Role --</option>
                        {jobs.map(j => (
                            <option key={j.id} value={j.id}>{j.title}</option>
                        ))}
                    </select>
                </div>

                {selectedJobId && (
                    <div style={{ marginTop: '2rem', padding: '1rem', backgroundColor: 'var(--secondary-color)', borderRadius: '8px' }}>
                        <p style={{ margin: 0, fontWeight: 500 }}>
                            Showing {applications.length} Applicant{applications.length !== 1 ? 's' : ''}
                        </p>
                    </div>
                )}
            </div>

            {/* Right Side - Applicants List */}
            <div style={{ height: '100%', overflowY: 'auto', paddingRight: '0.5rem' }}>
                {!selectedJobId ? (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-light)', border: '2px dashed var(--border-color)', borderRadius: '12px', padding: '4rem 0' }}>
                        <svg width="48" height="48" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ marginBottom: '1rem' }}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 500 }}>No Role Selected</h3>
                        <p>Please select a company and job role from the sidebar to view applicants.</p>
                    </div>
                ) : applications.length === 0 ? (
                    <div style={{ textAlign: 'center', marginTop: '4rem', color: 'var(--text-light)' }}>
                        No applications found for this role yet.
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                            <h2 style={{ fontSize: '1.8rem', margin: 0 }}>Candidate Review Pipeline</h2>
                        </div>
                        {applications.map(app => (
                            <div key={app.id} className="card card-hoverable" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 300px', gap: '2rem', padding: '1.5rem 2rem' }}>
                                <div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                                        <div>
                                            <h3 style={{ fontSize: '1.25rem', margin: 0, color: 'var(--primary-color)' }}>{app.applicantName}</h3>
                                            <p style={{ color: 'var(--text-light)', fontSize: '0.9rem', marginTop: '0.25rem' }}>{app.applicantEmail} • Applied on {new Date(app.appDate).toLocaleDateString()}</p>
                                        </div>
                                    </div>

                                    <div style={{ marginBottom: '1.5rem' }}>
                                        <h4 style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-light)', marginBottom: '0.5rem' }}>AI Extracted Skills</h4>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                            {app.extractedSkills ? app.extractedSkills.split(',').map((skill, idx) => (
                                                <span key={idx} style={{ backgroundColor: 'var(--secondary-color)', padding: '0.25rem 0.75rem', borderRadius: '4px', fontSize: '0.85rem', color: 'var(--text-dark)', border: '1px solid var(--border-color)' }}>
                                                    {skill.trim()}
                                                </span>
                                            )) : <span style={{ color: 'var(--text-light)' }}>Pending extraction...</span>}
                                        </div>
                                    </div>

                                    <div style={{ display: 'flex', gap: '1rem' }}>
                                        <div style={{ padding: '0.5rem 1rem', borderRadius: '8px', backgroundColor: getScoreBg(app.aiScore), color: getScoreColor(app.aiScore), border: `1px solid ${getScoreColor(app.aiScore)}30` }}>
                                            <span style={{ fontSize: '0.8rem', display: 'block', textTransform: 'uppercase', fontWeight: 600, opacity: 0.8 }}>AI Match Rate</span>
                                            <strong style={{ fontSize: '1.5rem' }}>{app.aiScore}%</strong>
                                        </div>
                                        {app.humanScore > 0 && (
                                            <div style={{ padding: '0.5rem 1rem', borderRadius: '8px', backgroundColor: 'var(--secondary-color)', border: '1px solid var(--border-color)' }}>
                                                <span style={{ fontSize: '0.8rem', display: 'block', textTransform: 'uppercase', fontWeight: 600, color: 'var(--text-light)' }}>Human Score</span>
                                                <strong style={{ fontSize: '1.5rem' }}>{app.humanScore}%</strong>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div style={{ borderLeft: '1px solid var(--border-color)', paddingLeft: '2rem', display: 'flex', flexDirection: 'column' }}>
                                    {reviewAppId === app.id ? (
                                        <form onSubmit={handleReviewSubmit} style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                                            <h4 style={{ margin: '0 0 1rem 0' }}>Provide Human Review</h4>

                                            <div className="form-group" style={{ marginBottom: '1rem' }}>
                                                <label className="form-label" style={{ fontSize: '0.85rem' }}>Rating (0-100)</label>
                                                <input
                                                    type="number"
                                                    className="form-input"
                                                    min="0" max="100"
                                                    required
                                                    value={humanScore}
                                                    onChange={e => setHumanScore(e.target.value)}
                                                    style={{ padding: '0.5rem' }}
                                                />
                                            </div>

                                            <div className="form-group" style={{ flex: 1, marginBottom: '1rem' }}>
                                                <label className="form-label" style={{ fontSize: '0.85rem' }}>Feedback Notes</label>
                                                <textarea
                                                    className="form-textarea"
                                                    required
                                                    value={humanFeedback}
                                                    onChange={e => setHumanFeedback(e.target.value)}
                                                    style={{ height: '80px', resize: 'none' }}
                                                />
                                            </div>

                                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                <button type="submit" className="btn" style={{ flex: 1, padding: '0.5rem', fontSize: '0.9rem' }} disabled={submitting}>
                                                    {submitting ? 'Saving...' : 'Save'}
                                                </button>
                                                <button type="button" className="btn" style={{ backgroundColor: 'transparent', color: 'var(--text-light)', border: '1px solid var(--border-color)', padding: '0.5rem', fontSize: '0.9rem' }} onClick={() => setReviewAppId(null)}>
                                                    Cancel
                                                </button>
                                            </div>
                                        </form>
                                    ) : (
                                        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                                            {app.humanFeedback ? (
                                                <div style={{ flex: 1 }}>
                                                    <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem', color: 'var(--text-dark)' }}>Staff Feedback</h4>
                                                    <p style={{ fontSize: '0.9rem', color: 'var(--text-light)', backgroundColor: 'var(--secondary-color)', padding: '0.75rem', borderRadius: '6px', fontStyle: 'italic' }}>
                                                        &quot;{app.humanFeedback}&quot;
                                                    </p>
                                                </div>
                                            ) : (
                                                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyItems: 'center', color: 'var(--text-light)', fontSize: '0.9rem', fontStyle: 'italic' }}>
                                                    Pending human review
                                                </div>
                                            )}

                                            <button
                                                className="btn"
                                                style={{ width: '100%', marginTop: 'auto', backgroundColor: app.humanScore > 0 ? 'var(--secondary-color)' : 'var(--primary-color)', color: app.humanScore > 0 ? 'var(--text-dark)' : 'white', border: app.humanScore > 0 ? '1px solid var(--border-color)' : 'none' }}
                                                onClick={() => {
                                                    setReviewAppId(app.id);
                                                    setHumanScore(app.humanScore ? app.humanScore.toString() : "");
                                                    setHumanFeedback(app.humanFeedback || "");
                                                }}
                                            >
                                                {app.humanScore > 0 ? "Edit Review" : "Start Review"}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
