import React, { FC, useState, useMemo } from 'react'
import { ParsedData, VariableType } from '../../types'
import ChartSelector, { ChartType } from './ChartSelector'
import HistogramChart from './charts/HistogramChart'
import BarChart from './charts/BarChart'
import ScatterChart from './charts/ScatterChart'
import BoxPlotChart from './charts/BoxPlotChart'

interface VisualizationProps {
  data: ParsedData
  variables: VariableType[]
  onContinue: () => void
  onBack: () => void
}

const Visualization: FC<VisualizationProps> = ({
  data,
  variables,
  onContinue,
  onBack
}) => {
  const includedVariables = variables.filter(v => v.includeInAnalysis)
  const continuousVars = includedVariables.filter(v => v.type === 'continuous')
  const categoricalVars = includedVariables.filter(v => v.type === 'categorical' || v.type === 'boolean')

  const [chartType, setChartType] = useState<ChartType>('histogram')
  const [selectedVariable, setSelectedVariable] = useState<string>(
    continuousVars[0]?.name || categoricalVars[0]?.name || ''
  )
  const [selectedVariable2, setSelectedVariable2] = useState<string>(
    continuousVars[1]?.name || continuousVars[0]?.name || ''
  )
  const [groupVariable, setGroupVariable] = useState<string>('')

  // Get compatible variables for the selected chart type
  const compatibleVariables = useMemo(() => {
    switch (chartType) {
      case 'histogram':
      case 'box':
        return continuousVars
      case 'bar':
        return categoricalVars
      case 'scatter':
        return continuousVars
      default:
        return includedVariables
    }
  }, [chartType, continuousVars, categoricalVars, includedVariables])

  // Reset selected variable if it's no longer compatible
  React.useEffect(() => {
    if (!compatibleVariables.find(v => v.name === selectedVariable)) {
      setSelectedVariable(compatibleVariables[0]?.name || '')
    }
  }, [chartType, compatibleVariables, selectedVariable])

  // Auto-reset scatter plot second variable if needed
  React.useEffect(() => {
    if (chartType === 'scatter' && !continuousVars.find(v => v.name === selectedVariable2)) {
      setSelectedVariable2(continuousVars[0]?.name || '')
    }
  }, [chartType, continuousVars, selectedVariable2])

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>Data Visualization</h2>
        <p style={styles.subtitle}>
          Explore your data through interactive charts and visualizations
        </p>
      </div>

      {/* Chart Type Selector */}
      <ChartSelector
        chartType={chartType}
        onChartTypeChange={setChartType}
      />

      {/* Variable Controls (filtered by chart type) */}
      <div style={styles.controls}>
        <div style={styles.controlRow}>
          <div style={styles.controlGroup}>
            <label style={styles.label}>
              {chartType === 'scatter' ? 'X-Axis Variable' : 'Variable'}
            </label>
            <select
              value={selectedVariable}
              onChange={(e) => setSelectedVariable(e.target.value)}
              style={styles.select}
            >
              {compatibleVariables.map(v => (
                <option key={v.name} value={v.name}>{v.name}</option>
              ))}
            </select>
          </div>

          {chartType === 'scatter' && continuousVars.length >= 2 && (
            <div style={styles.controlGroup}>
              <label style={styles.label}>Y-Axis Variable</label>
              <select
                value={selectedVariable2}
                onChange={(e) => setSelectedVariable2(e.target.value)}
                style={styles.select}
              >
                {continuousVars.map(v => (
                  <option key={v.name} value={v.name}>{v.name}</option>
                ))}
              </select>
            </div>
          )}

          {(chartType === 'bar' || chartType === 'scatter' || chartType === 'histogram' || chartType === 'box') && categoricalVars.length > 0 && (
            <div style={styles.controlGroup}>
              <label style={styles.label}>Group By (Optional)</label>
              <select
                value={groupVariable}
                onChange={(e) => setGroupVariable(e.target.value)}
                style={styles.select}
              >
                <option value="">None</option>
                {categoricalVars.map(v => (
                  <option key={v.name} value={v.name}>{v.name}</option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Chart Display */}
      <div style={styles.chartContainer}>
        {chartType === 'histogram' && (
          <HistogramChart
            data={data}
            variableName={selectedVariable}
            groupVariable={groupVariable}
          />
        )}

        {chartType === 'box' && (
          <BoxPlotChart
            data={data}
            variableName={selectedVariable}
            groupVariable={groupVariable}
          />
        )}

        {chartType === 'bar' && (
          <BarChart
            data={data}
            variableName={selectedVariable}
            groupVariable={groupVariable}
          />
        )}

        {chartType === 'scatter' && (
          <ScatterChart
            data={data}
            xVariable={selectedVariable}
            yVariable={selectedVariable2}
            groupVariable={groupVariable}
          />
        )}
      </div>

      {/* Actions */}
      <div style={styles.actions}>
        <button style={styles.backButton} onClick={onBack}>
          ← Back
        </button>
        <button style={styles.continueButton} onClick={onContinue}>
          Continue to Statistical Tests →
        </button>
      </div>
    </div>
  )
}

const styles = {
  container: {
    padding: '30px 20px',
    maxWidth: '1400px',
    margin: '0 auto'
  } as const,
  header: {
    marginBottom: '15px',
    paddingBottom: '10px',
    borderBottom: '2px solid #eee'
  } as const,
  title: {
    margin: '0 0 10px 0',
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#333'
  } as const,
  subtitle: {
    margin: 0,
    fontSize: '14px',
    color: '#666'
  } as const,
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
  controlRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '15px'
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
  select: {
    width: '100%',
    padding: '8px',
    fontSize: '14px',
    border: '1px solid #ddd',
    borderRadius: '6px',
    backgroundColor: 'white'
  } as const,
  chartContainer: {
    backgroundColor: 'white',
    padding: '15px',
    borderRadius: '8px',
    border: '2px solid #e0e0e0',
    marginBottom: '15px'
  } as const,
  actions: {
    display: 'flex',
    gap: '15px',
    justifyContent: 'flex-end',
    paddingTop: '12px',
    borderTop: '2px solid #eee',
    marginTop: '15px'
  } as const,
  backButton: {
    padding: '10px 20px',
    fontSize: '14px',
    backgroundColor: '#f0f0f0',
    color: '#333',
    border: '1px solid #ddd',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '600'
  } as const,
  continueButton: {
    padding: '10px 20px',
    fontSize: '14px',
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '600'
  } as const
}

export default Visualization
