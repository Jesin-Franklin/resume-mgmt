import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Automated Resume Management',
  description: 'A balanced AI-assisted resume screening and management system.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <nav style={{ padding: '1rem 2rem', borderBottom: '1px solid var(--secondary-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ margin: 0, color: 'var(--primary-color)' }}>ResumeOS</h2>
          <div>
            <a href="/" style={{ marginRight: '1rem', fontWeight: 500 }}>Home</a>
            <a href="/applicant" style={{ marginRight: '1rem', fontWeight: 500 }}>Applicant Portal</a>
            <a href="/staff" style={{ fontWeight: 500 }}>Staff Portal</a>
          </div>
        </nav>
        <main className="container">
          {children}
        </main>
      </body>
    </html>
  );
}
