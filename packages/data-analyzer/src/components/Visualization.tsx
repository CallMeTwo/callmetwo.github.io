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
import ReactECharts from 'echarts-for-react'
import { ParsedData, VariableType } from '../types'
import {
  createHistogram,
  createBoxPlotData,
  createBarChartData,
  createScatterPlotData,
  getUniqueGroups,
  CHART_COLORS,
  createGroupedHistogram,
  createGroupedBoxPlotData,
  createGroupedBarData,
  getDecimalPlaces,
  formatAxisLabel
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
  groupVariable?: string
}

const HistogramChart: FC<HistogramChartProps> = ({ data, variableName, groupVariable }) => {
  // Use grouped histogram if groupVariable is provided
  const histogramData = groupVariable
    ? createGroupedHistogram(data.rows, variableName, groupVariable, 15)
    : createHistogram(data.rows.map(row => row[variableName]), 15)

  if (groupVariable) {
    // Grouped histogram with side-by-side (dodged) bars
    const groups = getUniqueGroups(data.rows, groupVariable)

    return (
      <div style={styles.chart}>
        <h3 style={styles.chartTitle}>Histogram: {variableName} (grouped by {groupVariable})</h3>
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
            <Legend />
            {groups.map((group, idx) => (
              <Bar
                key={group}
                dataKey={group}
                fill={CHART_COLORS.palette[idx % CHART_COLORS.palette.length]}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    )
  }

  // Non-grouped histogram
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
  if (groupVariable) {
    // Clustered bar chart with groups
    const groupedBarData = createGroupedBarData(data.rows, variableName, '', groupVariable)
    const groups = getUniqueGroups(data.rows, groupVariable)

    // Transform data for Recharts: count frequencies for each category-group combination
    const frequencyData = new Map<string, Map<string, number>>()

    data.rows.forEach(row => {
      const category = String(row[variableName] || 'Unknown')
      const group = String(row[groupVariable] || 'Unknown')

      if (!frequencyData.has(category)) {
        frequencyData.set(category, new Map())
      }
      const groupMap = frequencyData.get(category)!
      groupMap.set(group, (groupMap.get(group) || 0) + 1)
    })

    // Convert to array format for Recharts
    const chartData = Array.from(frequencyData.entries()).map(([category, groupMap]) => {
      const item: any = { category }
      groups.forEach(group => {
        item[group] = groupMap.get(group) || 0
      })
      return item
    })

    return (
      <div style={styles.chart}>
        <h3 style={styles.chartTitle}>Bar Chart: {variableName} (grouped by {groupVariable})</h3>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={chartData}>
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
            <Legend />
            {groups.map((group, idx) => (
              <Bar
                key={group}
                dataKey={group}
                fill={CHART_COLORS.palette[idx % CHART_COLORS.palette.length]}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    )
  }

  // Simple bar chart without grouping
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

  // Calculate dynamic axis limits with padding
  const calculateAxisLimits = (values: number[]) => {
    if (values.length === 0) return { min: 0, max: 1 }
    const min = Math.min(...values)
    const max = Math.max(...values)
    const range = max - min
    const padding = range === 0 ? 0.5 : range * 0.1 // 10% padding or 0.5 if range is 0
    return {
      min: Math.max(min - padding, 0), // Don't go below 0 for positive-only data
      max: max + padding
    }
  }

  const xValues = scatterData.map(d => d.x)
  const yValues = scatterData.map(d => d.y)
  const xLimits = calculateAxisLimits(xValues)
  const yLimits = calculateAxisLimits(yValues)

  // Calculate appropriate decimal places for axis labels
  const xDecimals = getDecimalPlaces(xLimits.min, xLimits.max)
  const yDecimals = getDecimalPlaces(yLimits.min, yLimits.max)

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
              domain={[xLimits.min, xLimits.max]}
              tickFormatter={(value) => formatAxisLabel(value, xDecimals)}
            />
            <YAxis
              type="number"
              dataKey="y"
              name={yVariable}
              label={{ value: yVariable, angle: -90, position: 'insideLeft' }}
              domain={[yLimits.min, yLimits.max]}
              tickFormatter={(value) => formatAxisLabel(value, yDecimals)}
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
            domain={[xLimits.min, xLimits.max]}
            tickFormatter={(value) => formatAxisLabel(value, xDecimals)}
          />
          <YAxis
            type="number"
            dataKey="y"
            name={yVariable}
            label={{ value: yVariable, angle: -90, position: 'insideLeft' }}
            domain={[yLimits.min, yLimits.max]}
            tickFormatter={(value) => formatAxisLabel(value, yDecimals)}
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
  groupVariable?: string
}

const BoxPlotChart: FC<BoxPlotChartProps> = ({ data, variableName, groupVariable }) => {
  if (groupVariable) {
    // Grouped box plot with side-by-side boxes
    const { groups, data: groupedData } = createGroupedBoxPlotData(data.rows, variableName, groupVariable)

    if (groups.length === 0) {
      return <div style={styles.chart}>No data available for grouped box plot</div>
    }

    // Prepare box plot data array with color index: each index corresponds to a group on x-axis
    const boxPlotData = groups.map((group, groupIdx) => {
      const boxData = groupedData[group]
      if (!boxData) return null

      return {
        value: [
          boxData.min,
          boxData.q1,
          boxData.median,
          boxData.q3,
          boxData.max,
          ...boxData.outliers
        ],
        itemStyle: {
          color: CHART_COLORS.palette[groupIdx % CHART_COLORS.palette.length],
          borderColor: '#333'
        }
      }
    }).filter(Boolean)

    // Single box plot series with all groups positioned at correct x-axis indices
    const boxPlotSeries = [
      {
        name: 'Box Plot',
        type: 'boxplot',
        data: boxPlotData,
        boxWidth: ['15%', '40%']
      }
    ]

    // Prepare outlier scatter series for all groups
    const allOutliersData: any[] = []
    groups.forEach((group, groupIdx) => {
      const boxData = groupedData[group]
      if (boxData && boxData.outliers.length > 0) {
        boxData.outliers.forEach(value => {
          allOutliersData.push({
            value: [groupIdx, value],
            group: group,
            groupIdx: groupIdx
          })
        })
      }
    })

    const outliersSeries = allOutliersData.length > 0 ? [
      {
        name: 'Outliers',
        type: 'scatter',
        data: allOutliersData.map(item => item.value),
        symbolSize: 4,
        itemStyle: {
          color: (params: any) => {
            const itemData = allOutliersData[params.dataIndex]
            return CHART_COLORS.palette[itemData.groupIdx % CHART_COLORS.palette.length]
          },
          opacity: 0.7
        }
      }
    ] : []

    // Calculate dynamic y-axis limits
    const allYValues: number[] = []
    groups.forEach(group => {
      const boxData = groupedData[group]
      if (boxData) {
        allYValues.push(boxData.min, boxData.q1, boxData.median, boxData.q3, boxData.max, ...boxData.outliers)
      }
    })
    const yMin = Math.min(...allYValues)
    const yMax = Math.max(...allYValues)
    const yRange = yMax - yMin
    const yPadding = yRange === 0 ? 0.5 : yRange * 0.1
    const yLimits = {
      min: yMin - yPadding,
      max: yMax + yPadding
    }

    // Calculate appropriate decimal places for y-axis
    const yDecimals = getDecimalPlaces(yLimits.min, yLimits.max)

    const option = {
      title: {
        text: `Box Plot: ${variableName} (grouped by ${groupVariable})`,
        left: 'center',
        textStyle: {
          fontSize: 16,
          fontWeight: 'bold',
          color: '#333'
        }
      },
      tooltip: {
        trigger: 'item',
        formatter: (params: any) => {
          if (params.seriesType === 'boxplot') {
            const [min, q1, median, q3, max] = params.value
            const group = groups[params.dataIndex]
            return `<div style="padding: 5px;">
              <strong>${group}</strong><br/>
              Min: ${min.toFixed(2)}<br/>
              Q1: ${q1.toFixed(2)}<br/>
              Median: ${median.toFixed(2)}<br/>
              Q3: ${q3.toFixed(2)}<br/>
              Max: ${max.toFixed(2)}
            </div>`
          }
          if (params.seriesType === 'scatter') {
            const [xIdx, value] = params.value
            const group = groups[xIdx]
            return `<div style="padding: 5px;">
              <strong>${group} (Outlier)</strong><br/>
              Value: ${value.toFixed(2)}
            </div>`
          }
          return params.name
        }
      },
      grid: {
        left: '10%',
        right: '10%',
        bottom: '15%',
        top: '15%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: groups,
        axisLabel: {
          fontSize: 12
        }
      },
      yAxis: {
        type: 'value',
        name: 'Value',
        nameTextStyle: {
          color: '#666',
          fontSize: 12
        },
        axisLabel: {
          fontSize: 12,
          formatter: (value: number) => formatAxisLabel(value, yDecimals)
        },
        min: yLimits.min,
        max: yLimits.max
      },
      series: [...boxPlotSeries, ...outliersSeries]
    }

    return (
      <div style={styles.chart}>
        <ReactECharts
          option={option}
          style={{ height: '400px', width: '100%' }}
          notMerge
          lazyUpdate
        />
      </div>
    )
  }

  // Non-grouped box plot
  const columnValues = data.rows.map(row => row[variableName])
  const boxData = createBoxPlotData(columnValues)

  if (!boxData) {
    return <div style={styles.chart}>No data available for box plot</div>
  }

  // Prepare data for ECharts box plot
  // ECharts expects: [min, Q1, median, Q3, max, ...outliers]
  const boxPlotValues = [
    boxData.min,
    boxData.q1,
    boxData.median,
    boxData.q3,
    boxData.max,
    ...boxData.outliers
  ]

  // Calculate dynamic y-axis limits
  const nongroupedYValues = [boxData.min, boxData.q1, boxData.median, boxData.q3, boxData.max, ...boxData.outliers]
  const nongroupedYMin = Math.min(...nongroupedYValues)
  const nongroupedYMax = Math.max(...nongroupedYValues)
  const nongroupedYRange = nongroupedYMax - nongroupedYMin
  const nongroupedYPadding = nongroupedYRange === 0 ? 0.5 : nongroupedYRange * 0.1
  const nongroupedYLimits = {
    min: nongroupedYMin - nongroupedYPadding,
    max: nongroupedYMax + nongroupedYPadding
  }

  // Calculate appropriate decimal places for y-axis
  const nongroupedYDecimals = getDecimalPlaces(nongroupedYLimits.min, nongroupedYLimits.max)

  const option = {
    title: {
      text: `Box Plot: ${variableName}`,
      left: 'center',
      textStyle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333'
      }
    },
    tooltip: {
      trigger: 'item',
      formatter: (params: any) => {
        if (params.seriesType === 'boxplot') {
          const [min, q1, median, q3, max] = params.value
          return `<div style="padding: 5px;">
            <strong>Statistics</strong><br/>
            Min: ${min.toFixed(2)}<br/>
            Q1: ${q1.toFixed(2)}<br/>
            Median: ${median.toFixed(2)}<br/>
            Q3: ${q3.toFixed(2)}<br/>
            Max: ${max.toFixed(2)}
          </div>`
        }
        return params.name
      }
    },
    grid: {
      left: '10%',
      right: '10%',
      bottom: '15%',
      top: '15%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: [variableName],
      axisLabel: {
        fontSize: 12
      }
    },
    yAxis: {
      type: 'value',
      name: 'Value',
      nameTextStyle: {
        color: '#666',
        fontSize: 12
      },
      axisLabel: {
        fontSize: 12,
        formatter: (value: number) => formatAxisLabel(value, nongroupedYDecimals)
      },
      min: nongroupedYLimits.min,
      max: nongroupedYLimits.max
    },
    series: [
      {
        name: 'Box Plot',
        type: 'boxplot',
        data: [boxPlotValues],
        itemStyle: {
          color: CHART_COLORS.primary,
          borderColor: '#333'
        },
        boxWidth: ['20%', '50%']
      },
      {
        name: 'Outliers',
        type: 'scatter',
        data: boxData.outliers.map(v => [0, v]),
        symbolSize: 4,
        itemStyle: {
          color: '#e74c3c'
        }
      }
    ]
  }

  return (
    <div style={styles.chart}>
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

      <ReactECharts
        option={option}
        style={{ height: '400px', width: '100%' }}
        notMerge
        lazyUpdate
      />
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
