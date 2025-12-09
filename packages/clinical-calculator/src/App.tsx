import { useState, FC } from 'react'
import { Navbar } from 'shared'
import ScoreSelector from './components/ScoreSelector'
import VariableForm from './components/VariableForm'
import ResultDisplay from './components/ResultDisplay'
import { calculateScore, getScoreSystem } from './utils/scoring'
import { scoringSystems } from './data/scoreDefinitions'

// Clinical Calculator App - Multiple scoring systems for medical risk assessment
const App: FC = () => {
  const [selectedScore, setSelectedScore] = useState('wells')
  const [formValues, setFormValues] = useState<Record<string, number | boolean>>(() => {
    const initial: Record<string, number | boolean> = {}
    scoringSystems.wells.variables.forEach(v => {
      initial[v.id] = v.type === 'checkbox' ? false : 0
    })
    return initial
  })
  const [result, setResult] = useState<{ score: number; interpretation: any } | null>(null)

  const currentScoreSystem = scoringSystems[selectedScore]

  const handleScoreChange = (scoreId: string) => {
    setSelectedScore(scoreId)
    // Reset form when score changes
    const newValues: Record<string, number | boolean> = {}
    scoringSystems[scoreId].variables.forEach(v => {
      newValues[v.id] = v.type === 'checkbox' ? false : 0
    })
    setFormValues(newValues)
    setResult(null)
  }

  const handleFormChange = (newValues: Record<string, number | boolean>) => {
    setFormValues(newValues)
    // Calculate in real-time
    const { score, interpretation } = calculateScore(selectedScore, newValues)
    setResult({ score, interpretation })
  }

  return (
    <div style={styles.appContainer}>
      <Navbar breadcrumbs={[{ label: 'Clinical Calculator' }]} />
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
  } as const,
  header: {
    backgroundColor: '#2c3e50',
    color: 'white',
    padding: '40px 20px',
    textAlign: 'center' as const
  },
  mainTitle: {
    margin: '0 0 10px 0',
    fontSize: '32px',
    fontWeight: 'bold'
  } as const,
  subtitle: {
    margin: 0,
    fontSize: '16px',
    opacity: 0.9
  } as const,
  mainContent: {
    maxWidth: '1000px',
    margin: '0 auto',
    padding: '30px 20px'
  } as const,
  calculatorSection: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '20px',
    marginTop: '20px'
  } as const,
  footer: {
    backgroundColor: '#f0f0f0',
    padding: '20px',
    textAlign: 'center' as const,
    marginTop: '40px',
    borderTop: '1px solid #ddd'
  },
  footerText: {
    margin: 0,
    fontSize: '13px',
    color: '#666'
  } as const
}

export default App
