import React from 'react'
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom'
import UploadPage from './pages/UploadPage'
import QuizPage from './pages/QuizPage'
import ResultPage from './pages/ResultPage'
import HistoryPage from './pages/HistoryPage'

const NAV_LINKS = [
  { to: '/', label: 'Create Quiz' },
  { to: '/history', label: 'History' },
]

function Nav() {
  const { pathname } = useLocation()
  return (
    <nav style={styles.nav}>
      <Link to="/" style={styles.brand}>
        <span style={styles.brandDot}>✦</span> QuizCraft
      </Link>
      <div style={styles.links}>
        {NAV_LINKS.map(l => (
          <Link
            key={l.to}
            to={l.to}
            style={{ ...styles.link, ...(pathname === l.to ? styles.linkActive : {}) }}
          >
            {l.label}
          </Link>
        ))}
      </div>
    </nav>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <div style={styles.app}>
        <Nav />
        <main style={styles.main}>
          <Routes>
            <Route path="/" element={<UploadPage />} />
            <Route path="/quiz/:quizId" element={<QuizPage />} />
            <Route path="/result/:attemptId" element={<ResultPage />} />
            <Route path="/history" element={<HistoryPage />} />
          </Routes>
        </main>
        <footer style={styles.footer}>
          <span>QuizCraft — AI-Powered Learning © {new Date().getFullYear()}</span>
        </footer>
      </div>
    </BrowserRouter>
  )
}

const styles = {
  app: {
    minHeight: '100vh',
    background: 'var(--bg)',
    display: 'flex',
    flexDirection: 'column',
    fontFamily: "'DM Sans', sans-serif",
  },
  nav: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '1.2rem 3rem',
    background: 'var(--surface)',
    borderBottom: '1px solid var(--border)',
    position: 'sticky',
    top: 0,
    zIndex: 100,
    backdropFilter: 'blur(10px)',
  },
  brand: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: '1.5rem',
    fontWeight: 600,
    color: 'var(--accent)',
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
  },
  brandDot: { fontSize: '1rem', color: 'var(--accent-soft)' },
  links: { display: 'flex', gap: '2rem' },
  link: {
    color: 'var(--text-muted)',
    textDecoration: 'none',
    fontSize: '0.9rem',
    fontWeight: 400,
    letterSpacing: '0.02em',
    transition: 'color 0.2s',
  },
  linkActive: { color: 'var(--accent)', fontWeight: 500 },
  main: { flex: 1, padding: '3rem 2rem' },
  footer: {
    textAlign: 'center',
    padding: '1.5rem',
    fontSize: '0.8rem',
    color: 'var(--text-muted)',
    borderTop: '1px solid var(--border)',
  },
}
