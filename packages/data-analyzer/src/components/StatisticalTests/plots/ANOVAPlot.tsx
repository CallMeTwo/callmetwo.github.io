import React, { FC, useState } from 'react'
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ErrorBar, ComposedChart, Scatter } from 'recharts'
import ReactECharts from 'echarts-for-react'
import { ParsedData } from '../../../types'
import { ANOVAResult, groupNumericData } from '../../../utils/statisticalTests'
import { createBoxPlotData, CHART_COLORS, getDecimalPlaces, formatAxisLabel } from '../../../utils/visualization'

interface AnovaPlotProps {
  result: ANOVAResult
  data: ParsedData
  variable1: string
  variable2: string
}

type AnovaPlotType = 'boxplot' | 'meanCI'

const AnovaPlot: FC<AnovaPlotProps> = ({ result, data, variable1, variable2 }) => {
  const [plotType, setPlotType] = useState<AnovaPlotType>('boxplot')

  // Group the data by variable2
  const groups = groupNumericData(data.rows, variable1, variable2)
  const groupNames = Object.keys(groups).sort()

  // Side-by-side Boxplot
  const renderBoxPlot = () => {
    const boxPlots = groupNames.map(groupName => {
      const groupData = groups[groupName]
      return { groupName, boxData: createBoxPlotData(groupData) }
    }).filter(item => item.boxData !== null)

    if (boxPlots.length === 0) return null

    interface BoxData {
      min: number
      q1: number
      median: number
      q3: number
      max: number
      outliers: number[]
    }

    const createBoxPlotValues = (boxData: BoxData) => [
      boxData.min, boxData.q1, boxData.median, boxData.q3, boxData.max, ...boxData.outliers
    ]

    // Collect all values for ymin calculation
    const allValues = groupNames.flatMap(name => groups[name])
    const dataMin = Math.min(...allValues)
    const dataMax = Math.max(...allValues)
    const range = dataMax - dataMin
    const ymin = dataMin - range * 0.1

    const decimals = getDecimalPlaces(dataMin, dataMax)

    const option = {
      title: {
        text: `Box Plot: ${variable1} by ${variable2}`,
        left: 'center',
        textStyle: { fontSize: 16, fontWeight: 'bold', color: '#333' }
      },
      tooltip: {
        trigger: 'item',
        formatter: (params: { seriesType?: string; value: number[]; dataIndex: number; name?: string }) => {
          if (params.seriesType === 'boxplot') {
            const [min, q1, median, q3, max] = params.value
            return `<div style="padding: 5px;"><strong>${groupNames[params.dataIndex]}</strong><br/>Min: ${formatAxisLabel(min, decimals)}<br/>Q1: ${formatAxisLabel(q1, decimals)}<br/>Median: ${formatAxisLabel(median, decimals)}<br/>Q3: ${formatAxisLabel(q3, decimals)}<br/>Max: ${formatAxisLabel(max, decimals)}</div>`
          }
          return params.name || ''
        }
      },
      grid: { left: '10%', right: '10%', bottom: '15%', top: '15%', containLabel: true },
      xAxis: {
        type: 'category',
        data: groupNames,
        axisLabel: { fontSize: 12 }
      },
      yAxis: {
        type: 'value',
        name: 'Value',
        nameTextStyle: { color: '#666', fontSize: 12 },
        axisLabel: {
          fontSize: 12,
          formatter: (value: number) => formatAxisLabel(value, decimals)
        },
        min: ymin
      },
      series: [
        {
          name: 'Box Plot',
          type: 'boxplot',
          data: boxPlots.map(item => createBoxPlotValues(item.boxData!)),
          itemStyle: {
            color: (params: { dataIndex: number }) => CHART_COLORS.palette[params.dataIndex % CHART_COLORS.palette.length],
            borderColor: '#333'
          },
          boxWidth: ['15%', '50%']
        },
        {
          name: 'Outliers',
          type: 'scatter',
          data: boxPlots.flatMap((item, idx) =>
            item.boxData!.outliers.map((v: number) => [idx, v])
          ),
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
    if (!result.groupStats || result.groupStats.length === 0) return null

    const getTCritical = (df: number) => {
      const tValues: { [key: number]: number } = {
        1: 12.706, 2: 4.303, 3: 3.182, 4: 2.776, 5: 2.571,
        6: 2.447, 7: 2.365, 8: 2.306, 9: 2.262, 10: 2.228,
        15: 2.131, 20: 2.086, 25: 2.060, 30: 2.042
      }
      if (tValues[df]) return tValues[df]
      return df > 30 ? 1.96 : 2.045
    }

    const data = result.groupStats.map(stat => {
      const t_crit = getTCritical(stat.n - 1)
      const se = stat.sd / Math.sqrt(stat.n)
      const error = t_crit * se
      return {
        group: stat.group,
        mean: stat.mean,
        error
      }
    })

    const lowerBounds = data.map(d => d.mean - d.error)
    const upperBounds = data.map(d => d.mean + d.error)
    const dataMin = Math.min(...lowerBounds)
    const dataMax = Math.max(...upperBounds)
    const range = dataMax - dataMin
    const ymin = dataMin - range * 0.1

    const decimals = getDecimalPlaces(dataMin, dataMax)

    return (
      <ResponsiveContainer width="100%" height={400}>
        <ComposedChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="group" padding={{ left: 50, right: 50 }} />
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

  return (
    <div style={styles.visualizationContainer}>
      <h4 style={styles.visualizationTitle}>Visualization</h4>

      {/* Plot Type Selection */}
      <div style={styles.plotTypeSelector}>
        <label style={styles.label}>Choose Visualization:</label>
        <div style={styles.radioGroup}>
          {[
            { value: 'boxplot', label: '📦 Side-by-Side Boxplot' },
            { value: 'meanCI', label: '📊 Mean ± 95% CI Plot' }
          ].map(option => (
            <label key={option.value} style={styles.radioLabel}>
              <input
                type="radio"
                value={option.value}
                checked={plotType === option.value}
                onChange={(e) => setPlotType(e.target.value as AnovaPlotType)}
                style={styles.radioInput}
              />
              {option.label}
            </label>
          ))}
        </div>
      </div>

      {/* Plot Display */}
      <div style={styles.plotContainer}>
        {plotType === 'boxplot' && renderBoxPlot()}
        {plotType === 'meanCI' && renderMeanCIPlot()}
      </div>
    </div>
  )
}

const styles = {
  visualizationContainer: {
    padding: '20px',
    backgroundColor: '#f9f9f9',
    borderRadius: '8px',
    border: '1px solid #e0e0e0',
    marginTop: '20px'
  } as const,
  visualizationTitle: {
    margin: '0 0 15px 0',
    fontSize: '18px',
    fontWeight: '600',
    color: '#2c3e50'
  } as const,
  plotTypeSelector: {
    marginBottom: '20px',
    padding: '15px',
    backgroundColor: 'white',
    borderRadius: '6px',
    border: '1px solid #e0e0e0'
  } as const,
  label: {
    display: 'block',
    fontSize: '13px',
    fontWeight: '600',
    color: '#666',
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
    color: '#333',
    cursor: 'pointer',
    gap: '8px'
  } as const,
  radioInput: {
    cursor: 'pointer',
    marginRight: '4px'
  } as const,
  plotContainer: {
    backgroundColor: 'white',
    borderRadius: '6px',
    border: '1px solid #e0e0e0',
    padding: '15px',
    minHeight: '450px'
  } as const
}

export default AnovaPlot
