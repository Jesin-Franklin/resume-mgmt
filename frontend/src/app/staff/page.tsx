"use client";

import { useState, useEffect } from 'react';

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
    const [selectedApp, setSelectedApp] = useState<Application | null>(null);

    // New Company Form State
    const [newCompanyName, setNewCompanyName] = useState("");
    const [newCompanyDesc, setNewCompanyDesc] = useState("");

    // New Job Form State
    const [newJobTitle, setNewJobTitle] = useState("");
    const [newJobSkills, setNewJobSkills] = useState("");

    // Feedback Form State
    const [humanScore, setHumanScore] = useState<number>(0);
    const [humanFeedback, setHumanFeedback] = useState("");

    const fetchCompanies = async () => {
        const res = await fetch(`${API_URL}/api/companies`);
        setCompanies(await res.json());
    };

    const fetchJobs = async (compId: string) => {
        if (!compId) return setJobs([]);
        const res = await fetch(`${API_URL}/api/jobs/company/${compId}`);
        setJobs(await res.json());
    };

    const fetchApplications = async (jobId: string) => {
        if (!jobId) return setApplications([]);
        const res = await fetch(`${API_URL}/api/applications/job/${jobId}`);
        setApplications(await res.json());
    };

    useEffect(() => { fetchCompanies(); }, []);
    useEffect(() => { fetchJobs(selectedCompanyId); }, [selectedCompanyId]);
    useEffect(() => {
        fetchApplications(selectedJobId);
        setSelectedApp(null);
    }, [selectedJobId]);

    const handleCreateJob = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedCompanyId || !newJobTitle) return;

        try {
            const res = await fetch(`${API_URL}/api/jobs`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: newJobTitle,
                    requiredSkills: newJobSkills,
                    companyId: parseInt(selectedCompanyId)
                })
            });
            if (res.ok) {
                alert("Job successfully created!");
                setNewJobTitle("");
                setNewJobSkills("");
                fetchJobs(selectedCompanyId); // Refresh
            } else {
                alert("Failed to create job.");
            }
        } catch (error) {
            console.error(error);
            alert("Error creating job.");
        }
    };

    const handleCreateCompany = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newCompanyName) return;

        try {
            const res = await fetch(`${API_URL}/api/companies`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: newCompanyName,
                    description: newCompanyDesc
                })
            });
            if (res.ok) {
                alert("Company successfully created!");
                setNewCompanyName("");
                setNewCompanyDesc("");
                fetchCompanies(); // Refresh
            } else {
                alert("Failed to create company.");
            }
        } catch (error) {
            console.error(error);
            alert("Error creating company.");
        }
    };

    const submitFeedback = async () => {
        if (!selectedApp) return;
        await fetch(`${API_URL}/api/applications/${selectedApp.id}/feedback`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ humanScore, humanFeedback })
        });
        alert("Feedback saved!");
        fetchApplications(selectedJobId);
        setSelectedApp(null);
    };

    return (
        <div className="animate-fade-in" style={{ padding: '1rem' }}>
            <h1 style={{ color: 'var(--primary-color)' }}>Staff Dashboard</h1>
            <p style={{ color: 'var(--text-light)', marginBottom: '2rem' }}>Manage job postings, review AI-shortlisted candidates, and provide human oversight.</p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
                {/* Left Column: Management */}
                <div>
                    <div className="card" style={{ marginBottom: '1.5rem' }}>
                        <h3>1. Select Company</h3>
                        <select className="form-select" value={selectedCompanyId} onChange={e => setSelectedCompanyId(e.target.value)}>
                            <option value="">-- Choose Company --</option>
                            {companies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                        <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--secondary-color)' }}>
                            <h4 style={{ marginBottom: '0.5rem' }}>Or Create New Company</h4>
                            <form onSubmit={handleCreateCompany}>
                                <input className="form-input" style={{ marginBottom: '0.5rem' }} placeholder="Company Name" value={newCompanyName} onChange={e => setNewCompanyName(e.target.value)} required />
                                <textarea className="form-input" style={{ marginBottom: '0.5rem', minHeight: '60px' }} placeholder="Company Description" value={newCompanyDesc} onChange={e => setNewCompanyDesc(e.target.value)} />
                                <button className="btn" type="submit" style={{ width: '100%' }}>Create Company</button>
                            </form>
                        </div>
                    </div>

                    {selectedCompanyId && (
                        <div className="card" style={{ marginBottom: '1.5rem' }}>
                            <h3>2. Create New Job Post</h3>
                            <form onSubmit={handleCreateJob}>
                                <input className="form-input" style={{ marginBottom: '0.5rem' }} placeholder="Job Title (e.g. Frontend Engineer)" value={newJobTitle} onChange={e => setNewJobTitle(e.target.value)} required />
                                <textarea className="form-input" style={{ marginBottom: '0.5rem', minHeight: '80px' }} placeholder="Required Skills (e.g. React, TypeScript)" value={newJobSkills} onChange={e => setNewJobSkills(e.target.value)} required />
                                <button className="btn" type="submit" style={{ width: '100%' }}>Create Job</button>
                            </form>
                        </div>
                    )}

                    {jobs.length > 0 && (
                        <div className="card">
                            <h3>3. Select Job to Review</h3>
                            <select className="form-select" value={selectedJobId} onChange={e => setSelectedJobId(e.target.value)}>
                                <option value="">-- Choose Job --</option>
                                {jobs.map(j => <option key={j.id} value={j.id}>{j.title}</option>)}
                            </select>
                        </div>
                    )}
                </div>

                {/* Right Column: Candidates */}
                <div className="card">
                    <h3>Candidates</h3>
                    {!selectedJobId ? (
                        <p style={{ color: 'var(--text-light)' }}>Select a job to view candidates.</p>
                    ) : applications.length === 0 ? (
                        <p style={{ color: 'var(--text-light)' }}>No applications for this job yet.</p>
                    ) : (
                        <div>
                            {applications.map(app => (
                                <div
                                    key={app.id}
                                    style={{
                                        padding: '1rem', border: '1px solid var(--secondary-color)',
                                        borderRadius: 'var(--radius)', marginBottom: '1rem',
                                        cursor: 'pointer', backgroundColor: selectedApp?.id === app.id ? 'var(--secondary-color)' : 'transparent'
                                    }}
                                    onClick={() => {
                                        setSelectedApp(app);
                                        setHumanScore(app.humanScore || 0);
                                        setHumanFeedback(app.humanFeedback || "");
                                    }}
                                >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <h4 style={{ margin: 0 }}>{app.applicantName}</h4>
                                        <span style={{
                                            backgroundColor: (app.aiScore || 0) > 75 ? '#d1fae5' : '#fef3c7',
                                            color: (app.aiScore || 0) > 75 ? '#065f46' : '#92400e',
                                            padding: '0.25rem 0.75rem', borderRadius: '999px', fontSize: '0.875rem', fontWeight: 'bold'
                                        }}>
                                            AI Score: {app.aiScore || 'N/A'}
                                        </span>
                                    </div>
                                    <p style={{ fontSize: '0.875rem', color: 'var(--text-light)', marginTop: '0.5rem' }}>{app.applicantEmail}</p>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Detailed Review View */}
                    {selectedApp && (
                        <div style={{ marginTop: '2rem', padding: '1.5rem', backgroundColor: 'var(--secondary-color)', borderRadius: 'var(--radius)' }}>
                            <h3 style={{ borderBottom: '1px solid #ccc', paddingBottom: '0.5rem', marginBottom: '1rem' }}>Candidate Reviewer</h3>
                            <p><strong>Name:</strong> {selectedApp.applicantName}</p>
                            <p><strong>AI Extracted Skills:</strong> <br />{selectedApp.extractedSkills}</p>

                            <div style={{ marginTop: '1.5rem' }}>
                                <h4 style={{ marginBottom: '0.5rem' }}>Human-in-the-Loop Feedback</h4>
                                <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                                    <div style={{ flex: 1 }}>
                                        <label className="form-label">Adjust Score (0-100)</label>
                                        <input className="form-input" type="number" min="0" max="100" value={humanScore} onChange={e => setHumanScore(Number(e.target.value))} />
                                    </div>
                                </div>
                                <div>
                                    <label className="form-label">Qualitative Feedback</label>
                                    <textarea className="form-input" style={{ minHeight: '80px', marginBottom: '1rem' }} placeholder="Note communication skills from cover letter, etc." value={humanFeedback} onChange={e => setHumanFeedback(e.target.value)} />
                                </div>
                                <button className="btn" onClick={submitFeedback}>Save Feedback</button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
