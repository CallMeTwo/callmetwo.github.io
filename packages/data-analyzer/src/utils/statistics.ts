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
  shapiro: ShapiroResult | null
}

export interface CategoricalStats {
  count: number
  missing: number
  uniqueCount: number
  frequencies: FrequencyItem[]
  mode: string | number
}

export interface FrequencyItem {
  value: string | number
  count: number
  percentage: number
}

export interface ShapiroResult {
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
      shapiro: null
    }
  }

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
    skewness: numericValues.length >= 3 ? sampleSkewness(numericValues) : NaN,
    kurtosis: numericValues.length >= 4 ? sampleKurtosis(numericValues) : NaN,
    shapiro: numericValues.length >= 3 ? calculateShapiroWilk(numericValues) : null
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
 * Shapiro-Wilk test for normality
 * Simplified implementation for sample sizes 3-5000
 */
function calculateShapiroWilk(data: number[]): ShapiroResult | null {
  const n = data.length

  // Shapiro-Wilk test requires at least 3 observations and at most 5000
  if (n < 3 || n > 5000) {
    return null
  }

  // Sort the data
  const sorted = [...data].sort((a, b) => a - b)

  // Calculate mean
  const dataMean = mean(sorted)

  // Calculate coefficients (simplified for small samples)
  const coefficients = calculateShapiroCoefficients(n)

  // Calculate W statistic
  let numerator = 0
  const k = Math.floor(n / 2)

  for (let i = 0; i < k; i++) {
    numerator += coefficients[i] * (sorted[n - 1 - i] - sorted[i])
  }

  numerator = numerator * numerator

  // Calculate denominator (sum of squared deviations)
  const denominator = sorted.reduce((sum, value) => {
    return sum + Math.pow(value - dataMean, 2)
  }, 0)

  const W = numerator / denominator

  // Approximate p-value using polynomial approximation
  const pValue = approximateShapiroPValue(W, n)

  return {
    statistic: W,
    pValue,
    isNormal: pValue > 0.05
  }
}

/**
 * Calculate Shapiro-Wilk coefficients (simplified)
 */
function calculateShapiroCoefficients(n: number): number[] {
  const coefficients: number[] = []
  const k = Math.floor(n / 2)

  // Simplified coefficients calculation
  // In a full implementation, these would be looked up from tables
  for (let i = 0; i < k; i++) {
    const m = (i + 1) / (n + 1)
    // Approximate normal quantile
    const z = approximateNormalQuantile(m)
    coefficients.push(z)
  }

  // Normalize coefficients
  const sumSquared = coefficients.reduce((sum, c) => sum + c * c, 0)
  const normalizer = Math.sqrt(sumSquared)

  return coefficients.map(c => c / normalizer)
}

/**
 * Approximate normal quantile function
 */
function approximateNormalQuantile(p: number): number {
  // Beasley-Springer-Moro algorithm (simplified)
  const a0 = 2.50662823884
  const a1 = -18.61500062529
  const a2 = 41.39119773534
  const a3 = -25.44106049637

  const b1 = -8.47351093090
  const b2 = 23.08336743743
  const b3 = -21.06224101826
  const b4 = 3.13082909833

  const c0 = 0.3374754822726147
  const c1 = 0.9761690190917186
  const c2 = 0.1607979714918209
  const c3 = 0.0276438810333863
  const c4 = 0.0038405729373609
  const c5 = 0.0003951896511919
  const c6 = 0.0000321767881768
  const c7 = 0.0000002888167364
  const c8 = 0.0000003960315187

  const y = p - 0.5

  if (Math.abs(y) < 0.42) {
    const r = y * y
    return y * (((a3 * r + a2) * r + a1) * r + a0) /
      ((((b4 * r + b3) * r + b2) * r + b1) * r + 1)
  }

  let r = p
  if (y > 0) r = 1 - p

  r = Math.log(-Math.log(r))
  const x = c0 + r * (c1 + r * (c2 + r * (c3 + r * (c4 + r * (c5 + r * (c6 + r * (c7 + r * c8)))))))

  return y < 0 ? -x : x
}

/**
 * Approximate p-value for Shapiro-Wilk test
 */
function approximateShapiroPValue(W: number, n: number): number {
  // Polynomial approximation of p-value
  // This is a simplified approximation
  const logW = Math.log(1 - W)
  const logN = Math.log(n)

  // Coefficients for polynomial approximation
  const mu = -1.5861 - 0.31082 * logN - 0.083751 * logN * logN + 0.0038915 * logN * logN * logN
  const sigma = Math.exp(-0.4803 - 0.082676 * logN + 0.0030302 * logN * logN)

  const z = (logW - mu) / sigma

  // Convert to p-value using standard normal CDF
  return normalCDF(z)
}

/**
 * Standard normal cumulative distribution function
 */
function normalCDF(x: number): number {
  const t = 1 / (1 + 0.2316419 * Math.abs(x))
  const d = 0.3989423 * Math.exp(-x * x / 2)
  const p = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))))

  return x > 0 ? 1 - p : p
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
