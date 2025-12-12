import React, { FC } from 'react'
import { useTheme } from '../../contexts/ThemeContext'

type ChartType = 'histogram' | 'bar' | 'scatter' | 'box'

interface ChartSelectorProps {
  chartType: ChartType
  onChartTypeChange: (chartType: ChartType) => void
}

const ChartSelector: FC<ChartSelectorProps> = ({ chartType, onChartTypeChange }) => {
  const { colors } = useTheme()
  const chartOptions = [
    { type: 'histogram', icon: '📈', label: 'Histogram', desc: 'Distribution of continuous data' },
    { type: 'box', icon: '📦', label: 'Box Plot', desc: 'Five-number summary' },
    { type: 'bar', icon: '📊', label: 'Bar Chart', desc: 'Categorical frequencies' },
    { type: 'scatter', icon: '🔵', label: 'Scatter Plot', desc: 'Relationship between variables' }
  ]

  return (
    <div style={{
      ...styles.controls,
      backgroundColor: colors.surface,
      border: `2px solid ${colors.border}`
    }}>
      <div style={styles.controlGroup}>
        <label style={{
          ...styles.label,
          color: colors.text.secondary
        }}>Select Chart Type</label>
        <div style={styles.chartTypeGrid}>
          {chartOptions.map(chart => (
            <button
              key={chart.type}
              style={{
                ...styles.chartTypeButton,
                border: `2px solid ${colors.border}`,
                backgroundColor: colors.background,
                color: colors.text.primary,
                ...(chartType === chart.type ? {
                  borderColor: colors.primary,
                  backgroundColor: colors.primary + '20',
                  fontWeight: '600' as const
                } : {})
              }}
              onClick={() => onChartTypeChange(chart.type as ChartType)}
              title={chart.desc}
            >
              <div>{chart.icon} {chart.label}</div>
              <div style={{
                ...styles.chartTypeDesc,
                color: colors.text.secondary
              }}>{chart.desc}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

const styles = {
  controls: {
    padding: '15px',
    borderRadius: '8px',
    marginBottom: '15px'
  } as const,
  controlGroup: {
    marginBottom: '0'
  } as const,
  label: {
    display: 'block',
    fontSize: '13px',
    fontWeight: '600',
    marginBottom: '6px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  } as const,
  chartTypeGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: '10px'
  } as const,
  chartTypeButton: {
    padding: '12px',
    borderRadius: '8px',
    cursor: 'pointer',
    textAlign: 'center',
    transition: 'all 0.2s',
    fontSize: '13px',
    fontWeight: '500'
  } as const,
  chartTypeDesc: {
    fontSize: '11px',
    marginTop: '4px'
  } as const
}

export default ChartSelector
export type { ChartType }
