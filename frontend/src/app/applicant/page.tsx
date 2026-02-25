"use client";

import { useState, useEffect } from 'react';

// Define TS Interfaces
interface Company {
    id: number;
    name: string;
}

interface JobRole {
    id: number;
    title: string;
    description: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export default function ApplicantPortal() {
    const [companies, setCompanies] = useState<Company[]>([]);
    const [jobs, setJobs] = useState<JobRole[]>([]);

    const [selectedCompanyId, setSelectedCompanyId] = useState<string>("");
    const [selectedJobId, setSelectedJobId] = useState<string>("");
    const [applicantName, setApplicantName] = useState("");
    const [applicantEmail, setApplicantEmail] = useState("");
    const [resumeFile, setResumeFile] = useState<File | null>(null);

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    // Fetch companies on mount
    useEffect(() => {
        fetch(`${API_URL}/api/companies`)
            .then(res => res.json())
            .then(data => setCompanies(data))
            .catch(err => console.error("Error fetching companies:", err));
    }, []);

    // Fetch jobs when company is selected
    useEffect(() => {
        if (selectedCompanyId) {
            fetch(`${API_URL}/api/jobs/company/${selectedCompanyId}`)
                .then(res => res.json())
                .then(data => setJobs(data))
                .catch(err => console.error("Error fetching jobs:", err));
        } else {
            setJobs([]);
        }
    }, [selectedCompanyId]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget;
        if (!resumeFile || !selectedJobId || !applicantName || !applicantEmail) {
            setMessage("Please fill all required fields and attach a resume.");
            return;
        }

        setLoading(true);
        setMessage("");

        try {
            // 1. First, create/find user
            const userRes = await fetch(`${API_URL}/api/users`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: applicantName, email: applicantEmail, role: 'APPLICANT' })
            });
            const userData = await userRes.json();

            const formData = new FormData();
            formData.append("applicantId", userData.id.toString());
            formData.append("jobRoleId", selectedJobId);
            formData.append("resume", resumeFile);

            const uploadRes = await fetch(`${API_URL}/api/applications/upload`, {
                method: 'POST',
                body: formData,
            });

            if (uploadRes.ok) {
                setMessage("Application submitted successfully!");
                // Reset form
                setSelectedCompanyId("");
                setSelectedJobId("");
                setApplicantName("");
                setApplicantEmail("");
                setResumeFile(null);
                form.reset();
            } else {
                setMessage("Failed to submit application.");
            }
        } catch (err) {
            console.error(err);
            setMessage("An error occurred during submission.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="animate-fade-in" style={{ maxWidth: '640px', margin: '2rem auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                <h1 style={{ color: 'var(--primary-color)', fontSize: '2.5rem', fontWeight: 700, letterSpacing: '-0.025em' }}>Applicant Portal</h1>
                <p style={{ color: 'var(--text-light)', fontSize: '1.1rem', marginTop: '0.5rem' }}>
                    Select a job role and upload your resume. Our AI system will process your application instantly.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="card card-hoverable" style={{ padding: '2.5rem' }}>

                {message && (
                    <div style={{ marginBottom: '2rem', padding: '1rem', borderRadius: '8px', backgroundColor: message.includes('success') ? 'var(--success-bg)' : 'var(--warning-bg)', color: message.includes('success') ? 'var(--success-text)' : 'var(--warning-text)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        {message.includes('success') ? (
                            <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                        ) : (
                            <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                        )}
                        <span style={{ fontWeight: 500 }}>{message}</span>
                    </div>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                        <label className="form-label">Company</label>
                        <select
                            className="form-select"
                            value={selectedCompanyId}
                            onChange={(e) => {
                                setSelectedCompanyId(e.target.value);
                                setSelectedJobId(""); // Reset job selection
                            }}
                            required
                        >
                            <option value="">-- Choose Company --</option>
                            {companies.map(c => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group" style={{ marginBottom: 0 }}>
                        <label className="form-label">Job Role</label>
                        <select
                            className="form-select"
                            value={selectedJobId}
                            onChange={(e) => setSelectedJobId(e.target.value)}
                            disabled={!selectedCompanyId || jobs.length === 0}
                            required
                        >
                            <option value="">-- Choose Role --</option>
                            {jobs.map(j => (
                                <option key={j.id} value={j.id}>{j.title}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="form-group">
                    <label className="form-label">Full Name</label>
                    <input
                        type="text"
                        className="form-input"
                        value={applicantName}
                        onChange={(e) => setApplicantName(e.target.value)}
                        placeholder="John Doe"
                        required
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">Email Address</label>
                    <input
                        type="email"
                        className="form-input"
                        value={applicantEmail}
                        onChange={(e) => setApplicantEmail(e.target.value)}
                        placeholder="john@example.com"
                        required
                    />
                </div>

                <div className="form-group" style={{ marginBottom: '2rem' }}>
                    <label className="form-label">Upload Resume (PDF/DOC)</label>
                    <div style={{ border: '2px dashed var(--border-color)', borderRadius: '8px', padding: '1.5rem', textAlign: 'center', backgroundColor: 'var(--secondary-color)', transition: 'border-color 0.2s', cursor: 'pointer' }}
                        onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--primary-color)'}
                        onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-color)'}>
                        <input
                            type="file"
                            className="form-input"
                            style={{ opacity: 0, position: 'absolute', width: '1px', height: '1px' }}
                            id="resume-upload"
                            accept=".pdf,.doc,.docx"
                            onChange={(e) => setResumeFile(e.target.files ? e.target.files[0] : null)}
                            required
                        />
                        <label htmlFor="resume-upload" style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <svg width="32" height="32" fill="none" stroke="var(--primary-color)" viewBox="0 0 24 24" style={{ marginBottom: '0.5rem' }}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                            <span style={{ fontWeight: 500, color: 'var(--primary-color)' }}>{resumeFile ? resumeFile.name : "Click to select a file"}</span>
                            <span style={{ fontSize: '0.85rem', color: 'var(--text-light)', marginTop: '0.25rem' }}>or drag and drop</span>
                        </label>
                    </div>
                </div>

                <button type="submit" className="btn" style={{ width: '100%', padding: '1rem', fontSize: '1.1rem' }} disabled={loading}>
                    {loading ? (
                        <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                            <svg className="animate-spin" width="20" height="20" fill="none" viewBox="0 0 24 24" style={{ animation: 'spin 1s linear infinite' }}>
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Submitting Application...
                        </span>
                    ) : "Submit Application"}
                </button>
            </form>
            <style jsx>{`
                @keyframes spin { to { transform: rotate(360deg); } }
            `}</style>
        </div>
    );
}
