import React, { FC } from 'react'
import {
  BarChart,
  Bar,
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
  createHistogram,
  createGroupedHistogram,
  getUniqueGroups,
  CHART_COLORS
} from '../../../utils/visualization'

interface HistogramChartProps {
  data: ParsedData
  variableName: string
  groupVariable?: string
}

const HistogramChart: FC<HistogramChartProps> = ({ data, variableName, groupVariable }) => {
  const { colors } = useTheme()

  // Use grouped histogram if groupVariable is provided
  const histogramData = groupVariable
    ? createGroupedHistogram(data.rows, variableName, groupVariable, 15)
    : createHistogram(data.rows.map(row => row[variableName]), 15)

  if (groupVariable) {
    // Grouped histogram with side-by-side (dodged) bars
    const groups = getUniqueGroups(data.rows, groupVariable)

    return (
      <div style={styles.chart}>
        <h3 style={{
          ...styles.chartTitle,
          color: colors.text.primary
        }}>Histogram: {variableName} (grouped by {groupVariable})</h3>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={histogramData}>
            <CartesianGrid strokeDasharray="3 3" stroke={colors.border} />
            <XAxis
              dataKey="label"
              label={{ value: variableName, position: 'insideBottom', offset: -5, fill: colors.text.primary }}
              angle={-45}
              textAnchor="end"
              height={80}
              tick={{ fill: colors.text.primary }}
            />
            <YAxis
              label={{ value: 'Frequency', angle: -90, position: 'insideLeft', fill: colors.text.primary }}
              tick={{ fill: colors.text.primary }}
            />
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
      <h3 style={{
        ...styles.chartTitle,
        color: colors.text.primary
      }}>Histogram: {variableName}</h3>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={histogramData}>
          <CartesianGrid strokeDasharray="3 3" stroke={colors.border} />
          <XAxis
            dataKey="label"
            label={{ value: variableName, position: 'insideBottom', offset: -5, fill: colors.text.primary }}
            angle={-45}
            textAnchor="end"
            height={80}
            tick={{ fill: colors.text.primary }}
          />
          <YAxis
            label={{ value: 'Frequency', angle: -90, position: 'insideLeft', fill: colors.text.primary }}
            tick={{ fill: colors.text.primary }}
          />
          <Tooltip />
          <Bar dataKey="count" fill={CHART_COLORS.primary} />
        </BarChart>
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

export default HistogramChart
