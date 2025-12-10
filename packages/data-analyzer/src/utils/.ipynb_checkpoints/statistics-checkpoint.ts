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
  normalityTest: NormalityTestResult | null
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
 * Jarque-Bera test for normality
 * Uses skewness and kurtosis to test if data comes from a normal distribution
 * More reliable than Shapiro-Wilk for implementation purposes
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
  // JB = (n/6) * (S^2 + (K-3)^2/4)
  // where S is skewness and K is kurtosis
  const JB = (n / 6) * (Math.pow(skewness, 2) + Math.pow(kurtosis - 3, 2) / 4)

  // Calculate p-value using chi-square distribution with 2 degrees of freedom
  const pValue = 1 - chiSquareCDF(JB, 2)

  return {
    testName: 'Jarque-Bera',
    statistic: JB,
    pValue: Math.max(0, Math.min(1, pValue)), // Clamp between 0 and 1
    isNormal: pValue > 0.05
  }
}

/**
 * Chi-square cumulative distribution function
 * Uses lower incomplete gamma function approximation
 */
function chiSquareCDF(x: number, df: number): number {
  if (x <= 0) return 0
  if (x === Infinity) return 1

  // Chi-square CDF is the regularized gamma function: P(df/2, x/2)
  return lowerIncompleteGamma(df / 2, x / 2) / gamma(df / 2)
}

/**
 * Gamma function approximation using Lanczos approximation
 */
function gamma(z: number): number {
  // Lanczos approximation constants
  const g = 7
  const coef = [
    0.99999999999980993,
    676.5203681218851,
    -1259.1392167224028,
    771.32342877765313,
    -176.61502916214059,
    12.507343278686905,
    -0.13857109526572012,
    9.9843695780195716e-6,
    1.5056327351493116e-7
  ]

  if (z < 0.5) {
    return Math.PI / (Math.sin(Math.PI * z) * gamma(1 - z))
  }

  z -= 1
  let x = coef[0]
  for (let i = 1; i < g + 2; i++) {
    x += coef[i] / (z + i)
  }

  const t = z + g + 0.5
  return Math.sqrt(2 * Math.PI) * Math.pow(t, z + 0.5) * Math.exp(-t) * x
}

/**
 * Lower incomplete gamma function
 * Using series expansion for small x, continued fraction for large x
 */
function lowerIncompleteGamma(s: number, x: number): number {
  if (x <= 0) return 0
  if (x < s + 1) {
    // Use series expansion
    let sum = 1 / s
    let term = 1 / s
    for (let n = 1; n < 100; n++) {
      term *= x / (s + n)
      sum += term
      if (Math.abs(term) < 1e-10 * Math.abs(sum)) break
    }
    return Math.pow(x, s) * Math.exp(-x) * sum
  } else {
    // Use continued fraction (via upper incomplete gamma)
    const upperGamma = upperIncompleteGamma(s, x)
    return gamma(s) - upperGamma
  }
}

/**
 * Upper incomplete gamma function using continued fraction
 */
function upperIncompleteGamma(s: number, x: number): number {
  const maxIterations = 100
  const epsilon = 1e-10

  let a = 1 - s
  let b = a + x + 1
  let term = 0
  let pn = [0, 1]
  let qn = [1, x]

  let result = pn[1] / qn[1]

  for (let n = 1; n < maxIterations; n++) {
    a += 1
    b += 2
    term += 1

    const an = term * (s - term)
    pn.push(b * pn[1] - an * pn[0])
    qn.push(b * qn[1] - an * qn[0])

    if (Math.abs(qn[2]) > 1e-30) {
      const newResult = pn[2] / qn[2]
      if (Math.abs((newResult - result) / result) < epsilon) {
        return Math.pow(x, s) * Math.exp(-x) * newResult
      }
      result = newResult
    }

    // Shift for next iteration
    pn = [pn[1], pn[2]]
    qn = [qn[1], qn[2]]

    // Renormalize to prevent overflow
    if (Math.abs(pn[1]) > 1e30) {
      pn = [pn[0] / 1e30, pn[1] / 1e30]
      qn = [qn[0] / 1e30, qn[1] / 1e30]
    }
  }

  return Math.pow(x, s) * Math.exp(-x) * result
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
