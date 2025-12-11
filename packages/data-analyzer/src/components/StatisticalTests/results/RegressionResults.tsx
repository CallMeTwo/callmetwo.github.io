import React, { FC } from 'react'
import { RegressionResult } from '../../../utils/statisticalTests'

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

interface RegressionResultsProps {
  result: RegressionResult
}

const RegressionResults: FC<RegressionResultsProps> = ({ result }) => {
  const formatCI = (lower: number | undefined, upper: number | undefined) => {
    if (lower === undefined || upper === undefined) return 'N/A'
    return `[${lower.toFixed(2)}, ${upper.toFixed(2)}]`
  }

  const formatPValue = (p: number | undefined) => {
    if (p === undefined) return 'N/A'
    if (p < 0.001) return '< 0.001'
    return p.toFixed(4)
  }

  return (
    <div style={styles.resultCard}>
      <h4 style={styles.resultCardTitle}>{result.testType}</h4>

      {/* Coefficient Table (Intercept + Predictors) */}
      <div style={styles.tableSection}>
        <strong style={styles.tableSectionTitle}>Coefficient Estimates</strong>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.tableHeader}>Variable</th>
              <th style={styles.tableHeader}>Coefficient</th>
              <th style={styles.tableHeader}>Std. Error</th>
              <th style={styles.tableHeader}>95% CI</th>
              <th style={styles.tableHeader}>p-value</th>
            </tr>
          </thead>
          <tbody>
            {/* Intercept row */}
            <tr>
              <td style={styles.tableCell}>(Intercept)</td>
              <td style={styles.tableCell}>{result.intercept.toFixed(4)}</td>
              <td style={styles.tableCell}>{(result.interceptSE || 0).toFixed(4)}</td>
              <td style={styles.tableCell}>
                {formatCI(result.interceptCILower, result.interceptCIUpper)}
              </td>
              <td
                style={{
                  ...styles.tableCell,
                  ...(result.interceptPValue && result.interceptPValue < 0.05
                    ? styles.significant
                    : {})
                }}
              >
                {formatPValue(result.interceptPValue)}
              </td>
            </tr>
            {/* Predictor rows */}
            {result.coefficients.map((coef, idx) => (
              <tr key={idx}>
                <td style={styles.tableCell}>{coef.variable}</td>
                <td style={styles.tableCell}>{coef.coefficient.toFixed(4)}</td>
                <td style={styles.tableCell}>{coef.standardError.toFixed(4)}</td>
                <td style={styles.tableCell}>
                  {formatCI(coef.ciLower, coef.ciUpper)}
                </td>
                <td
                  style={{
                    ...styles.tableCell,
                    ...(coef.pValue < 0.05 ? styles.significant : {})
                  }}
                >
                  {formatPValue(coef.pValue)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Regression Statistics */}
      <div style={styles.statsGrid}>
        {result.rSquared !== undefined && (
          <>
            <StatItem label="R²" value={result.rSquared.toFixed(4)} />
            <StatItem label="Adjusted R²" value={result.adjustedRSquared?.toFixed(4) || 'N/A'} />
          </>
        )}
        {result.fStatistic !== undefined && (
          <>
            <StatItem label="F-statistic" value={result.fStatistic.toFixed(4)} />
            <StatItem
              label="p-value (overall)"
              value={formatPValue(result.fPValue)}
              highlight={result.fPValue !== undefined && result.fPValue < 0.05}
            />
          </>
        )}
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
  } as const,
  tableSection: {
    marginBottom: '20px'
  } as const,
  tableSectionTitle: {
    display: 'block',
    fontSize: '14px',
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: '10px',
    marginTop: '15px'
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
  } as const
}

export default RegressionResults
