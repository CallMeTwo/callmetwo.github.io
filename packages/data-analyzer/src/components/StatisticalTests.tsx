import React, { FC, useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ErrorBar } from 'recharts'
import ReactECharts from 'echarts-for-react'
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
import { createHistogram, createBoxPlotData, getUniqueGroups, CHART_COLORS } from '../utils/visualization'

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

// T-Test Results (Rearranged Order)
const TTestResults: FC<{ result: TTestResult }> = ({ result }) => {
  const formatValue = (value: number | null | undefined): string => {
    if (value === null || value === undefined || isNaN(value)) {
      return 'N/A'
    }
    return value.toFixed(4)
  }

  return (
    <div style={styles.resultCard}>
      <h4 style={styles.resultCardTitle}>{result.testType}</h4>
      <div style={styles.statsGrid}>
        <StatItem
          label="Mean Difference"
          value={formatValue(result.meanDifference)}
        />
        <StatItem
          label="95% CI"
          value={
            result.confidenceInterval &&
            !isNaN(result.confidenceInterval[0]) &&
            !isNaN(result.confidenceInterval[1])
              ? `[${result.confidenceInterval[0].toFixed(2)}, ${result.confidenceInterval[1].toFixed(2)}]`
              : 'N/A'
          }
        />
        <StatItem
          label="Effect Size (Cohen's d)"
          value={formatValue(result.effectSize)}
        />
        <StatItem
          label="t-statistic"
          value={formatValue(result.statistic)}
        />
        <StatItem
          label="Degrees of Freedom"
          value={result.degreesOfFreedom?.toString() || 'N/A'}
        />
        <StatItem
          label="p-value"
          value={formatValue(result.pValue)}
          highlight={result.pValue !== null && !isNaN(result.pValue) && result.pValue < 0.05}
        />
      </div>
      <div style={styles.interpretation}>
        <strong>Interpretation:</strong> {result.interpretation}
      </div>
    </div>
  )
}

// T-Test Plot Component with Multiple Visualization Options
interface TTestPlotProps {
  result: TTestResult
  data: ParsedData
  variable1: string
  variable2: string
}

type TTestPlotType = 'boxplot' | 'meanCI' | 'histogram'

const TTestPlot: FC<TTestPlotProps> = ({ result, data, variable1, variable2 }) => {
  const [plotType, setPlotType] = useState<TTestPlotType>('boxplot')

  // Extract group data
  const groups = groupNumericData(data.rows, variable1, variable2)
  const groupNames = Object.keys(groups).sort()

  if (groupNames.length !== 2) {
    return null
  }

  const group1Name = groupNames[0]
  const group2Name = groupNames[1]
  const group1Data = groups[group1Name]
  const group2Data = groups[group2Name]

  // Side-by-Side Boxplot
  const renderBoxPlot = () => {
    const box1 = createBoxPlotData(group1Data)
    const box2 = createBoxPlotData(group2Data)

    if (!box1 || !box2) return null

    const createBoxPlotValues = (boxData: any) => [
      boxData.min,
      boxData.q1,
      boxData.median,
      boxData.q3,
      boxData.max,
      ...boxData.outliers
    ]

    const box1Values = createBoxPlotValues(box1)
    const box2Values = createBoxPlotValues(box2)

    const option = {
      title: {
        text: `Box Plot: ${variable1} by ${variable2}`,
        left: 'center',
        textStyle: { fontSize: 16, fontWeight: 'bold', color: '#333' }
      },
      tooltip: {
        trigger: 'item',
        formatter: (params: any) => {
          if (params.seriesType === 'boxplot') {
            const [min, q1, median, q3, max] = params.value
            const groupName = groupNames[params.dataIndex]
            return `<div style="padding: 5px;"><strong>${groupName}</strong><br/>Min: ${min.toFixed(2)}<br/>Q1: ${q1.toFixed(2)}<br/>Median: ${median.toFixed(2)}<br/>Q3: ${q3.toFixed(2)}<br/>Max: ${max.toFixed(2)}</div>`
          }
          return params.name
        }
      },
      grid: { left: '10%', right: '10%', bottom: '15%', top: '15%', containLabel: true },
      xAxis: {
        type: 'category',
        data: [group1Name, group2Name],
        axisLabel: { fontSize: 12 }
      },
      yAxis: {
        type: 'value',
        name: 'Value',
        nameTextStyle: { color: '#666', fontSize: 12 },
        axisLabel: { fontSize: 12 }
      },
      series: [
        {
          name: 'Box Plot',
          type: 'boxplot',
          data: [box1Values, box2Values],
          itemStyle: {
            color: (params: any) => CHART_COLORS.palette[params.dataIndex],
            borderColor: '#333'
          },
          boxWidth: ['20%', '50%']
        },
        {
          name: 'Outliers',
          type: 'scatter',
          data: [
            ...box1.outliers.map(v => [0, v]),
            ...box2.outliers.map(v => [1, v])
          ],
          symbolSize: 4,
          itemStyle: { opacity: 0.6, color: '#e74c3c' }
        }
      ]
    }

    return (
      <ReactECharts
        option={option}
        style={{ height: '400px', width: '100%' }}
        notMerge
        lazyUpdate
      />
    )
  }

  // Mean ± 95% CI Plot
  const renderMeanCIPlot = () => {
    // Calculate statistics for group 1
    const n1 = group1Data.length
    const mean1 = group1Data.reduce((a, b) => a + b, 0) / n1
    const variance1 = group1Data.reduce((sum, val) => sum + Math.pow(val - mean1, 2), 0) / (n1 - 1)
    const sd1 = Math.sqrt(variance1)
    const se1 = sd1 / Math.sqrt(n1)

    // Calculate statistics for group 2
    const n2 = group2Data.length
    const mean2 = group2Data.reduce((a, b) => a + b, 0) / n2
    const variance2 = group2Data.reduce((sum, val) => sum + Math.pow(val - mean2, 2), 0) / (n2 - 1)
    const sd2 = Math.sqrt(variance2)
    const se2 = sd2 / Math.sqrt(n2)

    // Get t-critical value for 95% CI (two-tailed, alpha=0.05)
    // Using approximation: for df > 30, t ≈ 1.96
    const getTCritical = (df: number) => {
      // Common t-values for 95% CI (two-tailed)
      const tValues: { [key: number]: number } = {
        1: 12.706, 2: 4.303, 3: 3.182, 4: 2.776, 5: 2.571,
        6: 2.447, 7: 2.365, 8: 2.306, 9: 2.262, 10: 2.228,
        15: 2.131, 20: 2.086, 25: 2.060, 30: 2.042
      }
      if (tValues[df]) return tValues[df]
      return df > 30 ? 1.96 : 2.045 // Default for larger df
    }

    const t1 = getTCritical(n1 - 1)
    const t2 = getTCritical(n2 - 1)

    const data = [
      {
        group: group1Name,
        mean: mean1,
        error: t1 * se1
      },
      {
        group: group2Name,
        mean: mean2,
        error: t2 * se2
      }
    ]

    return (
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="group" />
          <YAxis label={{ value: variable1, angle: -90, position: 'insideLeft' }} />
          <Tooltip
            formatter={(value: any) => (typeof value === 'number' ? value.toFixed(2) : value)}
            contentStyle={{ backgroundColor: '#fff', border: '1px solid #ccc' }}
          />
          <Bar dataKey="mean" fill={CHART_COLORS.primary} radius={[8, 8, 0, 0]}>
            <ErrorBar
              dataKey="error"
              direction="y"
              stroke="#333"
              strokeWidth={2}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    )
  }

  // Histogram with Group Colors
  const renderHistogram = () => {
    const hist1 = createHistogram(group1Data, 10)
    const hist2 = createHistogram(group2Data, 10)

    // Merge histograms by bin
    const mergedData = hist1.map((bin1, idx) => {
      const bin2 = hist2[idx]
      return {
        label: bin1.label,
        [group1Name]: bin1.count,
        [group2Name]: bin2.count
      }
    })

    return (
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={mergedData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="label"
            label={{ value: variable1, position: 'insideBottom', offset: -5 }}
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis label={{ value: 'Frequency', angle: -90, position: 'insideLeft' }} />
          <Tooltip />
          <Legend />
          <Bar dataKey={group1Name} fill={CHART_COLORS.palette[0]} />
          <Bar dataKey={group2Name} fill={CHART_COLORS.palette[1]} />
        </BarChart>
      </ResponsiveContainer>
    )
  }

  return (
    <div style={styles.visualizationContainer}>
      <h4 style={styles.visualizationTitle}>Visualization</h4>

      {/* Plot Type Selection */}
      <div style={styles.plotTypeSelector}>
        <label style={styles.label}>Choose Visualization:</label>
        <div style={styles.radioGroup}>
          {[
            { value: 'boxplot', label: '📦 Side-by-Side Boxplot' },
            { value: 'meanCI', label: '📊 Mean ± 95% CI Plot' },
            { value: 'histogram', label: '📈 Histogram with Group Colors' }
          ].map(option => (
            <label key={option.value} style={styles.radioLabel}>
              <input
                type="radio"
                value={option.value}
                checked={plotType === option.value}
                onChange={(e) => setPlotType(e.target.value as TTestPlotType)}
                style={styles.radioInput}
              />
              {option.label}
            </label>
          ))}
        </div>
      </div>

      {/* Plot Display */}
      <div style={styles.plotContainer}>
        {plotType === 'boxplot' && renderBoxPlot()}
        {plotType === 'meanCI' && renderMeanCIPlot()}
        {plotType === 'histogram' && renderHistogram()}
      </div>
    </div>
  )
}

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
  } as const,
  visualizationContainer: {
    padding: '20px',
    backgroundColor: '#f9f9f9',
    borderRadius: '8px',
    border: '1px solid #e0e0e0',
    marginTop: '20px'
  } as const,
  visualizationTitle: {
    margin: '0 0 15px 0',
    fontSize: '18px',
    fontWeight: '600',
    color: '#2c3e50'
  } as const,
  plotTypeSelector: {
    marginBottom: '20px',
    padding: '15px',
    backgroundColor: 'white',
    borderRadius: '6px',
    border: '1px solid #e0e0e0'
  } as const,
  radioGroup: {
    display: 'flex',
    gap: '20px',
    flexWrap: 'wrap',
    marginTop: '10px'
  } as const,
  radioLabel: {
    display: 'flex',
    alignItems: 'center',
    fontSize: '14px',
    color: '#333',
    cursor: 'pointer',
    gap: '8px'
  } as const,
  radioInput: {
    cursor: 'pointer',
    marginRight: '4px'
  } as const,
  plotContainer: {
    backgroundColor: 'white',
    borderRadius: '6px',
    border: '1px solid #e0e0e0',
    padding: '15px',
    minHeight: '450px'
  } as const
}

export default StatisticalTests
