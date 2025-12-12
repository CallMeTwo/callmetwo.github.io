import React, { FC } from 'react'
import { useTheme } from '../../../contexts/ThemeContext'
import { ChiSquareResult } from '../../../utils/statisticalTests'

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

interface ChiSquareResultsProps {
  result: ChiSquareResult
}

const ChiSquareResults: FC<ChiSquareResultsProps> = ({ result }) => {
  const { colors } = useTheme()
  const formatValue = (value: number | null | undefined): string => {
    if (value === null || value === undefined || isNaN(value)) {
      return 'N/A'
    }
    return value.toFixed(4)
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
      <div style={styles.statsGrid}>
        {/* Show Odds Ratio first if 2x2 table */}
        {result.oddsRatio !== undefined && (
          <>
            <StatItem
              label="Odds Ratio"
              value={formatValue(result.oddsRatio)}
            />
            <StatItem
              label="95% CI (OR)"
              value={
                result.oddsRatioCI
                  ? `[${result.oddsRatioCI[0].toFixed(2)}, ${result.oddsRatioCI[1].toFixed(2)}]`
                  : 'N/A'
              }
            />
          </>
        )}
        <StatItem label="Effect Size (Cramér's V)" value={result.cramersV.toFixed(4)} />
        <StatItem label="χ² statistic" value={result.statistic.toFixed(4)} />
        <StatItem label="Degrees of Freedom" value={result.degreesOfFreedom.toString()} />
        <StatItem
          label="p-value"
          value={result.pValue.toFixed(4)}
          highlight={result.pValue < 0.05}
        />
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
  } as const
}

export default ChiSquareResults
