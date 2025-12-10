import React, { FC } from 'react'

type ChartType = 'histogram' | 'boxplot' | 'bar' | 'scatter'

interface ChartTypeSelectorProps {
  selectedChartType: ChartType | null
  onSelectChartType: (type: ChartType) => void
}

/**
 * Component to display and select available chart types
 * Shows all 4 chart types: histogram, box plot, bar chart, scatter plot
 */
const ChartTypeSelector: FC<ChartTypeSelectorProps> = ({
  selectedChartType,
  onSelectChartType
}) => {
  const chartTypes: Array<{ type: ChartType; icon: string; label: string; description: string }> = [
    {
      type: 'histogram',
      icon: '📈',
      label: 'Histogram',
      description: 'Distribution of continuous data'
    },
    {
      type: 'boxplot',
      icon: '📦',
      label: 'Box Plot',
      description: 'Five-number summary visualization'
    },
    {
      type: 'bar',
      icon: '📊',
      label: 'Bar Chart',
      description: 'Categorical data frequencies'
    },
    {
      type: 'scatter',
      icon: '📍',
      label: 'Scatter Plot',
      description: 'Relationship between two variables'
    }
  ]

  return (
    <div style={styles.container}>
      <h4 style={styles.title}>Select Chart Type</h4>
      <div style={styles.grid}>
        {chartTypes.map(chart => (
          <button
            key={chart.type}
            style={{
              ...styles.card,
              ...(selectedChartType === chart.type ? styles.cardSelected : styles.cardUnselected)
            }}
            onClick={() => onSelectChartType(chart.type)}
            title={chart.description}
          >
            <div style={styles.icon}>{chart.icon}</div>
            <div style={styles.label}>{chart.label}</div>
            <div style={styles.description}>{chart.description}</div>
          </button>
        ))}
      </div>
    </div>
  )
}

const styles = {
  container: {
    marginBottom: '30px',
    padding: '20px',
    backgroundColor: '#f9f9f9',
    borderRadius: '8px'
  } as const,
  title: {
    margin: '0 0 20px 0',
    fontSize: '16px',
    fontWeight: '600',
    color: '#333'
  } as const,
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: '15px'
  } as const,
  card: {
    padding: '20px',
    border: '2px solid #ddd',
    borderRadius: '8px',
    backgroundColor: 'white',
    cursor: 'pointer',
    textAlign: 'center',
    transition: 'all 0.2s',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '10px'
  } as const,
  cardSelected: {
    borderColor: '#3498db',
    backgroundColor: '#e3f2fd',
    boxShadow: '0 4px 8px rgba(52, 152, 219, 0.2)'
  } as const,
  cardUnselected: {
    borderColor: '#ddd',
    backgroundColor: 'white',
    ':hover': {
      borderColor: '#3498db',
      backgroundColor: '#f8f9ff'
    }
  } as const,
  icon: {
    fontSize: '32px'
  } as const,
  label: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#333'
  } as const,
  description: {
    fontSize: '12px',
    color: '#666',
    lineHeight: '1.3'
  } as const
}

export default ChartTypeSelector
