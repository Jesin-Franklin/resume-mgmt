import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';
import ThemeToggle from '../components/ThemeToggle';

export const metadata: Metadata = {
  title: 'ResumeOS | Automated Screening',
  description: 'A premium AI-assisted resume screening and management system.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div className="app-wrapper">
          <nav className="main-nav">
            <h2 style={{ margin: 0, color: 'var(--primary-color)', fontSize: '1.5rem', fontWeight: 700, letterSpacing: '-0.05em' }}>
              Resume<span style={{ color: 'var(--text-dark)' }}>OS</span>
            </h2>
            <div className="nav-links" style={{ alignItems: 'center' }}>
              <Link href="/" className="nav-link">Overview</Link>
              <Link href="/applicant" className="nav-link">Applicant Portal</Link>
              <Link href="/staff" className="nav-link">Staff Dashboard</Link>
              <ThemeToggle />
            </div>
          </nav>
          <main className="container">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
