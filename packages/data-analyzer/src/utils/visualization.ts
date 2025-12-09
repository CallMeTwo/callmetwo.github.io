import { DataRow } from '../types'

export interface HistogramBin {
  binStart: number
  binEnd: number
  binCenter: number
  count: number
  label: string
}

export interface BoxPlotData {
  min: number
  q1: number
  median: number
  q3: number
  max: number
  outliers: number[]
}

/**
 * Create histogram bins for continuous data
 */
export function createHistogram(
  values: (string | number | null)[],
  numBins: number = 10
): HistogramBin[] {
  // Filter and convert to numbers
  const numericValues = values
    .filter(v => v !== null && v !== undefined && v !== '')
    .map(v => typeof v === 'string' ? parseFloat(v) : v)
    .filter(v => !isNaN(v)) as number[]

  if (numericValues.length === 0) {
    return []
  }

  const min = Math.min(...numericValues)
  const max = Math.max(...numericValues)
  const range = max - min
  const binWidth = range / numBins

  // Create bins
  const bins: HistogramBin[] = []
  for (let i = 0; i < numBins; i++) {
    const binStart = min + i * binWidth
    const binEnd = min + (i + 1) * binWidth
    const binCenter = (binStart + binEnd) / 2

    bins.push({
      binStart,
      binEnd,
      binCenter,
      count: 0,
      label: `${binStart.toFixed(1)}-${binEnd.toFixed(1)}`
    })
  }

  // Count values in each bin
  numericValues.forEach(value => {
    const binIndex = Math.min(
      Math.floor((value - min) / binWidth),
      numBins - 1
    )
    bins[binIndex].count++
  })

  return bins
}

/**
 * Calculate box plot statistics
 */
export function createBoxPlotData(values: (string | number | null)[]): BoxPlotData | null {
  // Filter and convert to numbers
  const numericValues = values
    .filter(v => v !== null && v !== undefined && v !== '')
    .map(v => typeof v === 'string' ? parseFloat(v) : v)
    .filter(v => !isNaN(v)) as number[]

  if (numericValues.length === 0) {
    return null
  }

  // Sort values
  const sorted = [...numericValues].sort((a, b) => a - b)
  const n = sorted.length

  // Calculate quartiles
  const q1 = sorted[Math.floor(n * 0.25)]
  const median = sorted[Math.floor(n * 0.5)]
  const q3 = sorted[Math.floor(n * 0.75)]
  const iqr = q3 - q1

  // Calculate whiskers (1.5 * IQR rule)
  const lowerWhisker = q1 - 1.5 * iqr
  const upperWhisker = q3 + 1.5 * iqr

  // Find actual min/max within whiskers and outliers
  const outliers: number[] = []
  let min = sorted[0]
  let max = sorted[n - 1]

  sorted.forEach(value => {
    if (value < lowerWhisker || value > upperWhisker) {
      outliers.push(value)
    } else {
      if (value < q1 && value > min) min = value
      if (value > q3 && value < max) max = value
    }
  })

  // Ensure whiskers don't go beyond actual data
  min = Math.max(min, sorted[0])
  max = Math.min(max, sorted[n - 1])

  return {
    min,
    q1,
    median,
    q3,
    max,
    outliers
  }
}

/**
 * Prepare categorical data for bar chart
 */
export interface BarChartData {
  category: string
  count: number
  percentage: number
}

export function createBarChartData(
  values: (string | number | null)[],
  maxCategories: number = 20
): BarChartData[] {
  // Filter out missing values
  const validValues = values.filter(v => v !== null && v !== undefined && v !== '')

  if (validValues.length === 0) {
    return []
  }

  // Count frequencies
  const frequencyMap = new Map<string, number>()
  validValues.forEach(value => {
    const key = String(value)
    frequencyMap.set(key, (frequencyMap.get(key) || 0) + 1)
  })

  // Convert to array and sort by count
  const data = Array.from(frequencyMap.entries())
    .map(([category, count]) => ({
      category,
      count,
      percentage: (count / validValues.length) * 100
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, maxCategories)

  return data
}

/**
 * Prepare scatter plot data
 */
export interface ScatterPlotData {
  x: number
  y: number
  group?: string
}

export function createScatterPlotData(
  rows: DataRow[],
  xVariable: string,
  yVariable: string,
  groupVariable?: string
): ScatterPlotData[] {
  return rows
    .map(row => {
      const xVal = row[xVariable]
      const yVal = row[yVariable]

      // Convert to numbers
      const x = typeof xVal === 'string' ? parseFloat(xVal) : Number(xVal)
      const y = typeof yVal === 'string' ? parseFloat(yVal) : Number(yVal)

      // Skip if invalid
      if (isNaN(x) || isNaN(y)) {
        return null
      }

      const point: ScatterPlotData = { x, y }

      if (groupVariable) {
        point.group = String(row[groupVariable] || 'Unknown')
      }

      return point
    })
    .filter((point): point is ScatterPlotData => point !== null)
}

/**
 * Prepare grouped bar chart data
 */
export interface GroupedBarData {
  category: string
  [key: string]: number | string
}

export function createGroupedBarData(
  rows: DataRow[],
  categoryVariable: string,
  valueVariable: string,
  groupVariable: string
): GroupedBarData[] {
  const grouped = new Map<string, Map<string, number[]>>()

  // Group data
  rows.forEach(row => {
    const category = String(row[categoryVariable] || 'Unknown')
    const group = String(row[groupVariable] || 'Unknown')
    const value = typeof row[valueVariable] === 'string'
      ? parseFloat(row[valueVariable])
      : Number(row[valueVariable])

    if (isNaN(value)) return

    if (!grouped.has(category)) {
      grouped.set(category, new Map())
    }
    const categoryMap = grouped.get(category)!

    if (!categoryMap.has(group)) {
      categoryMap.set(group, [])
    }
    categoryMap.get(group)!.push(value)
  })

  // Calculate means for each category-group combination
  const result: GroupedBarData[] = []

  grouped.forEach((groupMap, category) => {
    const item: GroupedBarData = { category }

    groupMap.forEach((values, group) => {
      const mean = values.reduce((a, b) => a + b, 0) / values.length
      item[group] = mean
    })

    result.push(item)
  })

  return result
}

/**
 * Get unique groups from a variable
 */
export function getUniqueGroups(rows: DataRow[], variable: string): string[] {
  const groups = new Set<string>()

  rows.forEach(row => {
    const value = row[variable]
    if (value !== null && value !== undefined && value !== '') {
      groups.add(String(value))
    }
  })

  return Array.from(groups).sort()
}

/**
 * Color palettes for charts
 */
export const CHART_COLORS = {
  primary: '#3498db',
  secondary: '#2ecc71',
  accent: '#e74c3c',
  warning: '#f39c12',
  info: '#9b59b6',
  palette: [
    '#3498db', '#2ecc71', '#e74c3c', '#f39c12', '#9b59b6',
    '#1abc9c', '#34495e', '#e67e22', '#95a5a6', '#d35400'
  ]
}
