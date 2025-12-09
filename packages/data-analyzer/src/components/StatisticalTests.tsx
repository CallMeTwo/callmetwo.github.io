import React, { FC, useState } from 'react'
import { ParsedData, VariableType } from '../types'
import {
  independentTTest,
  chiSquareTest,
  oneWayANOVA,
  linearRegression,
  extractNumericValues,
  groupNumericData,
  TTestResult,
  ChiSquareResult,
  ANOVAResult,
  RegressionResult
} from '../utils/statisticalTests'

interface StatisticalTestsProps {
  data: ParsedData
  variables: VariableType[]
  onBack: () => void
}

type TestType = 't-test' | 'chi-square' | 'anova' | 'regression'
type TestResult = TTestResult | ChiSquareResult | ANOVAResult | RegressionResult | null

const StatisticalTests: FC<StatisticalTestsProps> = ({ data, variables, onBack }) => {
  const includedVariables = variables.filter(v => v.includeInAnalysis)
  const continuousVars = includedVariables.filter(v => v.type === 'continuous')
  const categoricalVars = includedVariables.filter(v => v.type === 'categorical' || v.type === 'boolean')

  const [selectedTest, setSelectedTest] = useState<TestType>('t-test')
  const [variable1, setVariable1] = useState<string>(continuousVars[0]?.name || '')
  const [variable2, setVariable2] = useState<string>(categoricalVars[0]?.name || '')
  const [testResult, setTestResult] = useState<TestResult>(null)

  const handleRunTest = () => {
    try {
      let result: TestResult = null

      if (selectedTest === 't-test') {
        // Independent samples t-test: continuous outcome by binary categorical predictor
        const groups = groupNumericData(data.rows, variable1, variable2)
        const groupNames = Object.keys(groups)

        if (groupNames.length !== 2) {
          alert('T-test requires exactly 2 groups. Please select a binary categorical variable.')
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
        const xValues = extractNumericValues(data.rows, variable2)
        const yValues = extractNumericValues(data.rows, variable1)

        // Match lengths (remove rows with missing values in either variable)
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
          alert('Regression requires at least 3 data points.')
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
      alert(`Error running test: ${error instanceof Error ? error.message : 'Unknown error'}`)
      console.error(error)
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>Statistical Tests</h2>
        <p style={styles.subtitle}>
          Select a statistical test and variables to analyze relationships in your data
        </p>
      </div>

      {/* Test Selection */}
      <div style={styles.controls}>
        <div style={styles.controlGroup}>
          <label style={styles.label}>Select Statistical Test</label>
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
            <label style={styles.label}>
              {selectedTest === 'regression' ? 'Outcome Variable (Y)' : 'Variable 1'}
            </label>
            <select
              value={variable1}
              onChange={(e) => setVariable1(e.target.value)}
              style={styles.select}
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
            <label style={styles.label}>
              {selectedTest === 'regression' ? 'Predictor Variable (X)' :
                selectedTest === 't-test' ? 'Grouping Variable' :
                  selectedTest === 'anova' ? 'Grouping Variable' :
                    'Variable 2'}
            </label>
            <select
              value={variable2}
              onChange={(e) => setVariable2(e.target.value)}
              style={styles.select}
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

          <button style={styles.runButton} onClick={handleRunTest}>
            Run Test
          </button>
        </div>
      </div>

      {/* Results Display */}
      {testResult && (
        <div style={styles.resultsContainer}>
          <h3 style={styles.resultsTitle}>Test Results</h3>

          {testResult.testType.includes('t-test') && (
            <TTestResults result={testResult as TTestResult} />
          )}

          {testResult.testType.includes('Chi-Square') && (
            <ChiSquareResults result={testResult as ChiSquareResult} />
          )}

          {testResult.testType.includes('ANOVA') && (
            <ANOVAResults result={testResult as ANOVAResult} />
          )}

          {testResult.testType.includes('Regression') && (
            <RegressionResults result={testResult as RegressionResult} />
          )}
        </div>
      )}

      {/* Actions */}
      <div style={styles.actions}>
        <button style={styles.backButton} onClick={onBack}>
          ← Back to Visualization
        </button>
      </div>
    </div>
  )
}

// Test Option Component
interface TestOptionProps {
  value: string
  label: string
  description: string
  requirements: string
  selected: boolean
  disabled: boolean
  onClick: () => void
}

const TestOption: FC<TestOptionProps> = ({
  label,
  description,
  requirements,
  selected,
  disabled,
  onClick
}) => {
  return (
    <button
      style={{
        ...styles.testOption,
        ...(selected ? styles.testOptionSelected : {}),
        ...(disabled ? styles.testOptionDisabled : {})
      }}
      onClick={onClick}
      disabled={disabled}
    >
      <div style={styles.testLabel}>{label}</div>
      <div style={styles.testDescription}>{description}</div>
      <div style={styles.testRequirements}>{requirements}</div>
    </button>
  )
}

// T-Test Results
const TTestResults: FC<{ result: TTestResult }> = ({ result }) => (
  <div style={styles.resultCard}>
    <h4 style={styles.resultCardTitle}>{result.testType}</h4>
    <div style={styles.statsGrid}>
      <StatItem label="t-statistic" value={result.statistic.toFixed(4)} />
      <StatItem label="Degrees of Freedom" value={result.degreesOfFreedom.toString()} />
      <StatItem label="p-value" value={result.pValue.toFixed(4)} highlight={result.pValue < 0.05} />
      <StatItem label="Mean Difference" value={result.meanDifference.toFixed(4)} />
      <StatItem
        label="95% CI"
        value={`[${result.confidenceInterval[0].toFixed(2)}, ${result.confidenceInterval[1].toFixed(2)}]`}
      />
      <StatItem label="Effect Size (Cohen's d)" value={result.effectSize.toFixed(4)} />
    </div>
    <div style={styles.interpretation}>
      <strong>Interpretation:</strong> {result.interpretation}
    </div>
  </div>
)

// Chi-Square Results
const ChiSquareResults: FC<{ result: ChiSquareResult }> = ({ result }) => (
  <div style={styles.resultCard}>
    <h4 style={styles.resultCardTitle}>{result.testType}</h4>
    <div style={styles.statsGrid}>
      <StatItem label="χ² statistic" value={result.statistic.toFixed(4)} />
      <StatItem label="Degrees of Freedom" value={result.degreesOfFreedom.toString()} />
      <StatItem label="p-value" value={result.pValue.toFixed(4)} highlight={result.pValue < 0.05} />
      <StatItem label="Effect Size (Cramér's V)" value={result.cramersV.toFixed(4)} />
    </div>
    <div style={styles.interpretation}>
      <strong>Interpretation:</strong> {result.interpretation}
    </div>
  </div>
)

// ANOVA Results
const ANOVAResults: FC<{ result: ANOVAResult }> = ({ result }) => (
  <div style={styles.resultCard}>
    <h4 style={styles.resultCardTitle}>{result.testType}</h4>
    <div style={styles.statsGrid}>
      <StatItem label="F-statistic" value={result.fStatistic.toFixed(4)} />
      <StatItem label="df (between)" value={result.degreesOfFreedomBetween.toString()} />
      <StatItem label="df (within)" value={result.degreesOfFreedomWithin.toString()} />
      <StatItem label="p-value" value={result.pValue.toFixed(4)} highlight={result.pValue < 0.05} />
      <StatItem label="Effect Size (η²)" value={result.etaSquared.toFixed(4)} />
    </div>
    <div style={styles.groupMeans}>
      <strong>Group Means:</strong>
      <div style={styles.groupMeansGrid}>
        {Object.entries(result.groupMeans).map(([group, mean]) => (
          <div key={group} style={styles.groupMeanItem}>
            <span style={styles.groupName}>{group}:</span>
            <span style={styles.groupValue}>{mean.toFixed(2)}</span>
          </div>
        ))}
      </div>
    </div>
    <div style={styles.interpretation}>
      <strong>Interpretation:</strong> {result.interpretation}
    </div>
  </div>
)

// Regression Results
const RegressionResults: FC<{ result: RegressionResult }> = ({ result }) => (
  <div style={styles.resultCard}>
    <h4 style={styles.resultCardTitle}>{result.testType}</h4>
    <div style={styles.statsGrid}>
      <StatItem label="Intercept" value={result.intercept.toFixed(4)} />
      {result.coefficients.map((coef, idx) => (
        <StatItem key={idx} label={`${coef.variable} coefficient`} value={coef.coefficient.toFixed(4)} />
      ))}
      {result.rSquared !== undefined && (
        <>
          <StatItem label="R²" value={result.rSquared.toFixed(4)} />
          <StatItem label="Adjusted R²" value={result.adjustedRSquared!.toFixed(4)} />
        </>
      )}
      {result.fStatistic !== undefined && (
        <StatItem label="F-statistic" value={result.fStatistic.toFixed(4)} />
      )}
    </div>
    <div style={styles.coefficientsTable}>
      <strong>Coefficient Details:</strong>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.tableHeader}>Variable</th>
            <th style={styles.tableHeader}>Coefficient</th>
            <th style={styles.tableHeader}>Std. Error</th>
            <th style={styles.tableHeader}>p-value</th>
          </tr>
        </thead>
        <tbody>
          {result.coefficients.map((coef, idx) => (
            <tr key={idx}>
              <td style={styles.tableCell}>{coef.variable}</td>
              <td style={styles.tableCell}>{coef.coefficient.toFixed(4)}</td>
              <td style={styles.tableCell}>{coef.standardError.toFixed(4)}</td>
              <td style={{ ...styles.tableCell, ...(coef.pValue < 0.05 ? styles.significant : {}) }}>
                {coef.pValue.toFixed(4)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    <div style={styles.interpretation}>
      <strong>Interpretation:</strong> {result.interpretation}
    </div>
  </div>
)

// Stat Item Component
const StatItem: FC<{ label: string; value: string; highlight?: boolean }> = ({
  label,
  value,
  highlight = false
}) => (
  <div style={styles.statItem}>
    <span style={styles.statItemLabel}>{label}:</span>
    <span style={{ ...styles.statItemValue, ...(highlight ? styles.statItemHighlight : {}) }}>
      {value}
    </span>
  </div>
)

const styles = {
  container: {
    padding: '30px 20px',
    maxWidth: '1400px',
    margin: '0 auto'
  } as const,
  header: {
    marginBottom: '30px',
    paddingBottom: '20px',
    borderBottom: '2px solid #eee'
  } as const,
  title: {
    margin: '0 0 10px 0',
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#333'
  } as const,
  subtitle: {
    margin: 0,
    fontSize: '14px',
    color: '#666'
  } as const,
  controls: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    marginBottom: '30px',
    border: '2px solid #e0e0e0'
  } as const,
  controlGroup: {
    marginBottom: '20px'
  } as const,
  label: {
    display: 'block',
    fontSize: '13px',
    fontWeight: '600',
    color: '#666',
    marginBottom: '8px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  } as const,
  testGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '15px'
  } as const,
  testOption: {
    padding: '15px',
    border: '2px solid #e0e0e0',
    borderRadius: '8px',
    backgroundColor: 'white',
    cursor: 'pointer',
    textAlign: 'left',
    transition: 'all 0.2s'
  } as const,
  testOptionSelected: {
    borderColor: '#3498db',
    backgroundColor: '#f0f8ff'
  } as const,
  testOptionDisabled: {
    opacity: 0.5,
    cursor: 'not-allowed'
  } as const,
  testLabel: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#333',
    marginBottom: '8px'
  } as const,
  testDescription: {
    fontSize: '13px',
    color: '#666',
    marginBottom: '8px'
  } as const,
  testRequirements: {
    fontSize: '11px',
    color: '#999',
    fontStyle: 'italic'
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
    border: '1px solid #ddd',
    borderRadius: '6px',
    backgroundColor: 'white'
  } as const,
  runButton: {
    padding: '10px 30px',
    fontSize: '14px',
    backgroundColor: '#2ecc71',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '600',
    height: '42px'
  } as const,
  resultsContainer: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    border: '2px solid #e0e0e0',
    marginBottom: '30px'
  } as const,
  resultsTitle: {
    margin: '0 0 20px 0',
    fontSize: '20px',
    fontWeight: '600',
    color: '#333'
  } as const,
  resultCard: {
    padding: '20px',
    backgroundColor: '#f9f9f9',
    borderRadius: '8px',
    border: '1px solid #e0e0e0'
  } as const,
  resultCardTitle: {
    margin: '0 0 15px 0',
    fontSize: '18px',
    fontWeight: '600',
    color: '#2c3e50'
  } as const,
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '15px',
    marginBottom: '20px'
  } as const,
  statItem: {
    padding: '10px',
    backgroundColor: 'white',
    borderRadius: '6px',
    border: '1px solid #e0e0e0'
  } as const,
  statItemLabel: {
    display: 'block',
    fontSize: '12px',
    color: '#666',
    marginBottom: '5px'
  } as const,
  statItemValue: {
    display: 'block',
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#333',
    fontFamily: 'monospace'
  } as const,
  statItemHighlight: {
    color: '#e74c3c'
  } as const,
  interpretation: {
    padding: '15px',
    backgroundColor: '#e8f5e9',
    borderRadius: '6px',
    fontSize: '14px',
    color: '#333',
    lineHeight: '1.6',
    marginTop: '15px'
  } as const,
  groupMeans: {
    marginBottom: '15px'
  } as const,
  groupMeansGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
    gap: '10px',
    marginTop: '10px'
  } as const,
  groupMeanItem: {
    padding: '8px 12px',
    backgroundColor: 'white',
    borderRadius: '4px',
    border: '1px solid #e0e0e0'
  } as const,
  groupName: {
    fontSize: '12px',
    color: '#666',
    marginRight: '8px'
  } as const,
  groupValue: {
    fontSize: '14px',
    fontWeight: 'bold',
    color: '#333',
    fontFamily: 'monospace'
  } as const,
  coefficientsTable: {
    marginBottom: '15px'
  } as const,
  table: {
    width: '100%',
    marginTop: '10px',
    borderCollapse: 'collapse'
  } as const,
  tableHeader: {
    textAlign: 'left',
    padding: '10px',
    backgroundColor: '#f0f0f0',
    fontWeight: '600',
    fontSize: '13px',
    color: '#333',
    borderBottom: '2px solid #ddd'
  } as const,
  tableCell: {
    padding: '10px',
    fontSize: '13px',
    color: '#333',
    borderBottom: '1px solid #eee',
    fontFamily: 'monospace'
  } as const,
  significant: {
    color: '#e74c3c',
    fontWeight: 'bold'
  } as const,
  actions: {
    display: 'flex',
    gap: '15px',
    justifyContent: 'flex-end',
    paddingTop: '20px',
    borderTop: '2px solid #eee'
  } as const,
  backButton: {
    padding: '12px 24px',
    fontSize: '14px',
    backgroundColor: '#f0f0f0',
    color: '#333',
    border: '1px solid #ddd',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '600'
  } as const
}

export default StatisticalTests
