// Shared utilities, components, and theme

export const formatNumber = (num: number): string => {
  return num.toLocaleString('en-US', { maximumFractionDigits: 2 })
}

interface Stats {
  mean: number
  median: number
  min: number
  max: number
}

export const calculateStats = (data: number[]): Stats | null => {
  if (!data || data.length === 0) return null

  const sorted = [...data].sort((a, b) => a - b)
  const sum = data.reduce((a, b) => a + b, 0)
  const mean = sum / data.length
  const median = sorted[Math.floor(sorted.length / 2)]
  const min = Math.min(...data)
  const max = Math.max(...data)

  return { mean, median, min, max }
}

// Export theme and hooks
export { theme, colors, typography, spacing, borderRadius, transitions, zIndex } from './theme'
export { useTheme, ThemeProvider } from './hooks/useTheme'

// Export components
export { Navbar } from './components'
