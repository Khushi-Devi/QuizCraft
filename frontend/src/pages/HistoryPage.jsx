import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import BASE_URL from '../api.js'

export default function HistoryPage() {
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    fetch(`${BASE_URL}/quiz-history`)
      .then(r => r.json())
      .then(d => { setHistory(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const handleDelete = async (id) => {
    if (!confirm('Delete this quiz and all its attempts?')) return
    await fetch(`${BASE_URL}/quiz/${id}`, { method: 'DELETE' })
    setHistory(h => h.filter(q => q.id !== id))
  }

  if (loading) return <Loader />

  return (
    <div style={styles.page}>
      <div style={styles.header} className="fade-up">
        <h1 style={styles.title}>Quiz History</h1>
        <p style={styles.sub}>{history.length} quiz{history.length !== 1 ? 'zes' : ''} created</p>
      </div>

      {history.length === 0 ? (
        <div style={styles.empty}>
          <span style={{ fontSize: '2.5rem' }}>📭</span>
          <p>No quizzes yet. Upload some study material to get started!</p>
          <button style={styles.btn} onClick={() => navigate('/')}>Create First Quiz</button>
        </div>
      ) : (
        <div style={styles.list}>
          {history.map(quiz => (
            <div key={quiz.id} style={styles.card} className="fade-in">
              <div style={styles.cardTop}>
                <div>
                  <h3 style={styles.quizTitle}>{quiz.title}</h3>
                  <p style={styles.quizMeta}>
                    {quiz.num_questions} questions · {new Date(quiz.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </p>
                </div>
                <div style={styles.cardActions}>
                  <button style={styles.retakeBtn} onClick={() => navigate(`/quiz/${quiz.id}`)}>
                    Retake
                  </button>
                  <button style={styles.deleteBtn} onClick={() => handleDelete(quiz.id)}>✕</button>
                </div>
              </div>

              {quiz.attempts.length > 0 && (
                <div style={styles.attempts}>
                  <p style={styles.attemptsLabel}>Attempts</p>
                  <div style={styles.attemptsList}>
                    {quiz.attempts.slice(0, 3).map(a => (
                      <div key={a.id} style={styles.attempt}>
                        <span style={styles.attemptScore}>{a.score}/{a.total_questions}</span>
                        <div style={styles.accuracyBar}>
                          <div style={{ ...styles.accuracyFill, width: `${a.accuracy}%` }} />
                        </div>
                        <span style={styles.accuracyPct}>{a.accuracy}%</span>
                        <span style={styles.attemptDate}>
                          {new Date(a.timestamp).toLocaleDateString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function Loader() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
      <div style={{ width: 36, height: 36, border: '3px solid var(--accent-light)', borderTop: '3px solid var(--accent)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
    </div>
  )
}

const styles = {
  page: { maxWidth: 760, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.8rem' },
  header: {},
  title: { fontFamily: "'Cormorant Garamond', serif", fontSize: '2rem', fontWeight: 600, color: 'var(--text)' },
  sub: { fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.3rem' },
  empty: {
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem',
    padding: '4rem', background: 'var(--surface)', borderRadius: 'var(--radius)',
    border: '1px solid var(--border)', color: 'var(--text-muted)', textAlign: 'center',
  },
  btn: {
    padding: '0.7rem 1.6rem', background: 'var(--accent)', color: 'white',
    border: 'none', borderRadius: 99, cursor: 'pointer',
    fontSize: '0.9rem', fontFamily: "'DM Sans', sans-serif",
  },
  list: { display: 'flex', flexDirection: 'column', gap: '1rem' },
  card: {
    background: 'var(--surface-raised)', borderRadius: 'var(--radius)',
    border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)',
    padding: '1.4rem 1.6rem', display: 'flex', flexDirection: 'column', gap: '1rem',
  },
  cardTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' },
  quizTitle: { fontFamily: "'Cormorant Garamond', serif", fontSize: '1.2rem', fontWeight: 600, color: 'var(--text)' },
  quizMeta: { fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.2rem' },
  cardActions: { display: 'flex', gap: '0.5rem', alignItems: 'center' },
  retakeBtn: {
    padding: '0.4rem 1rem', background: 'var(--accent-light)', color: 'var(--accent)',
    border: '1px solid var(--accent-soft)', borderRadius: 99, cursor: 'pointer',
    fontSize: '0.8rem', fontFamily: "'DM Sans', sans-serif",
  },
  deleteBtn: {
    width: 30, height: 30, border: '1px solid var(--border)', background: 'transparent',
    borderRadius: '50%', cursor: 'pointer', color: 'var(--text-muted)', fontSize: '0.75rem',
  },
  attempts: {},
  attemptsLabel: { fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.05em', marginBottom: '0.5rem' },
  attemptsList: { display: 'flex', flexDirection: 'column', gap: '0.4rem' },
  attempt: { display: 'flex', alignItems: 'center', gap: '0.8rem' },
  attemptScore: { fontSize: '0.82rem', fontWeight: 600, color: 'var(--text)', minWidth: 40 },
  accuracyBar: { flex: 1, height: 5, background: 'var(--border)', borderRadius: 99, overflow: 'hidden' },
  accuracyFill: { height: '100%', background: 'var(--accent)', borderRadius: 99, transition: 'width 0.6s ease' },
  accuracyPct: { fontSize: '0.78rem', color: 'var(--accent)', fontWeight: 500, minWidth: 38, textAlign: 'right' },
  attemptDate: { fontSize: '0.72rem', color: 'var(--text-muted)', minWidth: 72 },
}