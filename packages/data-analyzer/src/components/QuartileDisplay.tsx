import React, { FC } from 'react'
import { formatStatistic } from '../utils/statistics'

interface QuartileDisplayProps {
  min: number
  q1: number
  median: number
  q3: number
  max: number
}

/**
 * Compact display of quartiles and range
 * Shows: Median, Q1-Q3, Min-Max in minimal space
 */
const QuartileDisplay: FC<QuartileDisplayProps> = ({
  min,
  q1,
  median,
  q3,
  max
}) => {
  return (
    <div style={styles.container}>
      <div style={styles.row}>
        <span style={styles.label}>Median:</span>
        <span style={styles.value}>{formatStatistic(median)}</span>
      </div>
      <div style={styles.row}>
        <span style={styles.label}>Q1 - Q3:</span>
        <span style={styles.value}>
          {formatStatistic(q1)} - {formatStatistic(q3)}
        </span>
      </div>
      <div style={styles.row}>
        <span style={styles.label}>Min - Max:</span>
        <span style={styles.value}>
          {formatStatistic(min)} - {formatStatistic(max)}
        </span>
      </div>
    </div>
  )
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '6px'
  },
  row: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '6px 0',
    borderBottom: '1px solid #eee'
  } as const,
  label: {
    fontSize: '13px',
    color: '#666'
  } as const,
  value: {
    fontSize: '13px',
    fontWeight: '600' as const,
    color: '#333',
    fontFamily: 'monospace'
  } as const
}

export default QuartileDisplay
