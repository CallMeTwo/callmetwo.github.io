import React, { FC } from 'react'
import { useTheme } from '../../../contexts/ThemeContext'
import { RegressionResult } from '../../../utils/statisticalTests'

interface StatItemProps {
  label: string
  value: string
  highlight?: boolean
}

const StatItem: FC<StatItemProps> = ({ label, value, highlight = false }) => {
  const { colors } = useTheme()
  return (
    <div style={{
      ...styles.statItem,
      backgroundColor: colors.background,
      border: `1px solid ${colors.border}`
    }}>
      <span style={{
        ...styles.statItemLabel,
        color: colors.text.secondary
      }}>{label}:</span>
      <span style={{
        ...styles.statItemValue,
        color: highlight ? '#e74c3c' : colors.text.primary
      }}>
        {value}
      </span>
    </div>
  )
}

interface RegressionResultsProps {
  result: RegressionResult
}

const RegressionResults: FC<RegressionResultsProps> = ({ result }) => {
  const { colors } = useTheme()
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
    <div style={{
      ...styles.resultCard,
      backgroundColor: colors.surface,
      border: `1px solid ${colors.border}`
    }}>
      <h4 style={{
        ...styles.resultCardTitle,
        color: colors.text.primary
      }}>{result.testType}</h4>

      {/* Coefficient Table (Intercept + Predictors) */}
      <div style={styles.tableSection}>
        <strong style={{
          ...styles.tableSectionTitle,
          color: colors.text.primary
        }}>Coefficient Estimates</strong>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={{
                ...styles.tableHeader,
                backgroundColor: colors.surface,
                color: colors.text.primary,
                borderBottom: `2px solid ${colors.border}`
              }}>Variable</th>
              <th style={{
                ...styles.tableHeader,
                backgroundColor: colors.surface,
                color: colors.text.primary,
                borderBottom: `2px solid ${colors.border}`
              }}>Coefficient</th>
              <th style={{
                ...styles.tableHeader,
                backgroundColor: colors.surface,
                color: colors.text.primary,
                borderBottom: `2px solid ${colors.border}`
              }}>Std. Error</th>
              <th style={{
                ...styles.tableHeader,
                backgroundColor: colors.surface,
                color: colors.text.primary,
                borderBottom: `2px solid ${colors.border}`
              }}>95% CI</th>
              <th style={{
                ...styles.tableHeader,
                backgroundColor: colors.surface,
                color: colors.text.primary,
                borderBottom: `2px solid ${colors.border}`
              }}>p-value</th>
            </tr>
          </thead>
          <tbody>
            {/* Intercept row */}
            <tr>
              <td style={{
                ...styles.tableCell,
                color: colors.text.primary,
                borderBottom: `1px solid ${colors.border}`
              }}>(Intercept)</td>
              <td style={{
                ...styles.tableCell,
                color: colors.text.primary,
                borderBottom: `1px solid ${colors.border}`
              }}>{result.intercept.toFixed(4)}</td>
              <td style={{
                ...styles.tableCell,
                color: colors.text.primary,
                borderBottom: `1px solid ${colors.border}`
              }}>{(result.interceptSE || 0).toFixed(4)}</td>
              <td style={{
                ...styles.tableCell,
                color: colors.text.primary,
                borderBottom: `1px solid ${colors.border}`
              }}>
                {formatCI(result.interceptCILower, result.interceptCIUpper)}
              </td>
              <td
                style={{
                  ...styles.tableCell,
                  color: (result.interceptPValue && result.interceptPValue < 0.05) ? '#e74c3c' : colors.text.primary,
                  fontWeight: (result.interceptPValue && result.interceptPValue < 0.05) ? 'bold' : 'normal',
                  borderBottom: `1px solid ${colors.border}`
                }}
              >
                {formatPValue(result.interceptPValue)}
              </td>
            </tr>
            {/* Predictor rows */}
            {result.coefficients.map((coef, idx) => (
              <tr key={idx}>
                <td style={{
                  ...styles.tableCell,
                  color: colors.text.primary,
                  borderBottom: `1px solid ${colors.border}`
                }}>{coef.variable}</td>
                <td style={{
                  ...styles.tableCell,
                  color: colors.text.primary,
                  borderBottom: `1px solid ${colors.border}`
                }}>{coef.coefficient.toFixed(4)}</td>
                <td style={{
                  ...styles.tableCell,
                  color: colors.text.primary,
                  borderBottom: `1px solid ${colors.border}`
                }}>{coef.standardError.toFixed(4)}</td>
                <td style={{
                  ...styles.tableCell,
                  color: colors.text.primary,
                  borderBottom: `1px solid ${colors.border}`
                }}>
                  {formatCI(coef.ciLower, coef.ciUpper)}
                </td>
                <td
                  style={{
                    ...styles.tableCell,
                    color: coef.pValue < 0.05 ? '#e74c3c' : colors.text.primary,
                    fontWeight: coef.pValue < 0.05 ? 'bold' : 'normal',
                    borderBottom: `1px solid ${colors.border}`
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

      <div style={{
        ...styles.interpretation,
        backgroundColor: colors.primary + '20',
        color: colors.text.primary
      }}>
        <strong>Interpretation:</strong> {result.interpretation}
      </div>
    </div>
  )
}

const styles = {
  resultCard: {
    padding: '20px',
    borderRadius: '8px'
  } as const,
  resultCardTitle: {
    margin: '0 0 15px 0',
    fontSize: '18px',
    fontWeight: '600'
  } as const,
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '15px',
    marginBottom: '20px'
  } as const,
  statItem: {
    padding: '10px',
    borderRadius: '6px'
  } as const,
  statItemLabel: {
    display: 'block',
    fontSize: '12px',
    marginBottom: '5px'
  } as const,
  statItemValue: {
    display: 'block',
    fontSize: '18px',
    fontWeight: 'bold',
    fontFamily: 'monospace'
  } as const,
  interpretation: {
    padding: '15px',
    borderRadius: '6px',
    fontSize: '14px',
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
    fontWeight: '600',
    fontSize: '13px'
  } as const,
  tableCell: {
    padding: '10px',
    fontSize: '13px',
    fontFamily: 'monospace'
  } as const
}

export default RegressionResults
