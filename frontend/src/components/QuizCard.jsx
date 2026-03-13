import React, { useState } from 'react'

const DIFF_COLORS = {
  easy:   { bg: '#e6f7ef', color: '#4a9e6f', label: 'Easy' },
  medium: { bg: '#fef3e2', color: '#c98a2b', label: 'Medium' },
  hard:   { bg: '#fce8e8', color: '#c05454', label: 'Hard' },
}

export default function QuizCard({
  question, index, mode, onAnswer, userAnswer, revealed
}) {
  const [flipped, setFlipped] = useState(false)
  const [selected, setSelected] = useState(userAnswer || null)

  const diff = DIFF_COLORS[question.difficulty] || DIFF_COLORS.medium
  const isStudyMode = mode === 'study'

  const handleSelect = (opt) => {
    if (isStudyMode || revealed) return
    setSelected(opt)
    onAnswer(index, opt)
  }

  const handleFlip = () => {
    if (isStudyMode) { setFlipped(f => !f); return }
    if (revealed) setFlipped(f => !f)
  }

  const showCorrect = isStudyMode || revealed

  const getOptionStyle = (opt) => {
    if (!showCorrect && opt !== selected) return styles.option
    if (opt === question.answer) return { ...styles.option, ...styles.correct }
    if (opt === selected && opt !== question.answer) return { ...styles.option, ...styles.wrong }
    return styles.option
  }

  return (
    <div style={styles.wrap} className="flip-card fade-up">
      <div
        className={`flip-card-inner${flipped ? ' flipped' : ''}`}
        style={styles.inner}
      >
        {/* FRONT */}
        <div className="flip-card-front" style={styles.card}>
          <div style={styles.header}>
            <span style={styles.num}>Q{index + 1}</span>
            <span style={{ ...styles.badge, background: diff.bg, color: diff.color }}>
              {diff.label}
            </span>
          </div>
          <p style={styles.question}>{question.question}</p>
          <div style={styles.options}>
            {question.options.map((opt, i) => (
              <button
                key={i}
                style={getOptionStyle(opt)}
                onClick={() => handleSelect(opt)}
              >
                <span style={styles.optLetter}>{String.fromCharCode(65 + i)}</span>
                <span>{opt}</span>
              </button>
            ))}
          </div>
          {(showCorrect || isStudyMode) && (
            <button style={styles.flipBtn} onClick={handleFlip}>
              {flipped ? '↩ Back to question' : '💡 See explanation'}
            </button>
          )}
        </div>

        {/* BACK */}
        <div className="flip-card-back" style={{ ...styles.card, ...styles.backCard }}>
          <div style={styles.header}>
            <span style={styles.num}>Q{index + 1}</span>
            <span style={{ ...styles.badge, background: diff.bg, color: diff.color }}>
              {diff.label}
            </span>
          </div>
          <div style={styles.answerBox}>
            <span style={styles.answerLabel}>✓ Correct Answer</span>
            <p style={styles.answerText}>{question.answer}</p>
          </div>
          <div style={styles.explanationBox}>
            <p style={styles.explanationLabel}>Explanation</p>
            <p style={styles.explanation}>{question.explanation}</p>
          </div>
          <button style={styles.flipBtn} onClick={handleFlip}>↩ Back to question</button>
        </div>
      </div>
    </div>
  )
}

const styles = {
  wrap: { width: '100%' },
  inner: { width: '100%', minHeight: 360, position: 'relative' },
  card: {
    position: 'absolute', top: 0, left: 0, right: 0,
    background: 'var(--surface-raised)',
    borderRadius: 'var(--radius)',
    padding: '1.8rem',
    boxShadow: 'var(--shadow-md)',
    border: '1px solid var(--border)',
    display: 'flex', flexDirection: 'column', gap: '1rem',
    minHeight: 360,
  },
  backCard: { background: 'var(--accent-light)', border: '1px solid var(--accent-soft)' },
  header: { display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  num: { fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.05em' },
  badge: {
    fontSize: '0.72rem', fontWeight: 600, padding: '2px 10px',
    borderRadius: 99, letterSpacing: '0.03em',
  },
  question: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: '1.15rem', fontWeight: 500, color: 'var(--text)', lineHeight: 1.5,
  },
  options: { display: 'flex', flexDirection: 'column', gap: '0.6rem' },
  option: {
    display: 'flex', alignItems: 'center', gap: '0.75rem',
    padding: '0.7rem 1rem', borderRadius: 'var(--radius-sm)',
    border: '1.5px solid var(--border)', background: 'var(--bg)',
    cursor: 'pointer', textAlign: 'left', fontSize: '0.88rem',
    color: 'var(--text)', transition: 'all 0.15s ease',
    fontFamily: "'DM Sans', sans-serif",
  },
  correct: { borderColor: 'var(--success)', background: '#edf9f2', color: '#2d7a4f' },
  wrong: { borderColor: 'var(--error)', background: '#fdf0f0', color: '#a84040' },
  optLetter: {
    minWidth: 22, height: 22, borderRadius: '50%',
    background: 'var(--accent-light)', color: 'var(--accent)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '0.72rem', fontWeight: 700, flexShrink: 0,
  },
  flipBtn: {
    marginTop: 'auto', background: 'transparent',
    border: '1px solid var(--accent-soft)', color: 'var(--accent)',
    borderRadius: 99, padding: '0.45rem 1rem', cursor: 'pointer',
    fontSize: '0.8rem', fontFamily: "'DM Sans', sans-serif",
    alignSelf: 'flex-start', transition: 'background 0.15s',
  },
  answerBox: {
    background: 'white', borderRadius: 'var(--radius-sm)',
    padding: '1rem', border: '1px solid var(--accent-soft)',
  },
  answerLabel: { fontSize: '0.75rem', fontWeight: 600, color: 'var(--success)', display: 'block', marginBottom: '0.3rem' },
  answerText: { fontFamily: "'Cormorant Garamond', serif", fontSize: '1.1rem', fontWeight: 600, color: 'var(--text)' },
  explanationBox: { flex: 1 },
  explanationLabel: { fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.4rem', letterSpacing: '0.05em' },
  explanation: { fontSize: '0.9rem', color: 'var(--text)', lineHeight: 1.65 },
}
