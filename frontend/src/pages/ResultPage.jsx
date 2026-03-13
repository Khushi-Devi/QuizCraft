import React from 'react'
import { useLocation, useParams } from 'react-router-dom'
import ScoreCard from '../components/ScoreCard'

export default function ResultPage() {
  const { attemptId } = useParams()
  const { state } = useLocation()

  if (!state?.result) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
        <p>Result not found. Please attempt a quiz first.</p>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: 600, margin: '0 auto' }}>
      <ScoreCard result={state.result} quizId={state.quizId} />
    </div>
  )
}
