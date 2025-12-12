import React, { FC } from 'react'
import {
  ScatterChart as RechartsScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts'
import { ParsedData } from '../../../types'
import { useTheme } from '../../../contexts/ThemeContext'
import {
  createScatterPlotData,
  getUniqueGroups,
  getDecimalPlaces,
  formatAxisLabel,
  CHART_COLORS
} from '../../../utils/visualization'

interface ScatterChartProps {
  data: ParsedData
  xVariable: string
  yVariable: string
  groupVariable?: string
}

const ScatterChart: FC<ScatterChartProps> = ({
  data,
  xVariable,
  yVariable,
  groupVariable
}) => {
  const { colors } = useTheme()
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
        <h3 style={{
          ...styles.chartTitle,
          color: colors.text.primary
        }}>Scatter Plot: {yVariable} vs {xVariable}</h3>
        <ResponsiveContainer width="100%" height={400}>
          <RechartsScatterChart>
            <CartesianGrid strokeDasharray="3 3" stroke={colors.border} />
            <XAxis
              type="number"
              dataKey="x"
              name={xVariable}
              label={{ value: xVariable, position: 'insideBottom', offset: -5, fill: colors.text.primary }}
              domain={[xLimits.min, xLimits.max]}
              tickFormatter={(value) => formatAxisLabel(value, xDecimals)}
              tick={{ fill: colors.text.primary }}
            />
            <YAxis
              type="number"
              dataKey="y"
              name={yVariable}
              label={{ value: yVariable, angle: -90, position: 'insideLeft', fill: colors.text.primary }}
              domain={[yLimits.min, yLimits.max]}
              tickFormatter={(value) => formatAxisLabel(value, yDecimals)}
              tick={{ fill: colors.text.primary }}
            />
            <Tooltip cursor={{ strokeDasharray: '3 3' }} />
            <Scatter name={yVariable} data={scatterData} fill={CHART_COLORS.primary} />
          </RechartsScatterChart>
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
      <h3 style={{
        ...styles.chartTitle,
        color: colors.text.primary
      }}>Scatter Plot: {yVariable} vs {xVariable} (grouped by {groupVariable})</h3>
      <ResponsiveContainer width="100%" height={400}>
        <RechartsScatterChart>
          <CartesianGrid strokeDasharray="3 3" stroke={colors.border} />
          <XAxis
            type="number"
            dataKey="x"
            name={xVariable}
            label={{ value: xVariable, position: 'insideBottom', offset: -5, fill: colors.text.primary }}
            domain={[xLimits.min, xLimits.max]}
            tickFormatter={(value) => formatAxisLabel(value, xDecimals)}
            tick={{ fill: colors.text.primary }}
          />
          <YAxis
            type="number"
            dataKey="y"
            name={yVariable}
            label={{ value: yVariable, angle: -90, position: 'insideLeft', fill: colors.text.primary }}
            domain={[yLimits.min, yLimits.max]}
            tickFormatter={(value) => formatAxisLabel(value, yDecimals)}
            tick={{ fill: colors.text.primary }}
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
        </RechartsScatterChart>
      </ResponsiveContainer>
    </div>
  )
}

const styles = {
  chart: {
    width: '100%'
  } as const,
  chartTitle: {
    margin: '0 0 12px 0',
    fontSize: '16px',
    fontWeight: '600',
    textAlign: 'center'
  } as const
}

export default ScatterChart
