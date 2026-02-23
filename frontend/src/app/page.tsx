export default function Home() {
  return (
    <div className="animate-fade-in" style={{ textAlign: 'center', marginTop: '4rem' }}>
      <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>Welcome to ResumeOS</h1>
      <p style={{ fontSize: '1.25rem', color: 'var(--text-light)', marginBottom: '3rem', maxWidth: '600px', margin: '0 auto 3rem auto' }}>
        A balanced screening and automated resume management system designed to streamline recruitment while maintaining human oversight.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginTop: '2rem' }}>
        <a href="/applicant" className="card" style={{ display: 'block', textDecoration: 'none', color: 'inherit' }}>
          <h2 style={{ color: 'var(--primary-color)' }}>Applicant Portal</h2>
          <p style={{ color: 'var(--text-light)', marginTop: '0.5rem' }}>Browse open roles and securely submit your application and resume for consideration.</p>
        </a>

        <a href="/staff" className="card" style={{ display: 'block', textDecoration: 'none', color: 'inherit' }}>
          <h2 style={{ color: 'var(--primary-color)' }}>Staff Dashboard</h2>
          <p style={{ color: 'var(--text-light)', marginTop: '0.5rem' }}>Review candidates, view AI heuristics, and provide human-in-the-loop decisions.</p>
        </a>
      </div>
    </div>
  );
}
