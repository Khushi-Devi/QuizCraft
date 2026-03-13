import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import FileUpload from '../components/FileUpload'
import BASE_URL from '../api.js'

export default function UploadPage() {
  const navigate = useNavigate()
  const [uploaded, setUploaded] = useState(null)
  const [title, setTitle] = useState('')
  const [numQ, setNumQ] = useState(10)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleUploaded = (data) => {
    setUploaded(data)
    setTitle(data.title)
    setError('')
  }

  const handleGenerate = async () => {
    if (!uploaded) { setError('Please upload a file first.'); return }
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`${BASE_URL}/generate-quiz`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: uploaded.text, num_questions: numQ, title }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Generation failed')
      navigate(`/quiz/${data.quiz_id}`)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.page}>
      {/* Hero */}
      <div style={styles.hero} className="fade-up">
        <div style={styles.badge}>✦ AI-Powered</div>
        <h1 style={styles.title}>Turn any material into<br />an interactive quiz</h1>
        <p style={styles.subtitle}>
          Upload a PDF, Word doc, or text file — our AI will generate smart quiz questions for you.
        </p>
      </div>

      <div style={styles.card} className="fade-up">
        {/* Upload zone */}
        <section style={styles.section}>
          <label style={styles.label}>Study Material</label>
          <FileUpload onFileUploaded={handleUploaded} />
          {uploaded && (
            <p style={styles.success}>
              ✓ {uploaded.filename} — {uploaded.char_count.toLocaleString()} characters extracted
            </p>
          )}
        </section>

        {/* Title */}
        <section style={styles.section}>
          <label style={styles.label}>Quiz Title</label>
          <input
            style={styles.input}
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="e.g. Chapter 5 — Cell Biology"
          />
        </section>

        {/* Number of questions */}
        <section style={styles.section}>
          <label style={styles.label}>
            Number of Questions <span style={styles.numBadge}>{numQ}</span>
          </label>
          <input
            type="range" min={1} max={50} value={numQ}
            onChange={e => setNumQ(Number(e.target.value))}
            style={styles.slider}
          />
          <div style={styles.sliderLabels}>
            <span>1</span><span>50</span>
          </div>
          <div style={styles.diffPills}>
            <span style={styles.easyPill}>~{Math.ceil(numQ * 0.4)} Easy</span>
            <span style={styles.medPill}>~{Math.ceil(numQ * 0.4)} Medium</span>
            <span style={styles.hardPill}>~{Math.max(0, numQ - Math.ceil(numQ * 0.4) * 2)} Hard</span>
          </div>
        </section>

        {error && <p style={styles.error}>{error}</p>}

        <button
          style={{ ...styles.btn, opacity: loading ? 0.7 : 1 }}
          onClick={handleGenerate}
          disabled={loading}
        >
          {loading ? (
            <span style={styles.loadRow}>
              <span style={styles.spinner} /> Generating with AI…
            </span>
          ) : '✦ Generate Quiz'}
        </button>
      </div>
    </div>
  )
}

const styles = {
  page: { maxWidth: 680, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' },
  hero: { textAlign: 'center', padding: '1rem 0 0' },
  badge: {
    display: 'inline-block', background: 'var(--accent-light)', color: 'var(--accent)',
    fontSize: '0.75rem', fontWeight: 600, padding: '4px 14px', borderRadius: 99,
    letterSpacing: '0.08em', marginBottom: '1rem',
  },
  title: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: 'clamp(2rem, 5vw, 2.8rem)', fontWeight: 600,
    color: 'var(--text)', lineHeight: 1.25, marginBottom: '1rem',
  },
  subtitle: { fontSize: '1rem', color: 'var(--text-muted)', maxWidth: 480, margin: '0 auto' },
  card: {
    background: 'var(--surface-raised)', borderRadius: 'var(--radius)',
    boxShadow: 'var(--shadow-md)', border: '1px solid var(--border)',
    padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.6rem',
  },
  section: { display: 'flex', flexDirection: 'column', gap: '0.6rem' },
  label: { fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: '0.5rem' },
  numBadge: {
    background: 'var(--accent)', color: 'white',
    borderRadius: 99, padding: '1px 10px', fontSize: '0.8rem', fontWeight: 700,
  },
  input: {
    padding: '0.75rem 1rem', border: '1.5px solid var(--border)',
    borderRadius: 'var(--radius-sm)', fontSize: '0.95rem', color: 'var(--text)',
    background: 'var(--bg)', fontFamily: "'DM Sans', sans-serif",
    outline: 'none', transition: 'border 0.2s',
  },
  slider: { width: '100%', accentColor: 'var(--accent)', cursor: 'pointer' },
  sliderLabels: { display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)' },
  diffPills: { display: 'flex', gap: '0.5rem', flexWrap: 'wrap' },
  easyPill:  { fontSize: '0.75rem', padding: '2px 10px', borderRadius: 99, background: '#e6f7ef', color: '#4a9e6f', fontWeight: 500 },
  medPill:   { fontSize: '0.75rem', padding: '2px 10px', borderRadius: 99, background: '#fef3e2', color: '#c98a2b', fontWeight: 500 },
  hardPill:  { fontSize: '0.75rem', padding: '2px 10px', borderRadius: 99, background: '#fce8e8', color: '#c05454', fontWeight: 500 },
  success: { fontSize: '0.82rem', color: 'var(--success)', marginTop: '0.3rem' },
  error: { fontSize: '0.85rem', color: 'var(--error)' },
  btn: {
    padding: '0.95rem', background: 'var(--accent)', color: 'white',
    border: 'none', borderRadius: 99, cursor: 'pointer',
    fontSize: '1rem', fontWeight: 500, fontFamily: "'DM Sans', sans-serif",
    transition: 'background 0.2s', letterSpacing: '0.02em',
  },
  loadRow: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem' },
  spinner: {
    display: 'inline-block', width: 16, height: 16,
    border: '2px solid rgba(255,255,255,0.4)',
    borderTop: '2px solid white', borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
  },
}