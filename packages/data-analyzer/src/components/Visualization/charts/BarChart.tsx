import React, { FC } from 'react'
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell
} from 'recharts'
import { ParsedData } from '../../../types'
import {
  createBarChartData,
  createGroupedBarData,
  getUniqueGroups,
  CHART_COLORS
} from '../../../utils/visualization'

interface BarChartProps {
  data: ParsedData
  variableName: string
  groupVariable?: string
}

const BarChart: FC<BarChartProps> = ({ data, variableName, groupVariable }) => {
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
    interface GroupedBarDataItem {
      category: string
      [key: string]: string | number
    }

    const chartData = Array.from(frequencyData.entries()).map(([category, groupMap]) => {
      const item: GroupedBarDataItem = { category }
      groups.forEach(group => {
        item[group] = groupMap.get(group) || 0
      })
      return item
    })

    return (
      <div style={styles.chart}>
        <h3 style={styles.chartTitle}>Bar Chart: {variableName} (grouped by {groupVariable})</h3>
        <ResponsiveContainer width="100%" height={400}>
          <RechartsBarChart data={chartData}>
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
          </RechartsBarChart>
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
        <RechartsBarChart data={barData}>
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
        </RechartsBarChart>
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
    color: '#333',
    textAlign: 'center'
  } as const
}

export default BarChart
