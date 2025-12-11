import { useState, FC } from 'react'
import AppHeader from './components/AppHeader'
import FileUpload from './components/FileUpload'
import DataPreview from './components/DataPreview'
import TypeVerification from './components/TypeVerification'
import SummaryStatistics from './components/SummaryStatistics'
import Visualization from './components/Visualization'
import StatisticalTests from './components/StatisticalTests'
import { RenderErrorBoundary } from './components/ErrorBoundary'
import { useTheme } from './contexts/ThemeContext'
import { ParsedData, VariableType } from './types'
import { inferVariableType, getSampleValues } from './utils/fileParser'

type WorkflowStep = 'upload' | 'preview' | 'exploration' | 'summary' | 'visualization' | 'test-selection'

const App: FC = () => {
  const { colors } = useTheme()
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
      const sampleValues = getSampleValues(columnValues, 5)

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

  const handleBackFromSummary = () => {
    setCurrentStep('exploration')
  }

  const handleContinueFromSummary = () => {
    setCurrentStep('visualization')
  }

  const handleBackFromVisualization = () => {
    setCurrentStep('summary')
  }

  const handleContinueFromVisualization = () => {
    setCurrentStep('test-selection')
  }

  const handleBackFromTestSelection = () => {
    setCurrentStep('visualization')
  }

  const handleCancelUpload = () => {
    setParsedData(null)
    setVariables([])
    setCurrentStep('upload')
  }

  const handleStepClick = (stepIndex: number) => {
    // Only allow navigation if data is loaded (except for upload step)
    if (stepIndex === 0) {
      setCurrentStep('upload')
    } else if (parsedData !== null) {
      const stepMap: WorkflowStep[] = ['upload', 'preview', 'exploration', 'summary', 'visualization', 'test-selection']
      setCurrentStep(stepMap[stepIndex])
    }
  }

  return (
    <div style={{
      ...styles.appContainer,
      backgroundColor: colors.background,
      color: colors.text.primary
    }}>
      <AppHeader />

      {/* Step indicator */}
      <div style={{
        ...styles.stepsContainer,
        backgroundColor: colors.surface,
        borderBottom: `1px solid ${colors.border}`
      }}>
        <StepIndicator
          steps={['Upload', 'Preview', 'Type Verification', 'Summary', 'Visualization', 'Statistical Tests']}
          currentStepIndex={getStepIndex(currentStep)}
          onStepClick={handleStepClick}
          dataLoaded={parsedData !== null}
        />
      </div>

      <main style={styles.mainContent}>
        <RenderErrorBoundary>
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

          {currentStep === 'summary' && parsedData && variables.length > 0 && (
            <SummaryStatistics
              data={parsedData}
              variables={variables}
              onContinue={handleContinueFromSummary}
              onBack={handleBackFromSummary}
            />
          )}

          {currentStep === 'visualization' && parsedData && variables.length > 0 && (
            <Visualization
              data={parsedData}
              variables={variables}
              onContinue={handleContinueFromVisualization}
              onBack={handleBackFromVisualization}
            />
          )}

          {currentStep === 'test-selection' && parsedData && variables.length > 0 && (
            <StatisticalTests
              data={parsedData}
              variables={variables}
              onBack={handleBackFromTestSelection}
            />
          )}
        </RenderErrorBoundary>
      </main>

      <footer style={{
        ...styles.footer,
        backgroundColor: colors.surface,
        borderTop: `1px solid ${colors.border}`
      }}>
        <p style={{
          ...styles.footerText,
          color: colors.text.secondary
        }}>
          Data analysis tools for educational and analytical purposes
        </p>
      </footer>
    </div>
  )
}

interface StepIndicatorProps {
  steps: string[]
  currentStepIndex: number
  onStepClick: (stepIndex: number) => void
  dataLoaded: boolean
}

const StepIndicator: FC<StepIndicatorProps> = ({ steps, currentStepIndex, onStepClick, dataLoaded }) => {
  const { colors } = useTheme()
  return (
    <div style={styles.stepIndicator}>
      {steps.map((step, idx) => {
        const isClickable = idx === 0 || dataLoaded
        const handleClick = () => isClickable && onStepClick(idx)
        return (
          <div key={idx} style={styles.stepWrapper}>
            <div
              style={{
                ...styles.stepCircle,
                backgroundColor: colors.surface,
                borderColor: colors.border,
                color: colors.text.secondary,
                ...(idx <= currentStepIndex ? {
                  backgroundColor: colors.primary,
                  borderColor: colors.primary,
                  color: 'white'
                } : {}),
                ...(idx === currentStepIndex ? {
                  backgroundColor: colors.primary,
                  borderColor: colors.primary,
                  boxShadow: `0 0 0 4px ${colors.primary}33`
                } : {}),
                ...(isClickable ? styles.stepCircleClickable : {})
              }}
              onClick={handleClick}
            >
              {idx <= currentStepIndex ? '✓' : idx + 1}
            </div>
            <div
              style={{
                ...styles.stepLabel,
                color: colors.text.secondary,
                ...(isClickable ? styles.stepLabelClickable : {})
              }}
              onClick={handleClick}
            >
              {step}
            </div>
            {idx < steps.length - 1 && (
              <div
                style={{
                  ...styles.stepConnector,
                  backgroundColor: colors.border,
                  ...(idx < currentStepIndex ? {
                    backgroundColor: colors.primary
                  } : {})
                }}
              />
            )}
          </div>
        )
      })}
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
    'test-selection': 5
  }
  return stepMap[step]
}

const styles = {
  appContainer: {
    minHeight: '100vh',
    fontFamily: 'Arial, sans-serif',
    display: 'flex',
    flexDirection: 'column'
  } as const,
  header: {
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
    padding: '20px',
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
    border: '2px solid',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '12px',
    fontWeight: 'bold',
    flexShrink: 0
  } as const,
  stepCircleClickable: {
    cursor: 'pointer'
  } as const,
  stepLabel: {
    marginLeft: '10px',
    fontSize: '12px',
    fontWeight: '600',
    whiteSpace: 'nowrap'
  } as const,
  stepLabelClickable: {
    cursor: 'pointer'
  } as const,
  stepConnector: {
    position: 'absolute',
    left: '54px',
    top: '17px',
    height: '2px',
    flex: 1,
    width: 'calc(100% - 54px)',
    zIndex: -1
  } as React.CSSProperties,
  mainContent: {
    flex: 1,
    padding: '30px 20px'
  } as const,
  placeholderSection: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '60px 20px',
    borderRadius: '8px',
    textAlign: 'center' as const
  },
  footer: {
    padding: '20px',
    textAlign: 'center' as const,
    marginTop: 'auto'
  },
  footerText: {
    margin: 0,
    fontSize: '13px'
  } as const
}

export default App
