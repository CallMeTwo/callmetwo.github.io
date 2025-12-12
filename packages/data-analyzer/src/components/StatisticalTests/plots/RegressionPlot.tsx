import React, { FC } from 'react'
import { XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart, Scatter, Line } from 'recharts'
import { useTheme } from '../../../contexts/ThemeContext'
import { ParsedData } from '../../../types'
import { RegressionResult } from '../../../utils/statisticalTests'
import { CHART_COLORS, getDecimalPlaces, formatAxisLabel } from '../../../utils/visualization'

interface RegressionPlotProps {
  result: RegressionResult
  data: ParsedData
  variable1: string
  variable2: string
}

interface ChartDataPoint {
  x: number
  y: number
  actual: number
  predicted?: number
}

const RegressionPlot: FC<RegressionPlotProps> = ({ result, data, variable1, variable2 }) => {
  const { colors } = useTheme()
  // Extract x and y values
  const chartData: ChartDataPoint[] = []
  const xValues: number[] = []
  const yValues: number[] = []

  data.rows.forEach(row => {
    const x = row[variable2]
    const y = row[variable1]

    if (x !== null && x !== undefined && x !== '' && y !== null && y !== undefined && y !== '') {
      const xNum = typeof x === 'string' ? parseFloat(x) : Number(x)
      const yNum = typeof y === 'string' ? parseFloat(y) : Number(y)

      if (!isNaN(xNum) && !isNaN(yNum)) {
        xValues.push(xNum)
        yValues.push(yNum)
        chartData.push({ x: xNum, y: yNum, actual: yNum })
      }
    }
  })

  if (chartData.length < 2) return null

  // Get slope and intercept
  const coef = result.coefficients[0]
  const slope = coef.coefficient
  const intercept = result.intercept

  // Calculate fitted values and prediction intervals
  const xMin = Math.min(...xValues)
  const xMax = Math.max(...xValues)
  const xMean = xValues.reduce((a, b) => a + b, 0) / xValues.length

  // Calculate residual variance for prediction intervals
  let residualVariance = 0
  chartData.forEach(point => {
    const predicted = intercept + slope * point.x
    residualVariance += Math.pow(point.y - predicted, 2)
  })
  residualVariance = residualVariance / (chartData.length - 2)

  // Calculate sum of squared deviations of x
  const sumXDevSquared = xValues.reduce((sum, x) => sum + Math.pow(x - xMean, 2), 0)

  // Add predicted values to chart data
  chartData.forEach(point => {
    point.predicted = intercept + slope * point.x
  })

  // Calculate data bounds for axes
  const predictedValues = chartData.map(p => p.predicted)
  const allYValues = [...yValues, ...predictedValues]
  const yMin = Math.min(...allYValues)
  const yMax = Math.max(...allYValues)
  const yRange = yMax - yMin
  const yPadding = yRange * 0.1

  const decimals = getDecimalPlaces(yMin, yMax)

  return (
    <div style={{
      ...styles.visualizationContainer,
      backgroundColor: colors.surface,
      border: `1px solid ${colors.border}`
    }}>
      <h4 style={{
        ...styles.visualizationTitle,
        color: colors.text.primary
      }}>Regression Visualization</h4>

      <ResponsiveContainer width="100%" height={400}>
        <ComposedChart margin={{ top: 20, right: 30, left: 20, bottom: 20 }} data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="x"
            label={{ value: variable2, position: 'insideBottom', offset: -5 }}
            type="number"
            domain={[xMin - (xMax - xMin) * 0.1, xMax + (xMax - xMin) * 0.1]}
          />
          <YAxis
            label={{ value: variable1, angle: -90, position: 'insideLeft' }}
            domain={[yMin - yPadding, yMax + yPadding]}
            tickFormatter={(value) => formatAxisLabel(value, decimals)}
          />
          <Tooltip
            cursor={{ strokeDasharray: '3 3' }}
            formatter={(value: number | string) => (typeof value === 'number' ? formatAxisLabel(value, decimals) : value)}
            content={({ active, payload }) => {
              if (active && payload && payload[0]) {
                const data = payload[0].payload as ChartDataPoint
                return (
                  <div style={{ backgroundColor: '#fff', border: '1px solid #ccc', padding: '5px' }}>
                    <p>{`${variable2}: ${formatAxisLabel(data.x, decimals)}`}</p>
                    <p>{`Actual: ${formatAxisLabel(data.y, decimals)}`}</p>
                    <p>{`Predicted: ${formatAxisLabel(data.y, decimals)}`}</p>
                  </div>
                )
              }
              return null
            }}
          />
          <Legend />

          {/* Fitted Regression Line */}
          <Line
            dataKey="predicted"
            stroke={CHART_COLORS.accent}
            strokeWidth={2}
            dot={false}
            isAnimationActive={false}
            name="Fitted Line"
          />

          {/* Actual Data Points */}
          <Scatter dataKey="y" fill={CHART_COLORS.primary} shape="circle" name="Actual Data" />
        </ComposedChart>
      </ResponsiveContainer>

      <div style={{
        ...styles.regressionInfo,
        backgroundColor: colors.primary + '20',
        color: colors.text.primary
      }}>
        <p>
          <strong>Regression Equation:</strong> {variable1} = {intercept.toFixed(4)} + {slope.toFixed(4)} × {variable2}
        </p>
        <p>
          <strong>R²:</strong> {(result.rSquared || 0).toFixed(4)} | <strong>Adjusted R²:</strong> {(result.adjustedRSquared || 0).toFixed(4)}
        </p>
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
  regressionInfo: {
    padding: '15px',
    borderRadius: '6px',
    marginTop: '15px',
    fontSize: '13px'
  } as const
}

export default RegressionPlot
