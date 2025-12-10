import React, { FC, useState, useMemo } from 'react'
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell
} from 'recharts'
import { ParsedData, VariableType } from '../types'
import {
  createHistogram,
  createBoxPlotData,
  createBarChartData,
  createScatterPlotData,
  getUniqueGroups,
  CHART_COLORS
} from '../utils/visualization'

interface VisualizationProps {
  data: ParsedData
  variables: VariableType[]
  onContinue: () => void
  onBack: () => void
}

type ChartType = 'histogram' | 'bar' | 'scatter' | 'box'

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
      <div style={styles.controls}>
        <div style={styles.controlGroup}>
          <label style={styles.label}>Select Chart Type</label>
          <div style={styles.chartTypeGrid}>
            {[
              { type: 'histogram', icon: '📈', label: 'Histogram', desc: 'Distribution of continuous data' },
              { type: 'box', icon: '📦', label: 'Box Plot', desc: 'Five-number summary' },
              { type: 'bar', icon: '📊', label: 'Bar Chart', desc: 'Categorical frequencies' },
              { type: 'scatter', icon: '🔵', label: 'Scatter Plot', desc: 'Relationship between variables' }
            ].map(chart => (
              <button
                key={chart.type}
                style={{
                  ...styles.chartTypeButton,
                  ...(chartType === chart.type ? styles.chartTypeButtonActive : {})
                }}
                onClick={() => setChartType(chart.type as ChartType)}
                title={chart.desc}
              >
                <div>{chart.icon} {chart.label}</div>
                <div style={styles.chartTypeDesc}>{chart.desc}</div>
              </button>
            ))}
          </div>
        </div>
      </div>

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

          {(chartType === 'bar' || chartType === 'scatter') && categoricalVars.length > 0 && (
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
          />
        )}

        {chartType === 'box' && (
          <BoxPlotChart
            data={data}
            variableName={selectedVariable}
          />
        )}

        {chartType === 'bar' && (
          <BarChartComponent
            data={data}
            variableName={selectedVariable}
            groupVariable={groupVariable}
          />
        )}

        {chartType === 'scatter' && (
          <ScatterPlotComponent
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

// Histogram Component
interface HistogramChartProps {
  data: ParsedData
  variableName: string
}

const HistogramChart: FC<HistogramChartProps> = ({ data, variableName }) => {
  const columnValues = data.rows.map(row => row[variableName])
  const histogramData = createHistogram(columnValues, 15)

  return (
    <div style={styles.chart}>
      <h3 style={styles.chartTitle}>Histogram: {variableName}</h3>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={histogramData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="label"
            label={{ value: variableName, position: 'insideBottom', offset: -5 }}
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis label={{ value: 'Frequency', angle: -90, position: 'insideLeft' }} />
          <Tooltip />
          <Bar dataKey="count" fill={CHART_COLORS.primary} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

// Bar Chart Component
interface BarChartComponentProps {
  data: ParsedData
  variableName: string
  groupVariable?: string
}

const BarChartComponent: FC<BarChartComponentProps> = ({ data, variableName, groupVariable }) => {
  const columnValues = data.rows.map(row => row[variableName])
  const barData = createBarChartData(columnValues, 15)

  return (
    <div style={styles.chart}>
      <h3 style={styles.chartTitle}>Bar Chart: {variableName}</h3>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={barData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="category"
            label={{ value: variableName, position: 'insideBottom', offset: -5 }}
            angle={-45}
            textAnchor="end"
            height={100}
          />
          <YAxis label={{ value: 'Count', angle: -90, position: 'insideLeft' }} />
          <Tooltip />
          <Bar dataKey="count" fill={CHART_COLORS.secondary}>
            {barData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={CHART_COLORS.palette[index % CHART_COLORS.palette.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

// Scatter Plot Component
interface ScatterPlotComponentProps {
  data: ParsedData
  xVariable: string
  yVariable: string
  groupVariable?: string
}

const ScatterPlotComponent: FC<ScatterPlotComponentProps> = ({
  data,
  xVariable,
  yVariable,
  groupVariable
}) => {
  const scatterData = createScatterPlotData(data.rows, xVariable, yVariable, groupVariable)

  if (!groupVariable) {
    return (
      <div style={styles.chart}>
        <h3 style={styles.chartTitle}>Scatter Plot: {yVariable} vs {xVariable}</h3>
        <ResponsiveContainer width="100%" height={400}>
          <ScatterChart>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              type="number"
              dataKey="x"
              name={xVariable}
              label={{ value: xVariable, position: 'insideBottom', offset: -5 }}
            />
            <YAxis
              type="number"
              dataKey="y"
              name={yVariable}
              label={{ value: yVariable, angle: -90, position: 'insideLeft' }}
            />
            <Tooltip cursor={{ strokeDasharray: '3 3' }} />
            <Scatter name={yVariable} data={scatterData} fill={CHART_COLORS.primary} />
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    )
  }

  // Grouped scatter plot
  const groups = getUniqueGroups(data.rows, groupVariable)
  const groupedData = groups.map(group => ({
    group,
    data: scatterData.filter(d => d.group === group)
  }))

  return (
    <div style={styles.chart}>
      <h3 style={styles.chartTitle}>Scatter Plot: {yVariable} vs {xVariable} (grouped by {groupVariable})</h3>
      <ResponsiveContainer width="100%" height={400}>
        <ScatterChart>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            type="number"
            dataKey="x"
            name={xVariable}
            label={{ value: xVariable, position: 'insideBottom', offset: -5 }}
          />
          <YAxis
            type="number"
            dataKey="y"
            name={yVariable}
            label={{ value: yVariable, angle: -90, position: 'insideLeft' }}
          />
          <Tooltip cursor={{ strokeDasharray: '3 3' }} />
          <Legend />
          {groupedData.map((group, idx) => (
            <Scatter
              key={group.group}
              name={group.group}
              data={group.data}
              fill={CHART_COLORS.palette[idx % CHART_COLORS.palette.length]}
            />
          ))}
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  )
}

// Box Plot Component
interface BoxPlotChartProps {
  data: ParsedData
  variableName: string
}

const BoxPlotChart: FC<BoxPlotChartProps> = ({ data, variableName }) => {
  const columnValues = data.rows.map(row => row[variableName])
  const boxData = createBoxPlotData(columnValues)

  if (!boxData) {
    return <div style={styles.chart}>No data available for box plot</div>
  }

  // Calculate scales and positions
  const allValues = [boxData.min, boxData.max, ...boxData.outliers]
  const minVal = Math.min(...allValues)
  const maxVal = Math.max(...allValues)
  const range = maxVal - minVal || 1
  const padding = range * 0.1

  const scale = (value: number) => ((value - minVal) / (range + padding * 2)) * 100

  const minPos = scale(boxData.min)
  const q1Pos = scale(boxData.q1)
  const medianPos = scale(boxData.median)
  const q3Pos = scale(boxData.q3)
  const maxPos = scale(boxData.max)

  return (
    <div style={styles.chart}>
      <h3 style={styles.chartTitle}>Box Plot: {variableName}</h3>
      <div style={styles.boxPlotSummary}>
        <div style={styles.boxPlotStats}>
          <div style={styles.boxPlotStat}>
            <span style={styles.boxPlotLabel}>Min</span>
            <span style={styles.boxPlotValue}>{boxData.min.toFixed(2)}</span>
          </div>
          <div style={styles.boxPlotStat}>
            <span style={styles.boxPlotLabel}>Q1</span>
            <span style={styles.boxPlotValue}>{boxData.q1.toFixed(2)}</span>
          </div>
          <div style={styles.boxPlotStat}>
            <span style={styles.boxPlotLabel}>Median</span>
            <span style={styles.boxPlotValue}>{boxData.median.toFixed(2)}</span>
          </div>
          <div style={styles.boxPlotStat}>
            <span style={styles.boxPlotLabel}>Q3</span>
            <span style={styles.boxPlotValue}>{boxData.q3.toFixed(2)}</span>
          </div>
          <div style={styles.boxPlotStat}>
            <span style={styles.boxPlotLabel}>Max</span>
            <span style={styles.boxPlotValue}>{boxData.max.toFixed(2)}</span>
          </div>
          {boxData.outliers.length > 0 && (
            <div style={styles.boxPlotStat}>
              <span style={styles.boxPlotLabel}>Outliers</span>
              <span style={styles.boxPlotValue}>{boxData.outliers.length}</span>
            </div>
          )}
        </div>
      </div>

      {/* SVG Box Plot */}
      <svg style={styles.boxPlotSvg} viewBox="0 0 800 200">
        {/* Y-axis labels */}
        <text x="30" y="180" style={styles.boxPlotAxisLabel}>{(minVal).toFixed(1)}</text>
        <text x="30" y="110" style={styles.boxPlotAxisLabel}>{((minVal + maxVal) / 2).toFixed(1)}</text>
        <text x="30" y="30" style={styles.boxPlotAxisLabel}>{(maxVal).toFixed(1)}</text>

        {/* Whiskers */}
        {/* Lower whisker line */}
        <line
          x1={minPos + 50}
          y1="100"
          x2={minPos + 50}
          y2="80"
          stroke={CHART_COLORS.primary}
          strokeWidth="2"
        />
        {/* Lower whisker horizontal */}
        <line
          x1={minPos + 45}
          y1="80"
          x2={minPos + 55}
          y2="80"
          stroke={CHART_COLORS.primary}
          strokeWidth="2"
        />

        {/* Whisker to Q1 */}
        <line
          x1={minPos + 50}
          y1="100"
          x2={q1Pos + 50}
          y2="100"
          stroke={CHART_COLORS.primary}
          strokeWidth="2"
        />

        {/* Box (Q1 to Q3) */}
        <rect
          x={q1Pos + 50}
          y="80"
          width={q3Pos - q1Pos}
          height="40"
          fill={CHART_COLORS.primary}
          opacity="0.2"
          stroke={CHART_COLORS.primary}
          strokeWidth="2"
        />

        {/* Median line */}
        <line
          x1={medianPos + 50}
          y1="80"
          x2={medianPos + 50}
          y2="120"
          stroke="#e74c3c"
          strokeWidth="3"
        />

        {/* Whisker to Q3 */}
        <line
          x1={q3Pos + 50}
          y1="100"
          x2={maxPos + 50}
          y2="100"
          stroke={CHART_COLORS.primary}
          strokeWidth="2"
        />

        {/* Upper whisker line */}
        <line
          x1={maxPos + 50}
          y1="100"
          x2={maxPos + 50}
          y2="120"
          stroke={CHART_COLORS.primary}
          strokeWidth="2"
        />
        {/* Upper whisker horizontal */}
        <line
          x1={maxPos + 45}
          y1="120"
          x2={maxPos + 55}
          y2="120"
          stroke={CHART_COLORS.primary}
          strokeWidth="2"
        />

        {/* Outliers */}
        {boxData.outliers.map((outlier, idx) => {
          const outPos = scale(outlier)
          return (
            <circle
              key={`outlier-${idx}`}
              cx={outPos + 50}
              cy="100"
              r="3"
              fill="#e74c3c"
              opacity="0.8"
            />
          )
        })}
      </svg>
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
  } as const,
  chartContainer: {
    backgroundColor: 'white',
    padding: '15px',
    borderRadius: '8px',
    border: '2px solid #e0e0e0',
    marginBottom: '15px'
  } as const,
  chart: {
    width: '100%'
  } as const,
  chartTitle: {
    margin: '0 0 12px 0',
    fontSize: '16px',
    fontWeight: '600',
    color: '#333',
    textAlign: 'center'
  } as const,
  boxPlotSummary: {
    marginBottom: '15px'
  } as const,
  boxPlotStats: {
    display: 'flex',
    justifyContent: 'space-around',
    padding: '10px',
    backgroundColor: '#f9f9f9',
    borderRadius: '6px',
    flexWrap: 'wrap',
    gap: '8px'
  } as const,
  boxPlotStat: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  } as const,
  boxPlotLabel: {
    fontSize: '11px',
    color: '#666',
    fontWeight: '600',
    marginBottom: '3px'
  } as const,
  boxPlotValue: {
    fontSize: '14px',
    color: '#333',
    fontWeight: 'bold',
    fontFamily: 'monospace'
  } as const,
  boxPlotSvg: {
    width: '100%',
    height: 'auto',
    minHeight: '200px',
    marginTop: '10px'
  } as const,
  boxPlotAxisLabel: {
    fontSize: '12px',
    fill: '#666',
    textAnchor: 'end'
  } as any,
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
