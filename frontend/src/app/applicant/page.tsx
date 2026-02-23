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
            // 1. First, create/find user (for simplicity in this mock, we post to /api/users to get an ID)
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
        <div className="animate-fade-in" style={{ maxWidth: '600px', margin: '2rem auto' }}>
            <h1 style={{ color: 'var(--primary-color)', marginBottom: '1.5rem' }}>Applicant Portal</h1>
            <p style={{ color: 'var(--text-light)', marginBottom: '2rem' }}>
                Select a job role and upload your resume to apply. Our AI-assisted platform will automatically process your application.
            </p>

            <form onSubmit={handleSubmit} className="card">
                <div className="form-group">
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
                        <option value="">-- Select a Company --</option>
                        {companies.map(c => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label className="form-label">Job Role</label>
                    <select
                        className="form-select"
                        value={selectedJobId}
                        onChange={(e) => setSelectedJobId(e.target.value)}
                        disabled={!selectedCompanyId || jobs.length === 0}
                        required
                    >
                        <option value="">-- Select a Job --</option>
                        {jobs.map(j => (
                            <option key={j.id} value={j.id}>{j.title}</option>
                        ))}
                    </select>
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

                <div className="form-group">
                    <label className="form-label">Upload Resume (PDF/DOC)</label>
                    <input
                        type="file"
                        className="form-input"
                        accept=".pdf,.doc,.docx"
                        onChange={(e) => setResumeFile(e.target.files ? e.target.files[0] : null)}
                        required
                    />
                </div>

                <button type="submit" className="btn" style={{ width: '100%' }} disabled={loading}>
                    {loading ? "Submitting..." : "Submit Application"}
                </button>

                {message && (
                    <div style={{ marginTop: '1rem', padding: '1rem', borderRadius: 'var(--radius)', backgroundColor: message.includes('success') ? '#d1fae5' : '#fee2e2', color: message.includes('success') ? '#065f46' : '#991b1b' }}>
                        {message}
                    </div>
                )}
            </form>
        </div>
    );
}
