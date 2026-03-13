import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function ScoreCard({ result, quizId }) {
  const navigate = useNavigate()
  const { score, total, accuracy, feedback } = result

  const circle = { r: 54, cx: 60, cy: 60 }
  const circumference = 2 * Math.PI * circle.r
  const offset = circumference - (accuracy / 100) * circumference

  const grade = accuracy >= 90 ? { label: 'Excellent', color: 'var(--success)' }
    : accuracy >= 70 ? { label: 'Good', color: 'var(--accent)' }
    : accuracy >= 50 ? { label: 'Fair', color: 'var(--warning)' }
    : { label: 'Needs Work', color: 'var(--error)' }

  return (
    <div style={styles.wrap} className="fade-up">
      <div style={styles.card}>
        <h2 style={styles.title}>Quiz Complete</h2>

        {/* Circular progress */}
        <div style={styles.circleWrap}>
          <svg width={120} height={120} viewBox="0 0 120 120">
            <circle cx={circle.cx} cy={circle.cy} r={circle.r}
              fill="none" stroke="var(--border)" strokeWidth={8} />
            <circle cx={circle.cx} cy={circle.cy} r={circle.r}
              fill="none" stroke={grade.color} strokeWidth={8}
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
              transform="rotate(-90 60 60)"
              style={{ transition: 'stroke-dashoffset 1s ease' }}
            />
          </svg>
          <div style={styles.circleInner}>
            <span style={{ ...styles.pct, color: grade.color }}>{accuracy}%</span>
            <span style={styles.gradeLabel}>{grade.label}</span>
          </div>
        </div>

        {/* Score pills */}
        <div style={styles.pills}>
          <div style={{ ...styles.pill, background: '#edf9f2' }}>
            <span style={{ color: 'var(--success)', fontWeight: 700, fontSize: '1.3rem' }}>{score}</span>
            <span style={styles.pillLabel}>Correct</span>
          </div>
          <div style={{ ...styles.pill, background: '#fdf0f0' }}>
            <span style={{ color: 'var(--error)', fontWeight: 700, fontSize: '1.3rem' }}>{total - score}</span>
            <span style={styles.pillLabel}>Incorrect</span>
          </div>
          <div style={{ ...styles.pill, background: 'var(--accent-light)' }}>
            <span style={{ color: 'var(--accent)', fontWeight: 700, fontSize: '1.3rem' }}>{total}</span>
            <span style={styles.pillLabel}>Total</span>
          </div>
        </div>

        {/* AI Feedback */}
        {feedback && (
          <div style={styles.feedback}>
            <p style={styles.feedbackLabel}>✦ AI Feedback</p>
            <p style={styles.feedbackText}>{feedback}</p>
          </div>
        )}

        {/* Actions */}
        <div style={styles.actions}>
          <button style={styles.btnPrimary} onClick={() => navigate('/')}>
            Create New Quiz
          </button>
          <button style={styles.btnSecondary} onClick={() => navigate(`/quiz/${quizId}`)}>
            Review Answers
          </button>
          <button style={styles.btnGhost} onClick={() => navigate('/history')}>
            View History
          </button>
        </div>
      </div>
    </div>
  )
}

const styles = {
  wrap: { display: 'flex', justifyContent: 'center', padding: '2rem 1rem' },
  card: {
    background: 'var(--surface-raised)', borderRadius: 'var(--radius)',
    boxShadow: 'var(--shadow-lg)', border: '1px solid var(--border)',
    padding: '2.5rem', maxWidth: 520, width: '100%',
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.8rem',
  },
  title: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: '1.8rem', fontWeight: 600, color: 'var(--text)',
  },
  circleWrap: { position: 'relative', display: 'inline-block' },
  circleInner: {
    position: 'absolute', inset: 0,
    display: 'flex', flexDirection: 'column',
    alignItems: 'center', justifyContent: 'center',
  },
  pct: { fontSize: '1.4rem', fontWeight: 700 },
  gradeLabel: { fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 500 },
  pills: { display: 'flex', gap: '1rem', width: '100%' },
  pill: {
    flex: 1, borderRadius: 'var(--radius-sm)', padding: '1rem',
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.2rem',
  },
  pillLabel: { fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 500 },
  feedback: {
    background: 'var(--accent-light)', borderRadius: 'var(--radius-sm)',
    padding: '1.2rem 1.4rem', width: '100%',
    border: '1px solid var(--accent-soft)',
  },
  feedbackLabel: { fontSize: '0.72rem', fontWeight: 700, color: 'var(--accent)', marginBottom: '0.5rem', letterSpacing: '0.05em' },
  feedbackText: { fontSize: '0.88rem', color: 'var(--text)', lineHeight: 1.65 },
  actions: { display: 'flex', flexDirection: 'column', gap: '0.7rem', width: '100%' },
  btnPrimary: {
    padding: '0.85rem', background: 'var(--accent)', color: 'white',
    border: 'none', borderRadius: 99, cursor: 'pointer',
    fontSize: '0.9rem', fontWeight: 500, fontFamily: "'DM Sans', sans-serif",
    transition: 'background 0.2s',
  },
  btnSecondary: {
    padding: '0.85rem', background: 'var(--accent-light)', color: 'var(--accent)',
    border: '1px solid var(--accent-soft)', borderRadius: 99, cursor: 'pointer',
    fontSize: '0.9rem', fontWeight: 500, fontFamily: "'DM Sans', sans-serif",
  },
  btnGhost: {
    padding: '0.85rem', background: 'transparent', color: 'var(--text-muted)',
    border: '1px solid var(--border)', borderRadius: 99, cursor: 'pointer',
    fontSize: '0.9rem', fontFamily: "'DM Sans', sans-serif",
  },
}
