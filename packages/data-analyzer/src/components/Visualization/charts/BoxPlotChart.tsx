import React, { FC } from 'react'
import ReactECharts from 'echarts-for-react'
import { ParsedData } from '../../../types'
import { useTheme } from '../../../contexts/ThemeContext'
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
  const { colors } = useTheme()

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
          borderColor: colors.text.primary
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
          color: colors.text.primary
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
          fontSize: 12,
          color: colors.text.primary
        },
        axisLine: {
          lineStyle: {
            color: colors.border
          }
        }
      },
      yAxis: {
        type: 'value',
        name: 'Value',
        nameTextStyle: {
          color: colors.text.secondary,
          fontSize: 12
        },
        axisLabel: {
          fontSize: 12,
          color: colors.text.primary,
          formatter: (value: number) => formatAxisLabel(value, yDecimals)
        },
        axisLine: {
          lineStyle: {
            color: colors.border
          }
        },
        splitLine: {
          lineStyle: {
            color: colors.border
          }
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
        color: colors.text.primary
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
        fontSize: 12,
        color: colors.text.primary
      },
      axisLine: {
        lineStyle: {
          color: colors.border
        }
      }
    },
    yAxis: {
      type: 'value',
      name: 'Value',
      nameTextStyle: {
        color: colors.text.secondary,
        fontSize: 12
      },
      axisLabel: {
        fontSize: 12,
        color: colors.text.primary,
        formatter: (value: number) => formatAxisLabel(value, nongroupedYDecimals)
      },
      axisLine: {
        lineStyle: {
          color: colors.border
        }
      },
      splitLine: {
        lineStyle: {
          color: colors.border
        }
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
          borderColor: colors.text.primary
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
        <div style={{
          ...styles.boxPlotStats,
          backgroundColor: colors.surface,
          border: `1px solid ${colors.border}`
        }}>
          <div style={styles.boxPlotStat}>
            <span style={{
              ...styles.boxPlotLabel,
              color: colors.text.secondary
            }}>Min</span>
            <span style={{
              ...styles.boxPlotValue,
              color: colors.text.primary
            }}>{boxData.min.toFixed(2)}</span>
          </div>
          <div style={styles.boxPlotStat}>
            <span style={{
              ...styles.boxPlotLabel,
              color: colors.text.secondary
            }}>Q1</span>
            <span style={{
              ...styles.boxPlotValue,
              color: colors.text.primary
            }}>{boxData.q1.toFixed(2)}</span>
          </div>
          <div style={styles.boxPlotStat}>
            <span style={{
              ...styles.boxPlotLabel,
              color: colors.text.secondary
            }}>Median</span>
            <span style={{
              ...styles.boxPlotValue,
              color: colors.text.primary
            }}>{boxData.median.toFixed(2)}</span>
          </div>
          <div style={styles.boxPlotStat}>
            <span style={{
              ...styles.boxPlotLabel,
              color: colors.text.secondary
            }}>Q3</span>
            <span style={{
              ...styles.boxPlotValue,
              color: colors.text.primary
            }}>{boxData.q3.toFixed(2)}</span>
          </div>
          <div style={styles.boxPlotStat}>
            <span style={{
              ...styles.boxPlotLabel,
              color: colors.text.secondary
            }}>Max</span>
            <span style={{
              ...styles.boxPlotValue,
              color: colors.text.primary
            }}>{boxData.max.toFixed(2)}</span>
          </div>
          {boxData.outliers.length > 0 && (
            <div style={styles.boxPlotStat}>
              <span style={{
                ...styles.boxPlotLabel,
                color: colors.text.secondary
              }}>Outliers</span>
              <span style={{
                ...styles.boxPlotValue,
                color: colors.text.primary
              }}>{boxData.outliers.length}</span>
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
    fontWeight: '600',
    marginBottom: '3px'
  } as const,
  boxPlotValue: {
    fontSize: '14px',
    fontWeight: 'bold',
    fontFamily: 'monospace'
  } as const
}

export default BoxPlotChart
