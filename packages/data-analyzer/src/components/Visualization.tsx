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

  const [selectedVariable, setSelectedVariable] = useState<string>(
    continuousVars[0]?.name || categoricalVars[0]?.name || ''
  )
  const [selectedVariable2, setSelectedVariable2] = useState<string>(
    continuousVars[1]?.name || continuousVars[0]?.name || ''
  )
  const [groupVariable, setGroupVariable] = useState<string>('')

  // Determine which variable is selected and its type
  const selectedVar = useMemo(() => {
    return variables.find(v => v.name === selectedVariable)
  }, [selectedVariable, variables])

  // Determine which charts to show based on selected variable
  const chartsToShow = useMemo(() => {
    const charts: ChartType[] = []

    if (selectedVar?.type === 'continuous') {
      charts.push('histogram', 'box')
    }

    if (selectedVar?.type === 'categorical' || selectedVar?.type === 'boolean') {
      charts.push('bar')
    }

    if (continuousVars.length >= 2) {
      charts.push('scatter')
    }

    return charts
  }, [selectedVar, continuousVars])

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>Data Visualization</h2>
        <p style={styles.subtitle}>
          Explore your data through interactive charts and visualizations
        </p>
      </div>

      {/* Controls */}
      <div style={styles.controls}>
        <div style={styles.controlRow}>
          <div style={styles.controlGroup}>
            <label style={styles.label}>Primary Variable</label>
            <select
              value={selectedVariable}
              onChange={(e) => setSelectedVariable(e.target.value)}
              style={styles.select}
            >
              {includedVariables.map(v => (
                <option key={v.name} value={v.name}>{v.name}</option>
              ))}
            </select>
          </div>

          {continuousVars.length >= 2 && (
            <div style={styles.controlGroup}>
              <label style={styles.label}>Secondary Variable (for Scatter)</label>
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

          {categoricalVars.length > 0 && (
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

      {/* Charts Grid Display */}
      <div style={styles.chartsGrid}>
        {chartsToShow.includes('histogram') && (
          <HistogramChart
            data={data}
            variableName={selectedVariable}
          />
        )}

        {chartsToShow.includes('box') && (
          <BoxPlotChart
            data={data}
            variableName={selectedVariable}
          />
        )}

        {chartsToShow.includes('bar') && (
          <BarChartComponent
            data={data}
            variableName={selectedVariable}
            groupVariable={groupVariable}
          />
        )}

        {chartsToShow.includes('scatter') && (
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
      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={histogramData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="label"
            label={{ value: variableName, position: 'insideBottom', offset: -5 }}
            angle={-45}
            textAnchor="end"
            height={70}
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
      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={barData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="category"
            label={{ value: variableName, position: 'insideBottom', offset: -5 }}
            angle={-45}
            textAnchor="end"
            height={80}
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
        <ResponsiveContainer width="100%" height={350}>
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
      <ResponsiveContainer width="100%" height={350}>
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

  // Prepare data for line chart to simulate box plot
  const plotData = [
    { name: 'Min', value: boxData.min },
    { name: 'Q1', value: boxData.q1 },
    { name: 'Median', value: boxData.median },
    { name: 'Q3', value: boxData.q3 },
    { name: 'Max', value: boxData.max }
  ]

  return (
    <div style={styles.chart}>
      <h3 style={styles.chartTitle}>Box Plot: {variableName}</h3>
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
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={plotData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis label={{ value: variableName, angle: -90, position: 'insideLeft' }} />
          <Tooltip />
          <Line type="monotone" dataKey="value" stroke={CHART_COLORS.primary} strokeWidth={3} />
        </LineChart>
      </ResponsiveContainer>
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
    marginBottom: '20px',
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
  chartsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(600px, 1fr))',
    gap: '20px',
    marginBottom: '20px'
  } as const,
  chart: {
    width: '100%',
    backgroundColor: 'white',
    padding: '15px',
    borderRadius: '8px',
    border: '2px solid #e0e0e0'
  } as const,
  chartTitle: {
    margin: '0 0 15px 0',
    fontSize: '16px',
    fontWeight: '600',
    color: '#333',
    textAlign: 'center'
  } as const,
  boxPlotStats: {
    display: 'flex',
    justifyContent: 'space-around',
    marginBottom: '12px',
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
