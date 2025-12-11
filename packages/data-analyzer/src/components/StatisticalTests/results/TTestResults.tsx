import React, { FC } from 'react'
import { TTestResult } from '../../../utils/statisticalTests'

interface StatItemProps {
  label: string
  value: string
  highlight?: boolean
}

const StatItem: FC<StatItemProps> = ({ label, value, highlight = false }) => (
  <div style={styles.statItem}>
    <span style={styles.statItemLabel}>{label}:</span>
    <span style={{ ...styles.statItemValue, ...(highlight ? styles.statItemHighlight : {}) }}>
      {value}
    </span>
  </div>
)

interface TTestResultsProps {
  result: TTestResult
}

const TTestResults: FC<TTestResultsProps> = ({ result }) => {
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

const styles = {
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
  } as const
}

export default TTestResults
