import React, { FC } from 'react'

type ChartType = 'histogram' | 'bar' | 'scatter' | 'box'

interface ChartSelectorProps {
  chartType: ChartType
  onChartTypeChange: (chartType: ChartType) => void
}

const ChartSelector: FC<ChartSelectorProps> = ({ chartType, onChartTypeChange }) => {
  const chartOptions = [
    { type: 'histogram', icon: '📈', label: 'Histogram', desc: 'Distribution of continuous data' },
    { type: 'box', icon: '📦', label: 'Box Plot', desc: 'Five-number summary' },
    { type: 'bar', icon: '📊', label: 'Bar Chart', desc: 'Categorical frequencies' },
    { type: 'scatter', icon: '🔵', label: 'Scatter Plot', desc: 'Relationship between variables' }
  ]

  return (
    <div style={styles.controls}>
      <div style={styles.controlGroup}>
        <label style={styles.label}>Select Chart Type</label>
        <div style={styles.chartTypeGrid}>
          {chartOptions.map(chart => (
            <button
              key={chart.type}
              style={{
                ...styles.chartTypeButton,
                ...(chartType === chart.type ? styles.chartTypeButtonActive : {})
              }}
              onClick={() => onChartTypeChange(chart.type as ChartType)}
              title={chart.desc}
            >
              <div>{chart.icon} {chart.label}</div>
              <div style={styles.chartTypeDesc}>{chart.desc}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

const styles = {
  controls: {
    backgroundColor: 'white',
    padding: '15px',
    borderRadius: '8px',
    marginBottom: '15px',
    border: '2px solid #e0e0e0'
  } as const,
  controlGroup: {
    marginBottom: '0'
  } as const,
  label: {
    display: 'block',
    fontSize: '13px',
    fontWeight: '600',
    color: '#666',
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
    border: '2px solid #ddd',
    borderRadius: '8px',
    backgroundColor: 'white',
    cursor: 'pointer',
    textAlign: 'center',
    transition: 'all 0.2s',
    fontSize: '13px',
    fontWeight: '500'
  } as const,
  chartTypeButtonActive: {
    borderColor: '#3498db',
    backgroundColor: '#e3f2fd',
    fontWeight: '600' as const
  } as const,
  chartTypeDesc: {
    fontSize: '11px',
    color: '#666',
    marginTop: '4px'
  } as const
}

export default ChartSelector
export type { ChartType }
