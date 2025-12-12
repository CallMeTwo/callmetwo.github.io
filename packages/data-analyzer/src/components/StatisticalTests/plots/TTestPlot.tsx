import React, { FC, useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ErrorBar, ComposedChart, Scatter } from 'recharts'
import ReactECharts from 'echarts-for-react'
import { useTheme } from '../../../contexts/ThemeContext'
import { ParsedData } from '../../../types'
import { TTestResult, groupNumericData } from '../../../utils/statisticalTests'
import { createHistogram, createBoxPlotData, CHART_COLORS, getDecimalPlaces, formatAxisLabel } from '../../../utils/visualization'

interface TTestPlotProps {
  result: TTestResult
  data: ParsedData
  variable1: string
  variable2: string
}

type TTestPlotType = 'boxplot' | 'meanCI' | 'histogram'

const TTestPlot: FC<TTestPlotProps> = ({ result, data, variable1, variable2 }) => {
  const { colors } = useTheme()
  const [plotType, setPlotType] = useState<TTestPlotType>('boxplot')

  // Extract group data
  const groups = groupNumericData(data.rows, variable1, variable2)
  const groupNames = Object.keys(groups).sort()

  if (groupNames.length !== 2) {
    return null
  }

  const group1Name = groupNames[0]
  const group2Name = groupNames[1]
  const group1Data = groups[group1Name]
  const group2Data = groups[group2Name]

  // Side-by-Side Boxplot
  const renderBoxPlot = () => {
    const box1 = createBoxPlotData(group1Data)
    const box2 = createBoxPlotData(group2Data)

    if (!box1 || !box2) return null

    interface BoxData {
      min: number
      q1: number
      median: number
      q3: number
      max: number
      outliers: number[]
    }

    const createBoxPlotValues = (boxData: BoxData) => [
      boxData.min,
      boxData.q1,
      boxData.median,
      boxData.q3,
      boxData.max,
      ...boxData.outliers
    ]

    const box1Values = createBoxPlotValues(box1)
    const box2Values = createBoxPlotValues(box2)

    // Calculate dynamic ymin (minimum value with padding)
    const allValues = [...group1Data, ...group2Data]
    const dataMin = Math.min(...allValues)
    const dataMax = Math.max(...allValues)
    const range = dataMax - dataMin
    const ymin = dataMin - range * 0.1 // Add 10% padding below minimum

    // Calculate appropriate decimal places for formatting
    const decimals = getDecimalPlaces(dataMin, dataMax)

    const option = {
      title: {
        text: `Box Plot: ${variable1} by ${variable2}`,
        left: 'center',
        textStyle: { fontSize: 16, fontWeight: 'bold', color: colors.text.primary }
      },
      tooltip: {
        trigger: 'item',
        formatter: (params: { seriesType?: string; value: number[]; dataIndex: number; name?: string }) => {
          if (params.seriesType === 'boxplot') {
            const [min, q1, median, q3, max] = params.value
            const groupName = groupNames[params.dataIndex]
            return `<div style="padding: 5px;"><strong>${groupName}</strong><br/>Min: ${formatAxisLabel(min, decimals)}<br/>Q1: ${formatAxisLabel(q1, decimals)}<br/>Median: ${formatAxisLabel(median, decimals)}<br/>Q3: ${formatAxisLabel(q3, decimals)}<br/>Max: ${formatAxisLabel(max, decimals)}</div>`
          }
          return params.name || ''
        }
      },
      grid: { left: '10%', right: '10%', bottom: '15%', top: '15%', containLabel: true },
      xAxis: {
        type: 'category',
        data: [group1Name, group2Name],
        axisLabel: { fontSize: 12, color: colors.text.primary },
        axisLine: { lineStyle: { color: colors.border } }
      },
      yAxis: {
        type: 'value',
        name: 'Value',
        nameTextStyle: { color: colors.text.secondary, fontSize: 12 },
        axisLabel: {
          fontSize: 12,
          color: colors.text.primary,
          formatter: (value: number) => formatAxisLabel(value, decimals)
        },
        axisLine: { lineStyle: { color: colors.border } },
        splitLine: { lineStyle: { color: colors.border } },
        min: ymin
      },
      series: [
        {
          name: 'Box Plot',
          type: 'boxplot',
          data: [box1Values, box2Values],
          itemStyle: {
            color: (params: { dataIndex: number }) => CHART_COLORS.palette[params.dataIndex],
            borderColor: '#333'
          },
          boxWidth: ['20%', '50%']
        },
        {
          name: 'Outliers',
          type: 'scatter',
          data: [
            ...box1.outliers.map(v => [0, v]),
            ...box2.outliers.map(v => [1, v])
          ],
          symbolSize: 4,
          itemStyle: { opacity: 0.6, color: '#e74c3c' }
        }
      ]
    }

    return (
      <ReactECharts
        option={option}
        style={{ height: '400px', width: '100%' }}
        notMerge
        lazyUpdate
      />
    )
  }

  // Mean ± 95% CI Plot
  const renderMeanCIPlot = () => {
    // Calculate statistics for group 1
    const n1 = group1Data.length
    const mean1 = group1Data.reduce((a, b) => a + b, 0) / n1
    const variance1 = group1Data.reduce((sum, val) => sum + Math.pow(val - mean1, 2), 0) / (n1 - 1)
    const sd1 = Math.sqrt(variance1)
    const se1 = sd1 / Math.sqrt(n1)

    // Calculate statistics for group 2
    const n2 = group2Data.length
    const mean2 = group2Data.reduce((a, b) => a + b, 0) / n2
    const variance2 = group2Data.reduce((sum, val) => sum + Math.pow(val - mean2, 2), 0) / (n2 - 1)
    const sd2 = Math.sqrt(variance2)
    const se2 = sd2 / Math.sqrt(n2)

    // Get t-critical value for 95% CI (two-tailed, alpha=0.05)
    // Using approximation: for df > 30, t ≈ 1.96
    const getTCritical = (df: number) => {
      // Common t-values for 95% CI (two-tailed)
      const tValues: { [key: number]: number } = {
        1: 12.706, 2: 4.303, 3: 3.182, 4: 2.776, 5: 2.571,
        6: 2.447, 7: 2.365, 8: 2.306, 9: 2.262, 10: 2.228,
        15: 2.131, 20: 2.086, 25: 2.060, 30: 2.042
      }
      if (tValues[df]) return tValues[df]
      return df > 30 ? 1.96 : 2.045 // Default for larger df
    }

    const t1 = getTCritical(n1 - 1)
    const t2 = getTCritical(n2 - 1)

    const error1 = t1 * se1
    const error2 = t2 * se2

    const data = [
      {
        group: group1Name,
        mean: mean1,
        error: error1
      },
      {
        group: group2Name,
        mean: mean2,
        error: error2
      }
    ]

    // Calculate dynamic ymin (minimum value - CI lower bound with padding)
    const lowerBounds = [mean1 - error1, mean2 - error2]
    const upperBounds = [mean1 + error1, mean2 + error2]
    const dataMin = Math.min(...lowerBounds)
    const dataMax = Math.max(...upperBounds)
    const range = dataMax - dataMin
    const ymin = dataMin - range * 0.1 // Add 10% padding below minimum

    // Calculate appropriate decimal places for formatting
    const decimals = getDecimalPlaces(dataMin, dataMax)

    return (
      <ResponsiveContainer width="100%" height={400}>
        <ComposedChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="group" padding={{ left: 150, right: 150 }} />
          <YAxis
            label={{ value: variable1, angle: -90, position: 'insideLeft' }}
            domain={[ymin, 'auto']}
            tickFormatter={(value) => formatAxisLabel(value, decimals)}
          />
          <Tooltip
            formatter={(value: number | string) => (typeof value === 'number' ? formatAxisLabel(value, decimals) : value)}
            contentStyle={{ backgroundColor: '#fff', border: '1px solid #ccc' }}
          />
          <Scatter dataKey="mean" fill={CHART_COLORS.primary} shape="circle" size={120}>
            <ErrorBar
              dataKey="error"
              direction="y"
              stroke="#333"
              strokeWidth={2}
            />
          </Scatter>
        </ComposedChart>
      </ResponsiveContainer>
    )
  }

  // Histogram with Group Colors
  const renderHistogram = () => {
    const hist1 = createHistogram(group1Data, 10)
    const hist2 = createHistogram(group2Data, 10)

    // Merge histograms by bin
    const mergedData = hist1.map((bin1, idx) => {
      const bin2 = hist2[idx]
      return {
        label: bin1.label,
        [group1Name]: bin1.count,
        [group2Name]: bin2.count
      }
    })

    return (
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={mergedData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="label"
            label={{ value: variable1, position: 'insideBottom', offset: -5 }}
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis label={{ value: 'Frequency', angle: -90, position: 'insideLeft' }} />
          <Tooltip />
          <Legend />
          <Bar dataKey={group1Name} fill={CHART_COLORS.palette[0]} />
          <Bar dataKey={group2Name} fill={CHART_COLORS.palette[1]} />
        </BarChart>
      </ResponsiveContainer>
    )
  }

  return (
    <div style={{
      ...styles.visualizationContainer,
      backgroundColor: colors.surface,
      border: `1px solid ${colors.border}`
    }}>
      <h4 style={{
        ...styles.visualizationTitle,
        color: colors.text.primary
      }}>Visualization</h4>

      {/* Plot Type Selection */}
      <div style={{
        ...styles.plotTypeSelector,
        backgroundColor: colors.background,
        border: `1px solid ${colors.border}`
      }}>
        <label style={{
          ...styles.label,
          color: colors.text.secondary
        }}>Choose Visualization:</label>
        <div style={styles.radioGroup}>
          {[
            { value: 'boxplot', label: '📦 Side-by-Side Boxplot' },
            { value: 'meanCI', label: '📊 Mean ± 95% CI Plot' },
            { value: 'histogram', label: '📈 Histogram with Group Colors' }
          ].map(option => (
            <label key={option.value} style={{
              ...styles.radioLabel,
              color: colors.text.primary
            }}>
              <input
                type="radio"
                value={option.value}
                checked={plotType === option.value}
                onChange={(e) => setPlotType(e.target.value as TTestPlotType)}
                style={styles.radioInput}
              />
              {option.label}
            </label>
          ))}
        </div>
      </div>

      {/* Plot Display */}
      <div style={{
        ...styles.plotContainer,
        backgroundColor: colors.background,
        border: `1px solid ${colors.border}`
      }}>
        {plotType === 'boxplot' && renderBoxPlot()}
        {plotType === 'meanCI' && renderMeanCIPlot()}
        {plotType === 'histogram' && renderHistogram()}
      </div>
    </div>
  )
}

const styles = {
  visualizationContainer: {
    padding: '20px',
    borderRadius: '8px',
    marginTop: '20px'
  } as const,
  visualizationTitle: {
    margin: '0 0 15px 0',
    fontSize: '18px',
    fontWeight: '600'
  } as const,
  plotTypeSelector: {
    marginBottom: '20px',
    padding: '15px',
    borderRadius: '6px'
  } as const,
  label: {
    display: 'block',
    fontSize: '13px',
    fontWeight: '600',
    marginBottom: '8px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  } as const,
  radioGroup: {
    display: 'flex',
    gap: '20px',
    flexWrap: 'wrap',
    marginTop: '10px'
  } as const,
  radioLabel: {
    display: 'flex',
    alignItems: 'center',
    fontSize: '14px',
    cursor: 'pointer',
    gap: '8px'
  } as const,
  radioInput: {
    cursor: 'pointer',
    marginRight: '4px'
  } as const,
  plotContainer: {
    borderRadius: '6px',
    padding: '15px',
    minHeight: '450px'
  } as const
}

export default TTestPlot
