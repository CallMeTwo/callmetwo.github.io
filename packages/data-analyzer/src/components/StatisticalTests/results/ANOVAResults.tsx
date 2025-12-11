import React, { FC } from 'react'
import { ANOVAResult } from '../../../utils/statisticalTests'

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

interface ANOVAResultsProps {
  result: ANOVAResult
}

const ANOVAResults: FC<ANOVAResultsProps> = ({ result }) => {
  return (
    <div style={styles.resultCard}>
      <h4 style={styles.resultCardTitle}>{result.testType}</h4>

      {/* Group Means Table (at top) */}
      {result.groupStats && result.groupStats.length > 0 && (
        <div style={styles.tableSection}>
          <strong style={styles.tableSectionTitle}>Group Summary Statistics</strong>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.tableHeader}>Group</th>
                <th style={styles.tableHeader}>N</th>
                <th style={styles.tableHeader}>Mean</th>
                <th style={styles.tableHeader}>SD</th>
                <th style={styles.tableHeader}>Min</th>
                <th style={styles.tableHeader}>Max</th>
              </tr>
            </thead>
            <tbody>
              {result.groupStats.map((stat, idx) => (
                <tr key={idx}>
                  <td style={styles.tableCell}>{stat.group}</td>
                  <td style={styles.tableCell}>{stat.n}</td>
                  <td style={styles.tableCell}>{stat.mean.toFixed(2)}</td>
                  <td style={styles.tableCell}>{stat.sd.toFixed(2)}</td>
                  <td style={styles.tableCell}>{stat.min.toFixed(2)}</td>
                  <td style={styles.tableCell}>{stat.max.toFixed(2)}</td>
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
          <strong style={styles.tableSectionTitle}>
            Post-hoc Pairwise Comparisons (Bonferroni-corrected)
          </strong>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.tableHeader}>Group 1</th>
                <th style={styles.tableHeader}>Group 2</th>
                <th style={styles.tableHeader}>Mean Diff</th>
                <th style={styles.tableHeader}>95% CI</th>
                <th style={styles.tableHeader}>Adjusted p-value</th>
              </tr>
            </thead>
            <tbody>
              {result.pairwiseComparisons.map((comp, idx) => (
                <tr
                  key={idx}
                  style={
                    comp.isSignificant
                      ? { ...styles.tableRow, backgroundColor: '#fff3cd' }
                      : styles.tableRow
                  }
                >
                  <td style={styles.tableCell}>{comp.group1}</td>
                  <td style={styles.tableCell}>{comp.group2}</td>
                  <td style={styles.tableCell}>{comp.meanDiff.toFixed(2)}</td>
                  <td style={styles.tableCell}>
                    [{comp.ciLower.toFixed(2)}, {comp.ciUpper.toFixed(2)}]
                  </td>
                  <td
                    style={{
                      ...styles.tableCell,
                      ...(comp.isSignificant ? { color: '#e74c3c', fontWeight: 'bold' } : {})
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
  tableRow: {
    backgroundColor: 'transparent'
  } as const
}

export default ANOVAResults
