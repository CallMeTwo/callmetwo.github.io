import React, { FC, useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { useTheme } from '../../../contexts/ThemeContext'
import { ParsedData } from '../../../types'
import { ChiSquareResult } from '../../../utils/statisticalTests'
import { CHART_COLORS } from '../../../utils/visualization'

interface ChiSquarePlotProps {
  result: ChiSquareResult
  data: ParsedData
  variable1: string
  variable2: string
}

type ChiSquarePlotType = 'stackedCount' | 'clusteredCount' | 'stackedPercent' | 'clusteredPercent'

const ChiSquarePlot: FC<ChiSquarePlotProps> = ({ result, data, variable1, variable2 }) => {
  const { colors } = useTheme()
  const [plotType, setPlotType] = useState<ChiSquarePlotType>('clusteredCount')

  // Transform contingency table to chart data
  const prepareChartData = (asPercentage: boolean = false) => {
    const contingencyTable = result.contingencyTable
    const var1Categories = Object.keys(contingencyTable)
    const var2Categories = new Set<string>()

    // Collect all var2 categories
    var1Categories.forEach(cat1 => {
      Object.keys(contingencyTable[cat1]).forEach(cat2 => var2Categories.add(cat2))
    })

    const var2CategoriesArray = Array.from(var2Categories)

    // Build chart data array
    interface ChartDataRow {
      category: string
      [key: string]: string | number
    }

    const chartData = var1Categories.map(cat1 => {
      const row: ChartDataRow = { category: cat1 }

      // Calculate totals if percentage mode
      let rowTotal = 0
      if (asPercentage) {
        var2CategoriesArray.forEach(cat2 => {
          rowTotal += contingencyTable[cat1][cat2] || 0
        })
      }

      // Add counts or percentages for each var2 category
      var2CategoriesArray.forEach(cat2 => {
        const count = contingencyTable[cat1][cat2] || 0
        row[cat2] = asPercentage && rowTotal > 0 ? (count / rowTotal) * 100 : count
      })

      return row
    })

    return { chartData, var2Categories: var2CategoriesArray }
  }

  // Stacked Bar Chart (Count)
  const renderStackedCount = () => {
    const { chartData, var2Categories } = prepareChartData(false)

    return (
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="category" label={{ value: variable1, position: 'insideBottom', offset: -5 }} />
          <YAxis label={{ value: 'Count', angle: -90, position: 'insideLeft' }} />
          <Tooltip />
          <Legend />
          {var2Categories.map((cat, idx) => (
            <Bar key={cat} dataKey={cat} stackId="a" fill={CHART_COLORS.palette[idx % CHART_COLORS.palette.length]} />
          ))}
        </BarChart>
      </ResponsiveContainer>
    )
  }

  // Clustered Bar Chart (Count)
  const renderClusteredCount = () => {
    const { chartData, var2Categories } = prepareChartData(false)

    return (
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="category" label={{ value: variable1, position: 'insideBottom', offset: -5 }} />
          <YAxis label={{ value: 'Count', angle: -90, position: 'insideLeft' }} />
          <Tooltip />
          <Legend />
          {var2Categories.map((cat, idx) => (
            <Bar key={cat} dataKey={cat} fill={CHART_COLORS.palette[idx % CHART_COLORS.palette.length]} />
          ))}
        </BarChart>
      </ResponsiveContainer>
    )
  }

  // Stacked Bar Chart (Percentage)
  const renderStackedPercent = () => {
    const { chartData, var2Categories } = prepareChartData(true)

    return (
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="category" label={{ value: variable1, position: 'insideBottom', offset: -5 }} />
          <YAxis label={{ value: 'Percentage (%)', angle: -90, position: 'insideLeft' }} />
          <Tooltip formatter={(value: number | string) => `${typeof value === 'number' ? value.toFixed(1) : value}%`} />
          <Legend />
          {var2Categories.map((cat, idx) => (
            <Bar key={cat} dataKey={cat} stackId="a" fill={CHART_COLORS.palette[idx % CHART_COLORS.palette.length]} />
          ))}
        </BarChart>
      </ResponsiveContainer>
    )
  }

  // Clustered Bar Chart (Percentage)
  const renderClusteredPercent = () => {
    const { chartData, var2Categories } = prepareChartData(true)

    return (
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="category" label={{ value: variable1, position: 'insideBottom', offset: -5 }} />
          <YAxis label={{ value: 'Percentage (%)', angle: -90, position: 'insideLeft' }} />
          <Tooltip formatter={(value: number | string) => `${typeof value === 'number' ? value.toFixed(1) : value}%`} />
          <Legend />
          {var2Categories.map((cat, idx) => (
            <Bar key={cat} dataKey={cat} fill={CHART_COLORS.palette[idx % CHART_COLORS.palette.length]} />
          ))}
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
            { value: 'stackedCount', label: '📊 Stacked Bar Chart (Count)' },
            { value: 'clusteredCount', label: '📊 Clustered Bar Chart (Count)' },
            { value: 'stackedPercent', label: '📈 Stacked Bar Chart (%)' },
            { value: 'clusteredPercent', label: '📈 Clustered Bar Chart (%)' }
          ].map(option => (
            <label key={option.value} style={{
              ...styles.radioLabel,
              color: colors.text.primary
            }}>
              <input
                type="radio"
                value={option.value}
                checked={plotType === option.value}
                onChange={(e) => setPlotType(e.target.value as ChiSquarePlotType)}
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
        {plotType === 'stackedCount' && renderStackedCount()}
        {plotType === 'clusteredCount' && renderClusteredCount()}
        {plotType === 'stackedPercent' && renderStackedPercent()}
        {plotType === 'clusteredPercent' && renderClusteredPercent()}
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

export default ChiSquarePlot
