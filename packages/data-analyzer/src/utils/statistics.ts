import {
  mean,
  median,
  standardDeviation,
  min,
  max,
  quantile,
  sampleSkewness,
  sampleKurtosis
} from 'simple-statistics'
import jStat from 'jstat'

export interface ContinuousStats {
  count: number
  missing: number
  mean: number
  median: number
  sd: number
  min: number
  max: number
  q1: number
  q3: number
  skewness: number
  kurtosis: number
  normalityTest: NormalityTestResult | null
}

export interface CategoricalStats {
  count: number
  missing: number
  uniqueCount: number
  frequencies: FrequencyItem[]
  mode: string | number
}

export interface DateStats {
  count: number
  missing: number
  min: Date | null
  max: Date | null
  mode: Date | null
}

export interface FrequencyItem {
  value: string | number
  count: number
  percentage: number
}

export interface NormalityTestResult {
  testName: string
  statistic: number
  pValue: number
  isNormal: boolean // p > 0.05 indicates normality
}

/**
 * Calculate comprehensive statistics for continuous (numeric) variables
 */
export function calculateContinuousStats(values: (number | string | null)[]): ContinuousStats {
  // Filter out missing values and convert to numbers
  const numericValues = values
    .filter(v => v !== null && v !== undefined && v !== '')
    .map(v => typeof v === 'string' ? parseFloat(v) : v)
    .filter(v => !isNaN(v)) as number[]

  const missing = values.length - numericValues.length

  if (numericValues.length === 0) {
    return {
      count: 0,
      missing,
      mean: NaN,
      median: NaN,
      sd: NaN,
      min: NaN,
      max: NaN,
      q1: NaN,
      q3: NaN,
      skewness: NaN,
      kurtosis: NaN,
      normalityTest: null
    }
  }

  const skew = numericValues.length >= 3 ? sampleSkewness(numericValues) : NaN
  const kurt = numericValues.length >= 4 ? sampleKurtosis(numericValues) : NaN

  return {
    count: numericValues.length,
    missing,
    mean: mean(numericValues),
    median: median(numericValues),
    sd: standardDeviation(numericValues),
    min: min(numericValues),
    max: max(numericValues),
    q1: quantile(numericValues, 0.25),
    q3: quantile(numericValues, 0.75),
    skewness: skew,
    kurtosis: kurt,
    normalityTest: numericValues.length >= 8 ? calculateJarqueBera(numericValues, skew, kurt) : null
  }
}

/**
 * Calculate frequency distribution for categorical variables
 */
export function calculateCategoricalStats(values: (string | number | null)[]): CategoricalStats {
  // Filter out missing values
  const validValues = values.filter(v => v !== null && v !== undefined && v !== '')
  const missing = values.length - validValues.length

  if (validValues.length === 0) {
    return {
      count: 0,
      missing,
      uniqueCount: 0,
      frequencies: [],
      mode: ''
    }
  }

  // Count frequencies
  const frequencyMap = new Map<string | number, number>()
  validValues.forEach(value => {
    const count = frequencyMap.get(value) || 0
    frequencyMap.set(value, count + 1)
  })

  // Convert to array and sort by count (descending)
  const frequencies: FrequencyItem[] = Array.from(frequencyMap.entries())
    .map(([value, count]) => ({
      value,
      count,
      percentage: (count / validValues.length) * 100
    }))
    .sort((a, b) => b.count - a.count)

  return {
    count: validValues.length,
    missing,
    uniqueCount: frequencyMap.size,
    frequencies,
    mode: frequencies[0]?.value || ''
  }
}

/**
 * Jarque-Bera test for normality using jStat
 * Uses skewness and kurtosis to test if data comes from a normal distribution
 */
function calculateJarqueBera(data: number[], skewness: number, kurtosis: number): NormalityTestResult {
  const n = data.length

  // Jarque-Bera test requires at least 8 observations
  if (n < 8) {
    return {
      testName: 'Jarque-Bera',
      statistic: NaN,
      pValue: NaN,
      isNormal: false
    }
  }

  // Handle invalid skewness or kurtosis
  if (!isFinite(skewness) || !isFinite(kurtosis) || isNaN(skewness) || isNaN(kurtosis)) {
    return {
      testName: 'Jarque-Bera',
      statistic: NaN,
      pValue: NaN,
      isNormal: false
    }
  }

  // Calculate Jarque-Bera statistic
  // JB = (n/6) * (S^2 + ((K-3)^2)/4)
  // where S is skewness and K is excess kurtosis
  const JB = (n / 6) * (Math.pow(skewness, 2) + Math.pow(kurtosis, 2) / 4)

  // Calculate p-value using chi-square distribution with 2 degrees of freedom
  // Use jStat's chi-square CDF (complement)
  const pValue = 1 - jStat.chisquare.cdf(JB, 2)

  return {
    testName: 'Jarque-Bera',
    statistic: JB,
    pValue: Math.max(0, Math.min(1, pValue)), // Clamp between 0 and 1
    isNormal: pValue > 0.05
  }
}

/**
 * Format number for display
 */
export function formatStatistic(value: number, decimals: number = 2): string {
  if (isNaN(value) || !isFinite(value)) {
    return 'N/A'
  }
  return value.toFixed(decimals)
}

/**
 * Interpret skewness value
 */
export function interpretSkewness(skewness: number): string {
  if (isNaN(skewness)) return 'N/A'
  if (skewness > 1) return 'Highly right-skewed'
  if (skewness > 0.5) return 'Moderately right-skewed'
  if (skewness > -0.5) return 'Approximately symmetric'
  if (skewness > -1) return 'Moderately left-skewed'
  return 'Highly left-skewed'
}

/**
 * Interpret kurtosis value
 */
export function interpretKurtosis(kurtosis: number): string {
  if (isNaN(kurtosis)) return 'N/A'
  if (kurtosis > 3) return 'Heavy-tailed (leptokurtic)'
  if (kurtosis < -3) return 'Light-tailed (platykurtic)'
  return 'Normal-tailed (mesokurtic)'
}

/**
 * Calculate statistics for date/datetime variables
 * Note: Works with UTC timestamps to avoid timezone-related issues
 */
export function calculateDateStats(values: (string | null)[]): DateStats {
  // Parse dates and filter out invalid values
  const validDates = values
    .filter(v => v !== null && v !== undefined && v !== '')
    .map(v => new Date(String(v)))
    .filter(d => !isNaN(d.getTime()))

  const missing = values.length - validDates.length

  if (validDates.length === 0) {
    return {
      count: 0,
      missing,
      min: null,
      max: null,
      mode: null
    }
  }

  // Find min and max dates using timestamps (timezone-agnostic)
  const timestamps = validDates.map(d => d.getTime())
  const minTimestamp = Math.min(...timestamps)
  const maxTimestamp = Math.max(...timestamps)

  // Find mode (most frequent date) - group by date component only
  // Normalize to UTC midnight to group same dates together
  const dateMap = new Map<string, number>()
  let maxCount = 0
  let modeKey = ''

  validDates.forEach(d => {
    // Use UTC date string as key to avoid timezone shifts
    const key = d.toISOString().split('T')[0] // YYYY-MM-DD in UTC
    const count = (dateMap.get(key) || 0) + 1
    dateMap.set(key, count)
    if (count > maxCount) {
      maxCount = count
      modeKey = key
    }
  })

  return {
    count: validDates.length,
    missing,
    min: new Date(minTimestamp),
    max: new Date(maxTimestamp),
    mode: modeKey ? new Date(modeKey + 'T00:00:00Z') : null
  }
}

/**
 * Floor a date to a specific unit (year, month, week, day)
 * Uses UTC methods to avoid timezone-related date shifts
 */
export function floorDate(
  date: Date,
  unit: 'year' | 'month' | 'week' | 'day'
): Date {
  const d = new Date(date)

  switch (unit) {
    case 'year':
      // January 1st of the year (UTC)
      d.setUTCMonth(0)
      d.setUTCDate(1)
      d.setUTCHours(0, 0, 0, 0)
      break

    case 'month':
      // First day of the month (UTC)
      d.setUTCDate(1)
      d.setUTCHours(0, 0, 0, 0)
      break

    case 'week':
      // Monday of the week (UTC)
      const day = d.getUTCDay()
      const diff = d.getUTCDate() - day + (day === 0 ? -6 : 1) // Adjust when day is Sunday
      d.setUTCDate(diff)
      d.setUTCHours(0, 0, 0, 0)
      break

    case 'day':
      // Midnight UTC
      d.setUTCHours(0, 0, 0, 0)
      break
  }

  return d
}
