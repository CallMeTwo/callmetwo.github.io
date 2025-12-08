// Shared utilities and components can be exported here
export const formatNumber = (num) => {
  return num.toLocaleString('en-US', { maximumFractionDigits: 2 })
}

export const calculateStats = (data) => {
  if (!data || data.length === 0) return null

  const sorted = [...data].sort((a, b) => a - b)
  const sum = data.reduce((a, b) => a + b, 0)
  const mean = sum / data.length
  const median = sorted[Math.floor(sorted.length / 2)]
  const min = Math.min(...data)
  const max = Math.max(...data)

  return { mean, median, min, max }
}
