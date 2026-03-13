import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import QuizCard from '../components/QuizCard'

const PAGE_SIZE = 10

export default function QuizPage() {
  const { quizId } = useParams()
  const navigate = useNavigate()

  const [quiz, setQuiz] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [mode, setMode] = useState('quiz')       // 'quiz' | 'study'
  const [answers, setAnswers] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [page, setPage] = useState(0)

  useEffect(() => {
    fetch(`/quiz/${quizId}`)
      .then(r => r.json())
      .then(d => { setQuiz(d); setLoading(false) })
      .catch(() => { setError('Failed to load quiz.'); setLoading(false) })
  }, [quizId])

  if (loading) return <Loader />
  if (error) return <p style={{ color: 'var(--error)', textAlign: 'center' }}>{error}</p>

  const questions = quiz.questions || []
  const totalPages = Math.ceil(questions.length / PAGE_SIZE)
  const pageQuestions = questions.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)
  const answered = Object.keys(answers).length
  const allAnswered = answered === questions.length

  const handleAnswer = (idx, val) => {
    setAnswers(a => ({ ...a, [idx]: val }))
  }

  const handleSubmit = async () => {
    setSubmitting(true)
    try {
      const res = await fetch('/submit-quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quiz_id: quizId, answers }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setSubmitted(true)
      navigate(`/result/${data.attempt_id}`, { state: { result: data, quizId } })
    } catch (e) {
      alert('Submit failed: ' + e.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div style={styles.page}>
      {/* Header */}
      <div style={styles.header} className="fade-up">
        <div>
          <h1 style={styles.title}>{quiz.title}</h1>
          <p style={styles.meta}>{questions.length} questions</p>
        </div>
        {/* Mode toggle */}
        <div style={styles.modeSwitch}>
          {['quiz', 'study'].map(m => (
            <button
              key={m}
              style={{ ...styles.modeBtn, ...(mode === m ? styles.modeBtnActive : {}) }}
              onClick={() => setMode(m)}
            >
              {m === 'quiz' ? '📝 Quiz Mode' : '📖 Study Mode'}
            </button>
          ))}
        </div>
      </div>

      {/* Progress bar */}
      {mode === 'quiz' && (
        <div style={styles.progressWrap}>
          <div style={{ ...styles.progressBar, width: `${(answered / questions.length) * 100}%` }} />
          <span style={styles.progressLabel}>{answered} / {questions.length} answered</span>
        </div>
      )}

      {/* Cards */}
      <div style={styles.cards}>
        {pageQuestions.map((q, i) => {
          const globalIdx = page * PAGE_SIZE + i
          return (
            <QuizCard
              key={globalIdx}
              question={q}
              index={globalIdx}
              mode={mode}
              onAnswer={handleAnswer}
              userAnswer={answers[globalIdx]}
              revealed={submitted}
            />
          )
        })}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={styles.pagination}>
          <button style={styles.pageBtn} onClick={() => setPage(p => p - 1)} disabled={page === 0}>← Prev</button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              style={{ ...styles.pageBtn, ...(page === i ? styles.pageBtnActive : {}) }}
              onClick={() => setPage(i)}
            >
              {i + 1}
            </button>
          ))}
          <button style={styles.pageBtn} onClick={() => setPage(p => p + 1)} disabled={page === totalPages - 1}>Next →</button>
        </div>
      )}

      {/* Submit */}
      {mode === 'quiz' && (
        <div style={styles.submitWrap}>
          {!allAnswered && (
            <p style={styles.hint}>{questions.length - answered} questions remaining</p>
          )}
          <button
            style={{ ...styles.submitBtn, opacity: submitting ? 0.7 : 1 }}
            onClick={handleSubmit}
            disabled={submitting || submitted}
          >
            {submitting ? 'Submitting…' : submitted ? '✓ Submitted' : `Submit Quiz (${answered}/${questions.length})`}
          </button>
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
  page: { maxWidth: 760, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' },
  header: { display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' },
  title: { fontFamily: "'Cormorant Garamond', serif", fontSize: '1.8rem', fontWeight: 600, color: 'var(--text)' },
  meta: { fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '0.2rem' },
  modeSwitch: { display: 'flex', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 99, padding: 4, gap: 4 },
  modeBtn: { padding: '0.4rem 1rem', borderRadius: 99, border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '0.82rem', color: 'var(--text-muted)', fontFamily: "'DM Sans', sans-serif" },
  modeBtnActive: { background: 'var(--accent)', color: 'white', fontWeight: 500 },
  progressWrap: { position: 'relative', background: 'var(--border)', borderRadius: 99, height: 6, overflow: 'visible' },
  progressBar: { height: '100%', background: 'var(--accent)', borderRadius: 99, transition: 'width 0.3s ease' },
  progressLabel: { position: 'absolute', right: 0, top: '0.6rem', fontSize: '0.72rem', color: 'var(--text-muted)' },
  cards: { display: 'flex', flexDirection: 'column', gap: '1.2rem' },
  pagination: { display: 'flex', justifyContent: 'center', gap: '0.5rem', flexWrap: 'wrap' },
  pageBtn: {
    padding: '0.45rem 0.9rem', border: '1px solid var(--border)',
    borderRadius: 99, background: 'var(--surface)', cursor: 'pointer',
    fontSize: '0.82rem', color: 'var(--text-muted)', fontFamily: "'DM Sans', sans-serif",
    transition: 'all 0.15s',
  },
  pageBtnActive: { background: 'var(--accent)', color: 'white', borderColor: 'var(--accent)' },
  submitWrap: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.6rem', paddingTop: '1rem' },
  hint: { fontSize: '0.82rem', color: 'var(--text-muted)' },
  submitBtn: {
    padding: '0.9rem 2.5rem', background: 'var(--accent)', color: 'white',
    border: 'none', borderRadius: 99, cursor: 'pointer',
    fontSize: '1rem', fontWeight: 500, fontFamily: "'DM Sans', sans-serif",
    transition: 'background 0.2s',
  },
}
