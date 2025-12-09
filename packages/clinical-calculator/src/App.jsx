import { useState } from 'react'
import ScoreSelector from './components/ScoreSelector'
import VariableForm from './components/VariableForm'
import ResultDisplay from './components/ResultDisplay'
import { scoringSystems, calculateScore } from './data/scores'

export default function App() {
  const [selectedScore, setSelectedScore] = useState('wells')
  const [formValues, setFormValues] = useState(() => {
    const initial = {}
    scoringSystems.wells.variables.forEach(v => {
      initial[v.id] = v.type === 'checkbox' ? false : 0
    })
    return initial
  })
  const [result, setResult] = useState(null)

  const currentScoreSystem = scoringSystems[selectedScore]

  const handleScoreChange = (scoreId) => {
    setSelectedScore(scoreId)
    // Reset form when score changes
    const newValues = {}
    scoringSystems[scoreId].variables.forEach(v => {
      newValues[v.id] = v.type === 'checkbox' ? false : 0
    })
    setFormValues(newValues)
    setResult(null)
  }

  const handleFormChange = (newValues) => {
    setFormValues(newValues)
    // Calculate in real-time
    const { score, interpretation } = calculateScore(selectedScore, newValues)
    setResult({ score, interpretation })
  }

  return (
    <div style={styles.appContainer}>
      <header style={styles.header}>
        <h1 style={styles.mainTitle}>⚕️ Clinical Calculator</h1>
        <p style={styles.subtitle}>Calculate clinical risk scores and interpretations</p>
      </header>

      <main style={styles.mainContent}>
        <ScoreSelector
          selectedScore={selectedScore}
          onScoreChange={handleScoreChange}
        />

        <div style={styles.calculatorSection}>
          <VariableForm
            scoreSystem={currentScoreSystem}
            values={formValues}
            onChange={handleFormChange}
          />

          <ResultDisplay
            score={result?.score}
            interpretation={result?.interpretation}
          />
        </div>
      </main>

      <footer style={styles.footer}>
        <p style={styles.footerText}>
          Clinical scoring systems for educational and reference purposes only.
        </p>
      </footer>
    </div>
  )
}

const styles = {
  appContainer: {
    minHeight: '100vh',
    backgroundColor: '#f5f5f5',
    fontFamily: 'Arial, sans-serif'
  },
  header: {
    backgroundColor: '#2c3e50',
    color: 'white',
    padding: '40px 20px',
    textAlign: 'center'
  },
  mainTitle: {
    margin: '0 0 10px 0',
    fontSize: '32px',
    fontWeight: 'bold'
  },
  subtitle: {
    margin: 0,
    fontSize: '16px',
    opacity: 0.9
  },
  mainContent: {
    maxWidth: '1000px',
    margin: '0 auto',
    padding: '30px 20px'
  },
  calculatorSection: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '20px',
    marginTop: '20px'
  },
  footer: {
    backgroundColor: '#f0f0f0',
    padding: '20px',
    textAlign: 'center',
    marginTop: '40px',
    borderTop: '1px solid #ddd'
  },
  footerText: {
    margin: 0,
    fontSize: '13px',
    color: '#666'
  }
}
