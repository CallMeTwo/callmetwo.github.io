import React, { FC } from 'react'
import ReactECharts from 'echarts-for-react'
import { ParsedData } from '../../../types'
import {
  createBoxPlotData,
  createGroupedBoxPlotData,
  getDecimalPlaces,
  formatAxisLabel,
  CHART_COLORS
} from '../../../utils/visualization'

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
    interface OutlierDataPoint {
      value: [number, number]
      group: string
      groupIdx: number
    }

    const allOutliersData: OutlierDataPoint[] = []
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
          color: (params: { dataIndex: number }) => {
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
        formatter: (params: { seriesType?: string; value: number[]; dataIndex: number; name?: string }) => {
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
          return params.name || ''
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
      formatter: (params: { seriesType?: string; value: number[]; name?: string }) => {
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
        return params.name || ''
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
  } as const
}

export default BoxPlotChart
