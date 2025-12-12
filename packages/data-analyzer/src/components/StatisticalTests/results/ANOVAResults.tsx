import React, { FC } from 'react'
import { useTheme } from '../../../contexts/ThemeContext'
import { ANOVAResult } from '../../../utils/statisticalTests'

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

interface ANOVAResultsProps {
  result: ANOVAResult
}

const ANOVAResults: FC<ANOVAResultsProps> = ({ result }) => {
  const { colors } = useTheme()
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

      {/* Group Means Table (at top) */}
      {result.groupStats && result.groupStats.length > 0 && (
        <div style={styles.tableSection}>
          <strong style={{
            ...styles.tableSectionTitle,
            color: colors.text.primary
          }}>Group Summary Statistics</strong>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={{
                  ...styles.tableHeader,
                  backgroundColor: colors.surface,
                  color: colors.text.primary,
                  borderBottom: `2px solid ${colors.border}`
                }}>Group</th>
                <th style={{
                  ...styles.tableHeader,
                  backgroundColor: colors.surface,
                  color: colors.text.primary,
                  borderBottom: `2px solid ${colors.border}`
                }}>N</th>
                <th style={{
                  ...styles.tableHeader,
                  backgroundColor: colors.surface,
                  color: colors.text.primary,
                  borderBottom: `2px solid ${colors.border}`
                }}>Mean</th>
                <th style={{
                  ...styles.tableHeader,
                  backgroundColor: colors.surface,
                  color: colors.text.primary,
                  borderBottom: `2px solid ${colors.border}`
                }}>SD</th>
                <th style={{
                  ...styles.tableHeader,
                  backgroundColor: colors.surface,
                  color: colors.text.primary,
                  borderBottom: `2px solid ${colors.border}`
                }}>Min</th>
                <th style={{
                  ...styles.tableHeader,
                  backgroundColor: colors.surface,
                  color: colors.text.primary,
                  borderBottom: `2px solid ${colors.border}`
                }}>Max</th>
              </tr>
            </thead>
            <tbody>
              {result.groupStats.map((stat, idx) => (
                <tr key={idx}>
                  <td style={{
                    ...styles.tableCell,
                    color: colors.text.primary,
                    borderBottom: `1px solid ${colors.border}`
                  }}>{stat.group}</td>
                  <td style={{
                    ...styles.tableCell,
                    color: colors.text.primary,
                    borderBottom: `1px solid ${colors.border}`
                  }}>{stat.n}</td>
                  <td style={{
                    ...styles.tableCell,
                    color: colors.text.primary,
                    borderBottom: `1px solid ${colors.border}`
                  }}>{stat.mean.toFixed(2)}</td>
                  <td style={{
                    ...styles.tableCell,
                    color: colors.text.primary,
                    borderBottom: `1px solid ${colors.border}`
                  }}>{stat.sd.toFixed(2)}</td>
                  <td style={{
                    ...styles.tableCell,
                    color: colors.text.primary,
                    borderBottom: `1px solid ${colors.border}`
                  }}>{stat.min.toFixed(2)}</td>
                  <td style={{
                    ...styles.tableCell,
                    color: colors.text.primary,
                    borderBottom: `1px solid ${colors.border}`
                  }}>{stat.max.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ANOVA Test Results */}
      <div style={styles.statsGrid}>
        <StatItem label="Effect Size (η²)" value={result.etaSquared.toFixed(4)} />
        <StatItem label="df (between)" value={result.degreesOfFreedomBetween.toString()} />
        <StatItem label="df (within)" value={result.degreesOfFreedomWithin.toString()} />
        <StatItem label="F-statistic" value={result.fStatistic.toFixed(4)} />
        <StatItem
          label="p-value"
          value={result.pValue.toFixed(4)}
          highlight={result.pValue < 0.05}
        />
      </div>

      {/* Post-hoc Pairwise Comparisons */}
      {result.pairwiseComparisons && result.pairwiseComparisons.length > 0 && (
        <div style={styles.tableSection}>
          <strong style={{
            ...styles.tableSectionTitle,
            color: colors.text.primary
          }}>
            Post-hoc Pairwise Comparisons (Bonferroni-corrected)
          </strong>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={{
                  ...styles.tableHeader,
                  backgroundColor: colors.surface,
                  color: colors.text.primary,
                  borderBottom: `2px solid ${colors.border}`
                }}>Group 1</th>
                <th style={{
                  ...styles.tableHeader,
                  backgroundColor: colors.surface,
                  color: colors.text.primary,
                  borderBottom: `2px solid ${colors.border}`
                }}>Group 2</th>
                <th style={{
                  ...styles.tableHeader,
                  backgroundColor: colors.surface,
                  color: colors.text.primary,
                  borderBottom: `2px solid ${colors.border}`
                }}>Mean Diff</th>
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
                }}>Adjusted p-value</th>
              </tr>
            </thead>
            <tbody>
              {result.pairwiseComparisons.map((comp, idx) => (
                <tr
                  key={idx}
                  style={
                    comp.isSignificant
                      ? { ...styles.tableRow, backgroundColor: colors.primary + '20' }
                      : styles.tableRow
                  }
                >
                  <td style={{
                    ...styles.tableCell,
                    color: colors.text.primary,
                    borderBottom: `1px solid ${colors.border}`
                  }}>{comp.group1}</td>
                  <td style={{
                    ...styles.tableCell,
                    color: colors.text.primary,
                    borderBottom: `1px solid ${colors.border}`
                  }}>{comp.group2}</td>
                  <td style={{
                    ...styles.tableCell,
                    color: colors.text.primary,
                    borderBottom: `1px solid ${colors.border}`
                  }}>{comp.meanDiff.toFixed(2)}</td>
                  <td style={{
                    ...styles.tableCell,
                    color: colors.text.primary,
                    borderBottom: `1px solid ${colors.border}`
                  }}>
                    [{comp.ciLower.toFixed(2)}, {comp.ciUpper.toFixed(2)}]
                  </td>
                  <td
                    style={{
                      ...styles.tableCell,
                      color: comp.isSignificant ? '#e74c3c' : colors.text.primary,
                      fontWeight: comp.isSignificant ? 'bold' : 'normal',
                      borderBottom: `1px solid ${colors.border}`
                    }}
                  >
                    {comp.adjustedPValue.toFixed(4)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

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
  } as const,
  tableRow: {
    backgroundColor: 'transparent'
  } as const
}

export default ANOVAResults
