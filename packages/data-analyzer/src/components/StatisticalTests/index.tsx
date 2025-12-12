import React, { FC, useState } from 'react'
import { ParsedData, VariableType } from '../../types'
import { useTheme } from '../../contexts/ThemeContext'
import {
  independentTTest,
  chiSquareTest,
  oneWayANOVA,
  linearRegression,
  groupNumericData,
  TTestResult,
  ChiSquareResult,
  ANOVAResult,
  RegressionResult
} from '../../utils/statisticalTests'
import TestOption from './TestSelection'
import TTestResults from './results/TTestResults'
import ChiSquareResults from './results/ChiSquareResults'
import ANOVAResults from './results/ANOVAResults'
import RegressionResults from './results/RegressionResults'
import TTestPlot from './plots/TTestPlot'
import ChiSquarePlot from './plots/ChiSquarePlot'
import AnovaPlot from './plots/ANOVAPlot'
import RegressionPlot from './plots/RegressionPlot'
import RenderErrorBoundary from '../ErrorBoundary'

interface StatisticalTestsProps {
  data: ParsedData
  variables: VariableType[]
  onBack: () => void
}

type TestType = 't-test' | 'chi-square' | 'anova' | 'regression'
type TestResult = TTestResult | ChiSquareResult | ANOVAResult | RegressionResult | null

const StatisticalTests: FC<StatisticalTestsProps> = ({ data, variables, onBack }) => {
  const { colors } = useTheme()
  const includedVariables = variables.filter(v => v.includeInAnalysis)
  const continuousVars = includedVariables.filter(v => v.type === 'continuous')
  const categoricalVars = includedVariables.filter(v => v.type === 'categorical' || v.type === 'boolean')

  const [selectedTest, setSelectedTest] = useState<TestType>('t-test')
  const [variable1, setVariable1] = useState<string>(continuousVars[0]?.name || '')
  const [variable2, setVariable2] = useState<string>(categoricalVars[0]?.name || '')
  const [testResult, setTestResult] = useState<TestResult>(null)
  const [error, setError] = useState<string>('')

  // Update variable2 when test type changes to ensure correct variable types
  React.useEffect(() => {
    // Compute variable lists inside effect to avoid dependency issues
    const included = variables.filter(v => v.includeInAnalysis)
    const continuous = included.filter(v => v.type === 'continuous')
    const categorical = included.filter(v => v.type === 'categorical' || v.type === 'boolean')

    if (selectedTest === 'regression') {
      // For regression, set variable2 to a continuous variable if current one is not valid
      const isValid = continuous.some(v => v.name === variable2 && v.name !== variable1)
      if (!isValid) {
        // Find first continuous variable that's not variable1
        const var2 = continuous.find(v => v.name !== variable1)
        if (var2) {
          setVariable2(var2.name)
        }
      }
    } else if (selectedTest === 'chi-square') {
      // For chi-square, ensure variable2 is categorical
      const isValid = categorical.some(v => v.name === variable2)
      if (!isValid) {
        const var2 = categorical[0]?.name || ''
        if (var2) {
          setVariable2(var2)
        }
      }
    } else {
      // For t-test and anova, ensure variable2 is categorical
      const isValid = categorical.some(v => v.name === variable2)
      if (!isValid) {
        const var2 = categorical[0]?.name || ''
        if (var2) {
          setVariable2(var2)
        }
      }
    }
  }, [selectedTest, variables])

  const handleRunTest = () => {
    setError('')
    try {
      let result: TestResult = null

      if (selectedTest === 't-test') {
        // Independent samples t-test: continuous outcome by binary categorical predictor
        const groups = groupNumericData(data.rows, variable1, variable2)
        const groupNames = Object.keys(groups)

        if (groupNames.length !== 2) {
          setError('T-test requires exactly 2 groups. Please select a binary categorical variable.')
          return
        }

        result = independentTTest(groups[groupNames[0]], groups[groupNames[1]])
      } else if (selectedTest === 'chi-square') {
        // Chi-square: two categorical variables
        result = chiSquareTest(data.rows, variable1, variable2)
      } else if (selectedTest === 'anova') {
        // One-way ANOVA: continuous outcome by categorical predictor (2+ groups)
        const groups = groupNumericData(data.rows, variable1, variable2)
        result = oneWayANOVA(groups)
      } else if (selectedTest === 'regression') {
        // Linear regression: continuous outcome by continuous predictor
        const paired: { x: number; y: number }[] = []
        data.rows.forEach(row => {
          const x = row[variable2]
          const y = row[variable1]
          if (x !== null && x !== undefined && x !== '' && y !== null && y !== undefined && y !== '') {
            const xNum = typeof x === 'string' ? parseFloat(x) : Number(x)
            const yNum = typeof y === 'string' ? parseFloat(y) : Number(y)
            if (!isNaN(xNum) && !isNaN(yNum)) {
              paired.push({ x: xNum, y: yNum })
            }
          }
        })

        if (paired.length < 3) {
          setError(`Regression requires at least 3 data points. Found: ${paired.length}`)
          return
        }

        result = linearRegression(
          paired.map(p => p.x),
          paired.map(p => p.y),
          variable2,
          variable1
        )
      }

      setTestResult(result)
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error)
      // Log full error to console for debugging
      console.error('Test error:', error)
      // Show user-friendly error message without stack trace
      setError(`Error running test: ${errorMsg}. Please check your data and try again.`)
    }
  }

  return (
    <div style={styles.container}>
      <div style={{
        ...styles.header,
        borderBottom: `2px solid ${colors.border}`
      }}>
        <h2 style={{
          ...styles.title,
          color: colors.text.primary
        }}>Statistical Tests</h2>
        <p style={{
          ...styles.subtitle,
          color: colors.text.secondary
        }}>
          Select a statistical test and variables to analyze relationships in your data
        </p>
      </div>

      {/* Test Selection */}
      <div style={{
        ...styles.controls,
        backgroundColor: colors.surface,
        border: `2px solid ${colors.border}`
      }}>
        <div style={styles.controlGroup}>
          <label style={{
            ...styles.label,
            color: colors.text.secondary
          }}>Select Statistical Test</label>
          <div style={styles.testGrid}>
            <TestOption
              value="t-test"
              label="📊 t-Test"
              description="Compare means between two groups"
              selected={selectedTest === 't-test'}
              onClick={() => setSelectedTest('t-test')}
              requirements="1 continuous + 1 binary categorical"
              disabled={continuousVars.length === 0 || categoricalVars.length === 0}
            />
            <TestOption
              value="chi-square"
              label="📈 Chi-Square"
              description="Test association between categorical variables"
              selected={selectedTest === 'chi-square'}
              onClick={() => setSelectedTest('chi-square')}
              requirements="2 categorical variables"
              disabled={categoricalVars.length < 2}
            />
            <TestOption
              value="anova"
              label="📉 ANOVA"
              description="Compare means across multiple groups"
              selected={selectedTest === 'anova'}
              onClick={() => setSelectedTest('anova')}
              requirements="1 continuous + 1 categorical"
              disabled={continuousVars.length === 0 || categoricalVars.length === 0}
            />
            <TestOption
              value="regression"
              label="📐 Linear Regression"
              description="Model relationship between continuous variables"
              selected={selectedTest === 'regression'}
              onClick={() => setSelectedTest('regression')}
              requirements="2 continuous variables"
              disabled={continuousVars.length < 2}
            />
          </div>
        </div>

        {/* Variable Selection */}
        <div style={styles.variableSelection}>
          <div style={styles.controlGroup}>
            <label style={{
              ...styles.label,
              color: colors.text.secondary
            }}>
              {selectedTest === 'regression' ? 'Outcome Variable (Y)' : 'Variable 1'}
            </label>
            <select
              value={variable1}
              onChange={(e) => setVariable1(e.target.value)}
              style={{
                ...styles.select,
                backgroundColor: colors.background,
                border: `1px solid ${colors.border}`,
                color: colors.text.primary
              }}
            >
              {selectedTest === 'chi-square' ? (
                <>
                  {categoricalVars.map(v => (
                    <option key={v.name} value={v.name}>{v.name}</option>
                  ))}
                </>
              ) : (
                <>
                  {continuousVars.map(v => (
                    <option key={v.name} value={v.name}>{v.name}</option>
                  ))}
                </>
              )}
            </select>
          </div>

          <div style={styles.controlGroup}>
            <label style={{
              ...styles.label,
              color: colors.text.secondary
            }}>
              {selectedTest === 'regression' ? 'Predictor Variable (X)' :
                selectedTest === 't-test' ? 'Grouping Variable' :
                  selectedTest === 'anova' ? 'Grouping Variable' :
                    'Variable 2'}
            </label>
            <select
              value={variable2}
              onChange={(e) => setVariable2(e.target.value)}
              style={{
                ...styles.select,
                backgroundColor: colors.background,
                border: `1px solid ${colors.border}`,
                color: colors.text.primary
              }}
            >
              {selectedTest === 'regression' ? (
                <>
                  {continuousVars.filter(v => v.name !== variable1).map(v => (
                    <option key={v.name} value={v.name}>{v.name}</option>
                  ))}
                </>
              ) : (
                <>
                  {categoricalVars.map(v => (
                    <option key={v.name} value={v.name}>{v.name}</option>
                  ))}
                </>
              )}
            </select>
          </div>

          <button style={{
            ...styles.runButton,
            backgroundColor: colors.primary
          }} onClick={handleRunTest}>
            Run Test
          </button>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div style={{
          backgroundColor: '#fee',
          border: '2px solid #c33',
          borderRadius: '8px',
          padding: '20px',
          marginBottom: '30px',
          fontFamily: 'monospace',
          fontSize: '12px',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
          color: '#c33'
        }}>
          <h4 style={{ marginTop: 0, color: '#c33' }}>❌ Error</h4>
          <code>{error}</code>
        </div>
      )}

      {/* Results Display */}
      {testResult && (
        <RenderErrorBoundary>
          <div style={{
            ...styles.resultsContainer,
            backgroundColor: colors.surface,
            border: `2px solid ${colors.border}`
          }}>
            <h3 style={{
              ...styles.resultsTitle,
              color: colors.text.primary
            }}>Test Results</h3>

            {testResult.testType.includes('t-test') && (
              <>
                <TTestResults result={testResult as TTestResult} />
                <TTestPlot
                  result={testResult as TTestResult}
                  data={data}
                  variable1={variable1}
                  variable2={variable2}
                />
              </>
            )}

            {testResult.testType.includes('Chi-Square') && (
              <>
                <ChiSquareResults result={testResult as ChiSquareResult} />
                <ChiSquarePlot
                  result={testResult as ChiSquareResult}
                  data={data}
                  variable1={variable1}
                  variable2={variable2}
                />
              </>
            )}

            {testResult.testType.includes('ANOVA') && (
              <>
                <ANOVAResults result={testResult as ANOVAResult} />
                <AnovaPlot
                  result={testResult as ANOVAResult}
                  data={data}
                  variable1={variable1}
                  variable2={variable2}
                />
              </>
            )}

            {testResult.testType.includes('Regression') && (
              <>
                <RegressionPlot
                  result={testResult as RegressionResult}
                  data={data}
                  variable1={variable1}
                  variable2={variable2}
                />
                <RegressionResults result={testResult as RegressionResult} />
              </>
            )}
          </div>
        </RenderErrorBoundary>
      )}

      {/* Actions */}
      <div style={{
        ...styles.actions,
        borderTop: `2px solid ${colors.border}`
      }}>
        <button style={{
          ...styles.backButton,
          backgroundColor: colors.surface,
          color: colors.text.primary,
          border: `1px solid ${colors.border}`
        }} onClick={onBack}>
          ← Back to Visualization
        </button>
      </div>
    </div>
  )
}

const styles = {
  container: {
    padding: '30px 20px',
    maxWidth: '1400px',
    margin: '0 auto'
  } as const,
  header: {
    marginBottom: '30px',
    paddingBottom: '20px'
  } as const,
  title: {
    margin: '0 0 10px 0',
    fontSize: '28px',
    fontWeight: 'bold'
  } as const,
  subtitle: {
    margin: 0,
    fontSize: '14px'
  } as const,
  controls: {
    padding: '20px',
    borderRadius: '8px',
    marginBottom: '30px'
  } as const,
  controlGroup: {
    marginBottom: '20px'
  } as const,
  label: {
    display: 'block',
    fontSize: '13px',
    fontWeight: '600',
    marginBottom: '8px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  } as const,
  testGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '15px'
  } as const,
  variableSelection: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr auto',
    gap: '15px',
    alignItems: 'end'
  } as const,
  select: {
    width: '100%',
    padding: '10px',
    fontSize: '14px',
    borderRadius: '6px'
  } as const,
  runButton: {
    padding: '10px 30px',
    fontSize: '14px',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '600',
    height: '42px'
  } as const,
  resultsContainer: {
    padding: '20px',
    borderRadius: '8px',
    marginBottom: '30px'
  } as const,
  resultsTitle: {
    margin: '0 0 20px 0',
    fontSize: '20px',
    fontWeight: '600'
  } as const,
  actions: {
    display: 'flex',
    gap: '15px',
    justifyContent: 'flex-end',
    paddingTop: '20px'
  } as const,
  backButton: {
    padding: '12px 24px',
    fontSize: '14px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '600'
  } as const
}

export default StatisticalTests
