export default function Home() {
  return (
    <div className="animate-fade-in" style={{ textAlign: 'center', marginTop: '4rem', padding: '0 1rem' }}>
      <div style={{ marginBottom: '4rem' }}>
        <h1 style={{ fontSize: '4rem', fontWeight: 800, letterSpacing: '-0.05em', background: 'linear-gradient(to right, var(--primary-color), #a855f7)', WebkitBackgroundClip: 'text', color: 'transparent', marginBottom: '1.5rem' }}>
          Welcome to ResumeOS
        </h1>
        <p style={{ fontSize: '1.25rem', color: 'var(--text-light)', maxWidth: '650px', margin: '0 auto', lineHeight: '1.8' }}>
          A premium AI-assisted resume screening and management platform. Streamline your recruitment process while maintaining crucial human-in-the-loop oversight.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2.5rem', maxWidth: '900px', margin: '0 auto' }}>
        <a href="/applicant" className="card card-hoverable" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', textAlign: 'left', textDecoration: 'none', color: 'inherit' }}>
          <div style={{ padding: '0.75rem', backgroundColor: 'var(--primary-color)', borderRadius: '12px', color: 'white', marginBottom: '1.5rem', display: 'inline-block' }}>
            <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
          </div>
          <h2 style={{ fontSize: '1.5rem' }}>Applicant Portal</h2>
          <p style={{ color: 'var(--text-light)', marginTop: '0.75rem', flex: 1 }}>Browse currently open roles, upload your resume, and let our intelligent system analyze your qualifications.</p>
          <span style={{ color: 'var(--primary-color)', fontWeight: 600, marginTop: '1.5rem', display: 'flex', alignItems: 'center' }}>
            Apply Now <span style={{ marginLeft: '4px' }}>→</span>
          </span>
        </a>

        <a href="/staff" className="card card-hoverable" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', textAlign: 'left', textDecoration: 'none', color: 'inherit' }}>
          <div style={{ padding: '0.75rem', backgroundColor: '#8b5cf6', borderRadius: '12px', color: 'white', marginBottom: '1.5rem', display: 'inline-block' }}>
            <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
          </div>
          <h2 style={{ fontSize: '1.5rem' }}>Staff Dashboard</h2>
          <p style={{ color: 'var(--text-light)', marginTop: '0.75rem', flex: 1 }}>Publish job roles, review AI heuristics for candidates, and provide qualitative feedback securely.</p>
          <span style={{ color: '#8b5cf6', fontWeight: 600, marginTop: '1.5rem', display: 'flex', alignItems: 'center' }}>
            Manage Roles <span style={{ marginLeft: '4px' }}>→</span>
          </span>
        </a>
      </div>
    </div>
  );
}
