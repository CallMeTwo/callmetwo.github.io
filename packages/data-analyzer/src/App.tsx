import { useState, FC } from 'react'
import { Navbar } from 'shared'
import FileUpload from './components/FileUpload'
import DataPreview from './components/DataPreview'
import TypeVerification from './components/TypeVerification'
import { ParsedData, VariableType } from './types'
import { inferVariableType, getSampleValues } from './utils/fileParser'

type WorkflowStep = 'upload' | 'preview' | 'exploration' | 'summary' | 'visualization' | 'test-selection' | 'results'

const App: FC = () => {
  const [currentStep, setCurrentStep] = useState<WorkflowStep>('upload')
  const [parsedData, setParsedData] = useState<ParsedData | null>(null)
  const [variables, setVariables] = useState<VariableType[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const handleDataLoaded = (data: ParsedData) => {
    setIsLoading(true)

    // Infer variable types
    const inferredVariables: VariableType[] = data.columns.map(col => {
      const columnValues = data.rows.map(row => row[col])
      const uniqueCount = new Set(columnValues).size
      const inferredType = inferVariableType(col, columnValues, uniqueCount)
      const sampleValues = getSampleValues(columnValues, 3)

      return {
        name: col,
        type: inferredType,
        inferredType,
        sampleValues,
        uniqueCount,
        includeInAnalysis: true
      }
    })

    setParsedData(data)
    setVariables(inferredVariables)
    setIsLoading(false)
    setCurrentStep('preview')
  }

  const handleContinueFromPreview = () => {
    setCurrentStep('exploration')
  }

  const handleVariablesUpdate = (updatedVariables: VariableType[]) => {
    setVariables(updatedVariables)
  }

  const handleContinueFromExploration = () => {
    setCurrentStep('summary')
  }

  const handleBackFromExploration = () => {
    setCurrentStep('preview')
  }

  const handleCancelUpload = () => {
    setParsedData(null)
    setVariables([])
    setCurrentStep('upload')
  }

  return (
    <div style={styles.appContainer}>
      <Navbar breadcrumbs={[{ label: 'Data Analyzer' }]} />

      <header style={styles.header}>
        <h1 style={styles.mainTitle}>📊 Data Analyzer</h1>
        <p style={styles.subtitle}>Upload or paste your data to analyze and visualize it</p>
      </header>

      {/* Step indicator */}
      <div style={styles.stepsContainer}>
        <StepIndicator
          steps={['Upload', 'Preview', 'Type Verification', 'Summary', 'Visualization', 'Test Selection', 'Results']}
          currentStepIndex={getStepIndex(currentStep)}
        />
      </div>

      <main style={styles.mainContent}>
        {currentStep === 'upload' && (
          <FileUpload
            onDataLoaded={handleDataLoaded}
            isLoading={isLoading}
          />
        )}

        {currentStep === 'preview' && parsedData && (
          <DataPreview
            data={parsedData}
            onContinue={handleContinueFromPreview}
            onCancel={handleCancelUpload}
          />
        )}

        {currentStep === 'exploration' && variables.length > 0 && (
          <TypeVerification
            variables={variables}
            onVariablesUpdate={handleVariablesUpdate}
            onContinue={handleContinueFromExploration}
            onBack={handleBackFromExploration}
          />
        )}

        {currentStep === 'summary' && (
          <div style={styles.placeholderSection}>
            <h2>Summary Statistics</h2>
            <p>Coming in next step...</p>
          </div>
        )}
      </main>

      <footer style={styles.footer}>
        <p style={styles.footerText}>
          Data analysis tools for educational and analytical purposes
        </p>
      </footer>
    </div>
  )
}

interface StepIndicatorProps {
  steps: string[]
  currentStepIndex: number
}

const StepIndicator: FC<StepIndicatorProps> = ({ steps, currentStepIndex }) => {
  return (
    <div style={styles.stepIndicator}>
      {steps.map((step, idx) => (
        <div key={idx} style={styles.stepWrapper}>
          <div
            style={{
              ...styles.stepCircle,
              ...(idx <= currentStepIndex ? styles.stepCircleActive : {}),
              ...(idx === currentStepIndex ? styles.stepCircleCurrent : {})
            }}
          >
            {idx <= currentStepIndex ? '✓' : idx + 1}
          </div>
          <div style={styles.stepLabel}>{step}</div>
          {idx < steps.length - 1 && (
            <div
              style={{
                ...styles.stepConnector,
                ...(idx < currentStepIndex ? styles.stepConnectorActive : {})
              }}
            />
          )}
        </div>
      ))}
    </div>
  )
}

function getStepIndex(step: WorkflowStep): number {
  const stepMap: Record<WorkflowStep, number> = {
    upload: 0,
    preview: 1,
    exploration: 2,
    summary: 3,
    visualization: 4,
    'test-selection': 5,
    results: 6
  }
  return stepMap[step]
}

const styles = {
  appContainer: {
    minHeight: '100vh',
    backgroundColor: '#f5f5f5',
    fontFamily: 'Arial, sans-serif',
    display: 'flex',
    flexDirection: 'column'
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
  stepsContainer: {
    backgroundColor: 'white',
    padding: '20px',
    borderBottom: '1px solid #eee',
    overflowX: 'auto' as const
  },
  stepIndicator: {
    display: 'flex',
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 20px',
    gap: '0'
  } as const,
  stepWrapper: {
    display: 'flex',
    alignItems: 'center',
    flex: 1,
    position: 'relative'
  } as const,
  stepCircle: {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    backgroundColor: '#f0f0f0',
    border: '2px solid #ddd',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '12px',
    fontWeight: 'bold',
    color: '#999',
    flexShrink: 0
  } as const,
  stepCircleActive: {
    backgroundColor: '#3498db',
    borderColor: '#3498db',
    color: 'white'
  } as const,
  stepCircleCurrent: {
    backgroundColor: '#2980b9',
    borderColor: '#2980b9',
    boxShadow: '0 0 0 4px rgba(52, 152, 219, 0.2)'
  } as const,
  stepLabel: {
    marginLeft: '10px',
    fontSize: '12px',
    fontWeight: '600',
    color: '#666',
    whiteSpace: 'nowrap'
  } as const,
  stepConnector: {
    position: 'absolute',
    left: '54px',
    top: '17px',
    height: '2px',
    backgroundColor: '#ddd',
    flex: 1,
    width: 'calc(100% - 54px)',
    zIndex: -1
  } as any,
  stepConnectorActive: {
    backgroundColor: '#3498db'
  } as const,
  mainContent: {
    flex: 1,
    padding: '30px 20px'
  } as const,
  placeholderSection: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '60px 20px',
    backgroundColor: 'white',
    borderRadius: '8px',
    textAlign: 'center' as const
  },
  footer: {
    backgroundColor: '#f0f0f0',
    padding: '20px',
    textAlign: 'center' as const,
    marginTop: 'auto',
    borderTop: '1px solid #ddd'
  },
  footerText: {
    margin: 0,
    fontSize: '13px',
    color: '#666'
  } as const
}

export default App
