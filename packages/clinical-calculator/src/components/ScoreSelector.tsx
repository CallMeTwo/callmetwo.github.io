import React, { FC } from 'react'
import { scoringSystems } from '../data/scoreDefinitions'

interface ScoreSelectorProps {
  selectedScore: string
  onScoreChange: (scoreId: string) => void
}

const ScoreSelector: FC<ScoreSelectorProps> = ({ selectedScore, onScoreChange }) => {
  const scores = Object.values(scoringSystems)

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Select Clinical Score</h2>
      <p style={styles.subtitle}>Choose a scoring system to calculate clinical risk assessment</p>

      <div style={styles.gridContainer}>
        {scores.map((score) => (
          <button
            key={score.id}
            onClick={() => onScoreChange(score.id)}
            style={{
              ...styles.scoreCard,
              ...(selectedScore === score.id && styles.selectedCard)
            }}
          >
            <h3 style={styles.scoreName}>{score.name}</h3>
            <p style={styles.scoreDescription}>{score.description}</p>
            <span style={styles.selectIndicator}>
              {selectedScore === score.id ? '✓ Selected' : 'Select'}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}

const styles = {
  container: {
    marginBottom: '30px'
  } as const,
  title: {
    color: '#333',
    marginTop: 0,
    marginBottom: '10px',
    fontSize: '24px'
  } as const,
  subtitle: {
    color: '#666',
    marginBottom: '20px',
    fontSize: '14px'
  } as const,
  gridContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '15px',
    marginBottom: '20px'
  } as const,
  scoreCard: {
    padding: '20px',
    border: '2px solid #ddd',
    borderRadius: '8px',
    backgroundColor: 'white',
    cursor: 'pointer',
    textAlign: 'left' as const,
    transition: 'all 0.3s ease',
    fontSize: '14px',
    fontFamily: 'inherit'
  } as any,
  selectedCard: {
    borderColor: '#007bff',
    backgroundColor: '#e7f3ff',
    boxShadow: '0 4px 8px rgba(0, 123, 255, 0.2)'
  } as const,
  scoreName: {
    margin: '0 0 10px 0',
    color: '#333',
    fontSize: '16px',
    fontWeight: '600'
  } as const,
  scoreDescription: {
    margin: '0 0 15px 0',
    color: '#666',
    fontSize: '13px',
    lineHeight: '1.5'
  } as const,
  selectIndicator: {
    display: 'inline-block',
    padding: '6px 12px',
    borderRadius: '20px',
    backgroundColor: '#007bff',
    color: 'white',
    fontSize: '12px',
    fontWeight: '600'
  } as const
}

export default ScoreSelector
