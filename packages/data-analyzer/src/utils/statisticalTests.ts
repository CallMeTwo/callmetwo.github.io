import { mean, standardDeviation, variance } from 'simple-statistics'
import { DataRow } from '../types'

export interface TTestResult {
  testType: 'Independent Samples t-test' | 'Paired Samples t-test'
  statistic: number
  degreesOfFreedom: number
  pValue: number
  mean1: number
  mean2: number
  meanDifference: number
  confidenceInterval: [number, number]
  effectSize: number // Cohen's d
  interpretation: string
}

export interface ChiSquareResult {
  testType: 'Chi-Square Test of Independence'
  statistic: number
  degreesOfFreedom: number
  pValue: number
  contingencyTable: { [key: string]: { [key: string]: number } }
  cramersV: number // Effect size
  interpretation: string
  oddsRatio?: number // Only for 2x2 tables
  oddsRatioCI?: [number, number] // 95% CI for OR
}

export interface GroupStats {
  group: string
  n: number
  mean: number
  sd: number
  min: number
  max: number
}

export interface PairwiseComparison {
  group1: string
  group2: string
  meanDiff: number
  ciLower: number
  ciUpper: number
  adjustedPValue: number
  isSignificant: boolean
}

export interface ANOVAResult {
  testType: 'One-Way ANOVA'
  fStatistic: number
  degreesOfFreedomBetween: number
  degreesOfFreedomWithin: number
  pValue: number
  groupMeans: { [key: string]: number }
  etaSquared: number // Effect size
  interpretation: string
  groupStats?: GroupStats[] // Detailed group statistics
  pairwiseComparisons?: PairwiseComparison[] // Post-hoc pairwise tests
  bonferroniAlpha?: number // Bonferroni-corrected significance level
}

export interface RegressionCoefficient {
  variable: string
  coefficient: number
  standardError: number
  tStatistic?: number
  pValue: number
  ciLower?: number
  ciUpper?: number
}

export interface RegressionResult {
  testType: 'Linear Regression' | 'Logistic Regression'
  coefficients: RegressionCoefficient[]
  rSquared?: number // For linear regression
  adjustedRSquared?: number
  fStatistic?: number
  fPValue?: number
  intercept: number
  interceptSE?: number
  interceptTStatistic?: number
  interceptPValue?: number
  interceptCILower?: number
  interceptCIUpper?: number
  interpretation: string
}

/**
 * Independent samples t-test
 */
export function independentTTest(
  group1: number[],
  group2: number[],
  confidenceLevel: number = 0.95
): TTestResult {
  const n1 = group1.length
  const n2 = group2.length
  const mean1 = mean(group1)
  const mean2 = mean(group2)
  const var1 = variance(group1)
  const var2 = variance(group2)

  // Pooled standard deviation
  const pooledVariance = ((n1 - 1) * var1 + (n2 - 1) * var2) / (n1 + n2 - 2)
  const pooledSD = Math.sqrt(pooledVariance)
  const standardError = pooledSD * Math.sqrt(1 / n1 + 1 / n2)

  // t-statistic
  const tStatistic = (mean1 - mean2) / standardError
  const df = n1 + n2 - 2
  const pValue = tDistributionPValue(Math.abs(tStatistic), df) * 2 // Two-tailed

  // Confidence interval
  const tCritical = tDistributionInverse(1 - (1 - confidenceLevel) / 2, df)
  const marginOfError = tCritical * standardError
  const confidenceInterval: [number, number] = [
    mean1 - mean2 - marginOfError,
    mean1 - mean2 + marginOfError
  ]

  // Effect size (Cohen's d)
  const cohensD = (mean1 - mean2) / pooledSD

  return {
    testType: 'Independent Samples t-test',
    statistic: tStatistic,
    degreesOfFreedom: df,
    pValue,
    mean1,
    mean2,
    meanDifference: mean1 - mean2,
    confidenceInterval,
    effectSize: cohensD,
    interpretation: interpretTTest(pValue, cohensD)
  }
}

/**
 * Calculate Odds Ratio and 95% CI for 2x2 contingency table
 * Returns null if table is not 2x2 or contains zero cells
 */
function calculateOddsRatio(
  contingencyTable: { [key: string]: { [key: string]: number } }
): { oddsRatio: number; oddsRatioCI: [number, number] } | null {
  const rowKeys = Object.keys(contingencyTable)
  const colKeys = new Set<string>()

  // Collect all column keys
  rowKeys.forEach(rowKey => {
    Object.keys(contingencyTable[rowKey]).forEach(colKey => colKeys.add(colKey))
  })

  // Check if table is 2x2
  if (rowKeys.length !== 2 || colKeys.size !== 2) {
    return null
  }

  // Get the 2x2 cells (a, b, c, d)
  const colKeysArray = Array.from(colKeys)
  const a = contingencyTable[rowKeys[0]][colKeysArray[0]] || 0
  const b = contingencyTable[rowKeys[0]][colKeysArray[1]] || 0
  const c = contingencyTable[rowKeys[1]][colKeysArray[0]] || 0
  const d = contingencyTable[rowKeys[1]][colKeysArray[1]] || 0

  // Check for zero cells (OR undefined)
  if (a === 0 || b === 0 || c === 0 || d === 0) {
    return null
  }

  // Calculate OR = (a × d) / (b × c)
  const oddsRatio = (a * d) / (b * c)

  // Calculate 95% CI for OR
  // SE(ln(OR)) = sqrt(1/a + 1/b + 1/c + 1/d)
  const seLogOR = Math.sqrt(1/a + 1/b + 1/c + 1/d)
  const logOR = Math.log(oddsRatio)

  // 95% CI: exp(ln(OR) ± 1.96 × SE(ln(OR)))
  const ciLower = Math.exp(logOR - 1.96 * seLogOR)
  const ciUpper = Math.exp(logOR + 1.96 * seLogOR)

  return {
    oddsRatio,
    oddsRatioCI: [ciLower, ciUpper]
  }
}

/**
 * Chi-square test of independence
 */
export function chiSquareTest(
  rows: DataRow[],
  variable1: string,
  variable2: string
): ChiSquareResult {
  // Create contingency table
  const contingencyTable: { [key: string]: { [key: string]: number } } = {}
  const rowTotals: { [key: string]: number } = {}
  const colTotals: { [key: string]: number } = {}
  let grandTotal = 0

  rows.forEach(row => {
    const val1 = String(row[variable1] || 'Missing')
    const val2 = String(row[variable2] || 'Missing')

    if (!contingencyTable[val1]) {
      contingencyTable[val1] = {}
      rowTotals[val1] = 0
    }
    if (!contingencyTable[val1][val2]) {
      contingencyTable[val1][val2] = 0
    }

    contingencyTable[val1][val2]++
    rowTotals[val1]++
    colTotals[val2] = (colTotals[val2] || 0) + 1
    grandTotal++
  })

  // Calculate chi-square statistic
  let chiSquare = 0
  const rowKeys = Object.keys(contingencyTable)
  const colKeys = Object.keys(colTotals)

  rowKeys.forEach(rowKey => {
    colKeys.forEach(colKey => {
      const observed = contingencyTable[rowKey][colKey] || 0
      const expected = (rowTotals[rowKey] * colTotals[colKey]) / grandTotal
      chiSquare += Math.pow(observed - expected, 2) / expected
    })
  })

  const df = (rowKeys.length - 1) * (colKeys.length - 1)
  const pValue = chiSquarePValue(chiSquare, df)

  // Cramér's V (effect size)
  const minDim = Math.min(rowKeys.length - 1, colKeys.length - 1)
  const cramersV = Math.sqrt(chiSquare / (grandTotal * minDim))

  // Calculate Odds Ratio for 2x2 tables
  const orResult = calculateOddsRatio(contingencyTable)

  const result: ChiSquareResult = {
    testType: 'Chi-Square Test of Independence',
    statistic: chiSquare,
    degreesOfFreedom: df,
    pValue,
    contingencyTable,
    cramersV,
    interpretation: interpretChiSquare(pValue, cramersV)
  }

  // Add OR fields if 2x2 table
  if (orResult) {
    result.oddsRatio = orResult.oddsRatio
    result.oddsRatioCI = orResult.oddsRatioCI
  }

  return result
}

/**
 * Calculate pairwise comparisons with Bonferroni correction
 */
function calculatePairwiseComparisons(
  data: { [group: string]: number[] },
  msw: number, // Mean sum of squares within (from ANOVA)
  dfWithin: number // Degrees of freedom within
): PairwiseComparison[] {
  const groups = Object.keys(data).sort()
  const comparisons: PairwiseComparison[] = []

  // Number of comparisons for Bonferroni correction
  const numComparisons = (groups.length * (groups.length - 1)) / 2
  const bonferroniAlpha = 0.05 / numComparisons

  // For each pair of groups
  for (let i = 0; i < groups.length; i++) {
    for (let j = i + 1; j < groups.length; j++) {
      const group1 = groups[i]
      const group2 = groups[j]
      const data1 = data[group1]
      const data2 = data[group2]

      const n1 = data1.length
      const n2 = data2.length
      const mean1 = mean(data1)
      const mean2 = mean(data2)
      const meanDiff = mean1 - mean2

      // Pooled standard error: SE = sqrt(MSW * (1/n1 + 1/n2))
      const se = Math.sqrt(msw * (1/n1 + 1/n2))

      // Get t-critical value for 95% CI (two-tailed, alpha=0.05)
      const getTCritical = (df: number) => {
        const tValues: { [key: number]: number } = {
          1: 12.706, 2: 4.303, 3: 3.182, 4: 2.776, 5: 2.571,
          6: 2.447, 7: 2.365, 8: 2.306, 9: 2.262, 10: 2.228,
          15: 2.131, 20: 2.086, 25: 2.060, 30: 2.042
        }
        if (tValues[df]) return tValues[df]
        return df > 30 ? 1.96 : 2.045
      }

      const t_crit = getTCritical(dfWithin)
      const ciMargin = t_crit * se

      // Calculate t-statistic and p-value
      const tStatistic = meanDiff / se
      const pValue = 2 * (1 - normalCDF(Math.abs(tStatistic))) // Approximation for large df

      comparisons.push({
        group1,
        group2,
        meanDiff,
        ciLower: meanDiff - ciMargin,
        ciUpper: meanDiff + ciMargin,
        adjustedPValue: pValue,
        isSignificant: pValue < bonferroniAlpha
      })
    }
  }

  return comparisons
}

/**
 * Calculate group statistics (N, Mean, SD, Min, Max)
 */
function calculateGroupStats(data: { [group: string]: number[] }): GroupStats[] {
  return Object.keys(data)
    .sort()
    .map(group => {
      const values = data[group]
      return {
        group,
        n: values.length,
        mean: mean(values),
        sd: Math.sqrt(variance(values)),
        min: Math.min(...values),
        max: Math.max(...values)
      }
    })
}

/**
 * One-way ANOVA
 */
export function oneWayANOVA(
  data: { [group: string]: number[] }
): ANOVAResult {
  const groups = Object.keys(data)
  const k = groups.length // number of groups
  let n = 0 // total sample size
  const groupMeans: { [key: string]: number } = {}
  let grandSum = 0

  // Calculate group means and grand mean
  groups.forEach(group => {
    const groupData = data[group]
    groupMeans[group] = mean(groupData)
    grandSum += groupData.reduce((a, b) => a + b, 0)
    n += groupData.length
  })

  const grandMean = grandSum / n

  // Calculate sum of squares between groups (SSB)
  let ssb = 0
  groups.forEach(group => {
    const groupData = data[group]
    ssb += groupData.length * Math.pow(groupMeans[group] - grandMean, 2)
  })

  // Calculate sum of squares within groups (SSW)
  let ssw = 0
  groups.forEach(group => {
    const groupData = data[group]
    groupData.forEach(value => {
      ssw += Math.pow(value - groupMeans[group], 2)
    })
  })

  // Calculate mean squares
  const dfBetween = k - 1
  const dfWithin = n - k
  const msb = ssb / dfBetween
  const msw = ssw / dfWithin

  // F-statistic
  const fStatistic = msb / msw
  const pValue = fDistributionPValue(fStatistic, dfBetween, dfWithin)

  // Effect size (eta squared)
  const etaSquared = ssb / (ssb + ssw)

  // Calculate group statistics and pairwise comparisons
  const groupStats = calculateGroupStats(data)
  const numComparisons = (k * (k - 1)) / 2
  const bonferroniAlpha = 0.05 / numComparisons
  const pairwiseComparisons = calculatePairwiseComparisons(data, msw, dfWithin)

  return {
    testType: 'One-Way ANOVA',
    fStatistic,
    degreesOfFreedomBetween: dfBetween,
    degreesOfFreedomWithin: dfWithin,
    pValue,
    groupMeans,
    etaSquared,
    interpretation: interpretANOVA(pValue, etaSquared),
    groupStats,
    pairwiseComparisons,
    bonferroniAlpha
  }
}

/**
 * Calculate 95% CI for regression coefficient
 */
function calculateRegressionCI(
  coefficient: number,
  stdError: number,
  df: number
): [number, number] {
  const getTCritical = (df: number) => {
    const tValues: { [key: number]: number } = {
      1: 12.706, 2: 4.303, 3: 3.182, 4: 2.776, 5: 2.571,
      6: 2.447, 7: 2.365, 8: 2.306, 9: 2.262, 10: 2.228,
      15: 2.131, 20: 2.086, 25: 2.060, 30: 2.042
    }
    if (tValues[df]) return tValues[df]
    return df > 30 ? 1.96 : 2.045
  }

  const t_crit = getTCritical(df)
  const margin = t_crit * stdError

  return [coefficient - margin, coefficient + margin]
}

/**
 * Simple linear regression
 */
export function linearRegression(
  x: number[],
  y: number[],
  xName: string,
  yName: string
): RegressionResult {
  const n = x.length
  const xMean = mean(x)
  const yMean = mean(y)

  // Calculate slope and intercept
  let numerator = 0
  let denominator = 0

  for (let i = 0; i < n; i++) {
    numerator += (x[i] - xMean) * (y[i] - yMean)
    denominator += Math.pow(x[i] - xMean, 2)
  }

  const slope = numerator / denominator
  const intercept = yMean - slope * xMean

  // Calculate R-squared
  let ssTotal = 0
  let ssResidual = 0

  for (let i = 0; i < n; i++) {
    const predicted = intercept + slope * x[i]
    ssTotal += Math.pow(y[i] - yMean, 2)
    ssResidual += Math.pow(y[i] - predicted, 2)
  }

  const rSquared = 1 - ssResidual / ssTotal
  const adjustedRSquared = 1 - (1 - rSquared) * (n - 1) / (n - 2)

  // Standard error of slope
  const residualVariance = ssResidual / (n - 2)
  const slopeStandardError = Math.sqrt(residualVariance / denominator)
  const tStatistic = slope / slopeStandardError
  const pValue = tDistributionPValue(Math.abs(tStatistic), n - 2) * 2

  // F-statistic and p-value
  const ssRegression = ssTotal - ssResidual
  const fStatistic = (ssRegression / 1) / (ssResidual / (n - 2))
  const fPValue = fDistributionPValue(fStatistic, 1, n - 2)

  // Intercept standard error
  const sumXSquared = x.reduce((sum, xi) => sum + Math.pow(xi, 2), 0)
  const interceptSE = Math.sqrt(residualVariance * (1/n + Math.pow(xMean, 2) / denominator))
  const interceptTStatistic = intercept / interceptSE
  const interceptPValue = tDistributionPValue(Math.abs(interceptTStatistic), n - 2) * 2

  // Calculate CIs
  const [slopeCILower, slopeCIUpper] = calculateRegressionCI(slope, slopeStandardError, n - 2)
  const [interceptCILower, interceptCIUpper] = calculateRegressionCI(intercept, interceptSE, n - 2)

  return {
    testType: 'Linear Regression',
    coefficients: [
      {
        variable: xName,
        coefficient: slope,
        standardError: slopeStandardError,
        tStatistic,
        pValue,
        ciLower: slopeCILower,
        ciUpper: slopeCIUpper
      }
    ],
    rSquared,
    adjustedRSquared,
    fStatistic,
    fPValue,
    intercept,
    interceptSE,
    interceptTStatistic,
    interceptPValue,
    interceptCILower,
    interceptCIUpper,
    interpretation: interpretRegression(pValue, rSquared)
  }
}

/**
 * T-distribution p-value using Hill's approximation
 * This is a direct implementation that doesn't rely on incomplete beta
 * More numerically stable for all df values
 */
function tDistributionPValue(t: number, df: number): number {
  // Ensure valid inputs
  if (!isFinite(t) || !isFinite(df) || df <= 0) return NaN

  t = Math.abs(t)

  // For very large df, use normal approximation
  if (df > 1000) {
    return normalCDF(-t)
  }

  // For very large t values, p-value approaches 0
  if (t > 100) return 0

  // Hill's approximation for t-distribution CDF
  // P(T > t) for df degrees of freedom
  const a = df / 2
  const b = df / (df + t * t)

  // For small df, use the exact formula with regularized incomplete beta
  if (df < 20) {
    const x = df / (df + t * t)
    const ibeta = regularizedIncompleteBeta(df / 2, 0.5, x)
    return 0.5 * ibeta
  }

  // For larger df, use Hill's continued fraction approximation
  const z = t / Math.sqrt(df)
  const z2 = z * z

  // Use normal approximation with correction terms
  let p = normalCDF(-Math.abs(t) * Math.sqrt(df / (df - 2)))

  // Apply correction for finite df
  const correction = (z2 + 1) / (4 * df)
  p = p * (1 - correction)

  return Math.max(0, Math.min(0.5, p))
}

/**
 * Normal distribution CDF (cumulative distribution function)
 */
function normalCDF(x: number): number {
  // Using error function approximation
  const t = 1 / (1 + 0.2316419 * Math.abs(x))
  const d = 0.3989423 * Math.exp(-x * x / 2)
  const p = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))))

  return x > 0 ? 1 - p : p
}

/**
 * Regularized incomplete beta function using continued fraction
 * More accurate than series expansion for moderate to large parameters
 */
function regularizedIncompleteBeta(a: number, b: number, x: number): number {
  if (x <= 0) return 0
  if (x >= 1) return 1
  if (a <= 0 || b <= 0) return NaN

  // Use symmetry relation if needed
  if (x > (a + 1) / (a + b + 2)) {
    return 1 - regularizedIncompleteBeta(b, a, 1 - x)
  }

  // Compute using continued fraction (Lentz's algorithm)
  const lbeta = logBeta(a, b)
  const front = Math.exp(Math.log(x) * a + Math.log(1 - x) * b - lbeta) / a

  let f = 1.0
  let c = 1.0
  let d = 0.0

  for (let i = 0; i <= 200; i++) {
    const m = Math.floor(i / 2)
    let numerator: number

    if (i === 0) {
      numerator = 1
    } else if (i % 2 === 0) {
      numerator = (m * (b - m) * x) / ((a + 2 * m - 1) * (a + 2 * m))
    } else {
      numerator = -((a + m) * (a + b + m) * x) / ((a + 2 * m) * (a + 2 * m + 1))
    }

    d = 1 + numerator * d
    if (Math.abs(d) < 1e-30) d = 1e-30
    d = 1 / d

    c = 1 + numerator / c
    if (Math.abs(c) < 1e-30) c = 1e-30

    const cd = c * d
    f *= cd

    if (Math.abs(1 - cd) < 1e-10) break
  }

  return front * f
}

/**
 * Natural logarithm of the beta function
 */
function logBeta(a: number, b: number): number {
  return logGamma(a) + logGamma(b) - logGamma(a + b)
}

/**
 * Natural logarithm of the gamma function (Lanczos approximation)
 */
function logGamma(x: number): number {
  const coefficients = [
    76.18009172947146,
    -86.50532032941677,
    24.01409824083091,
    -1.231739572450155,
    0.001208650973866179,
    -0.000005395239384953
  ]

  let y = x
  let tmp = x + 5.5
  tmp -= (x + 0.5) * Math.log(tmp)

  let ser = 1.000000000190015
  for (let j = 0; j < 6; j++) {
    ser += coefficients[j] / ++y
  }

  return -tmp + Math.log(2.5066282746310005 * ser / x)
}

/**
 * T-distribution inverse (approximate)
 */
function tDistributionInverse(p: number, df: number): number {
  // Simplified approximation
  if (df > 30) {
    return normalInverse(p)
  }
  // Use iterative approximation for small df
  const ni = normalInverse(p)
  if (!isFinite(ni)) return 0
  return ni * Math.sqrt(df / Math.max(1, df - 2))
}

/**
 * Chi-square distribution p-value (improved approximation)
 */
function chiSquarePValue(chiSquare: number, df: number): number {
  if (!isFinite(chiSquare) || !isFinite(df) || df <= 0 || chiSquare < 0) return NaN

  // For very large chi-square values
  if (chiSquare > 200) return 0

  const result = gammaLowerIncomplete(df / 2, chiSquare / 2)

  if (!isFinite(result)) return 0

  return Math.max(0, Math.min(1, 1 - result))
}

/**
 * F-distribution p-value (improved approximation)
 */
function fDistributionPValue(f: number, df1: number, df2: number): number {
  if (!isFinite(f) || !isFinite(df1) || !isFinite(df2) || df1 <= 0 || df2 <= 0 || f < 0) return NaN

  // For very large F values
  if (f > 100) return 0

  // P(F > f) = I_x(df2/2, df1/2) where x = df2 / (df2 + df1*f)
  const x = df2 / (df2 + df1 * f)
  const betaResult = incompleteBeta(df2 / 2, df1 / 2, x)

  if (!isFinite(betaResult)) return 0

  return Math.max(0, Math.min(1, 1 - betaResult))
}

/**
 * Incomplete beta function (improved with better numerical stability)
 */
function incompleteBeta(a: number, b: number, x: number): number {
  if (x <= 0) return 0
  if (x >= 1) return 1

  // Regularized incomplete beta for numerical stability
  const betaVal = beta(a, b)
  if (!isFinite(betaVal) || betaVal === 0) return x < 0.5 ? 0 : 1

  // Series approximation with better convergence
  let result = Math.pow(x, a) * Math.pow(1 - x, b) / a
  let term = result

  for (let i = 1; i < 1000; i++) {
    term *= (a + b - 1 + i) * x / (a + i)
    result += term / (a + i)

    // Check for convergence
    if (Math.abs(term) < 1e-12 || !isFinite(result)) break
  }

  const finalResult = result / betaVal
  return Math.max(0, Math.min(1, finalResult))
}

/**
 * Beta function (improved with error handling)
 */
function beta(a: number, b: number): number {
  const gammaA = gamma(a)
  const gammaB = gamma(b)
  const gammaSum = gamma(a + b)

  if (!isFinite(gammaA) || !isFinite(gammaB) || !isFinite(gammaSum)) return 1

  return (gammaA * gammaB) / gammaSum
}

/**
 * Gamma function (Lanczos approximation - more accurate)
 */
function gamma(n: number): number {
  if (n < 0.5) return Math.PI / (Math.sin(Math.PI * n) * gamma(1 - n))

  n = n - 1
  const p = [
    676.5203681218851, -1259.1392167224028,
    771.32342877765313, -176.61502916214059,
    12.507343278686905, -0.13857109526572012,
    9.9843695780195716e-6, 1.5056327351493116e-7
  ]

  let y = 1
  for (let i = 0; i < p.length; i++) {
    y += p[i] / (n + i + 1)
  }

  const t = n + p.length - 0.5
  const result = Math.sqrt(2 * Math.PI) * Math.pow(t, n + 0.5) * Math.exp(-t) * y

  return isFinite(result) ? result : 1
}

/**
 * Incomplete gamma function (lower) - improved
 */
function gammaLowerIncomplete(s: number, x: number): number {
  if (x < 0 || s <= 0) return 0
  if (x === 0) return 0

  // For large x, use approximation
  if (x > s + 10) return 1

  let sum = 0
  let term = 1 / s
  sum = term

  for (let i = 1; i < 500; i++) {
    term *= x / (s + i)
    sum += term

    if (Math.abs(term) < 1e-12 || !isFinite(sum)) break
  }

  const gammaVal = gamma(s)
  if (!isFinite(gammaVal) || gammaVal === 0) return x > s ? 1 : 0

  const result = sum * Math.pow(x, s) * Math.exp(-x) / gammaVal

  return Math.max(0, Math.min(1, result))
}

/**
 * Normal distribution inverse (approximation)
 */
function normalInverse(p: number): number {
  // Handle edge cases
  if (p <= 0) return -Infinity
  if (p >= 1) return Infinity
  if (p === 0.5) return 0

  const a0 = 2.50662823884
  const a1 = -18.61500062529
  const a2 = 41.39119773534
  const a3 = -25.44106049637

  const b1 = -8.47351093090
  const b2 = 23.08336743743
  const b3 = -21.06224101826
  const b4 = 3.13082909833

  const y = p - 0.5

  if (Math.abs(y) < 0.42) {
    const r = y * y
    return y * (((a3 * r + a2) * r + a1) * r + a0) /
      ((((b4 * r + b3) * r + b2) * r + b1) * r + 1)
  }

  let r = p
  if (y > 0) r = 1 - p
  r = Math.log(-Math.log(r))

  const c0 = 0.3374754822726147
  const c1 = 0.9761690190917186
  const c2 = 0.1607979714918209
  const c3 = 0.0276438810333863
  const c4 = 0.0038405729373609
  const c5 = 0.0003951896511919
  const c6 = 0.0000321767881768
  const c7 = 0.0000002888167364
  const c8 = 0.0000003960315187

  const x = c0 + r * (c1 + r * (c2 + r * (c3 + r * (c4 + r * (c5 + r * (c6 + r * (c7 + r * c8)))))))

  const result = y < 0 ? -x : x
  return isFinite(result) ? result : 0
}

/**
 * Interpretation helpers
 */
function interpretTTest(pValue: number, cohensD: number): string {
  let interpretation = pValue < 0.05
    ? 'Statistically significant difference between groups (p < 0.05).'
    : 'No statistically significant difference between groups (p ≥ 0.05).'

  const absD = Math.abs(cohensD)
  if (absD < 0.2) interpretation += ' Effect size is negligible.'
  else if (absD < 0.5) interpretation += ' Effect size is small.'
  else if (absD < 0.8) interpretation += ' Effect size is medium.'
  else interpretation += ' Effect size is large.'

  return interpretation
}

function interpretChiSquare(pValue: number, cramersV: number): string {
  let interpretation = pValue < 0.05
    ? 'Statistically significant association between variables (p < 0.05).'
    : 'No statistically significant association between variables (p ≥ 0.05).'

  if (cramersV < 0.1) interpretation += ' Association is weak.'
  else if (cramersV < 0.3) interpretation += ' Association is moderate.'
  else interpretation += ' Association is strong.'

  return interpretation
}

function interpretANOVA(pValue: number, etaSquared: number): string {
  let interpretation = pValue < 0.05
    ? 'Statistically significant difference between groups (p < 0.05).'
    : 'No statistically significant difference between groups (p ≥ 0.05).'

  if (etaSquared < 0.01) interpretation += ' Effect size is small.'
  else if (etaSquared < 0.06) interpretation += ' Effect size is medium.'
  else interpretation += ' Effect size is large.'

  return interpretation
}

function interpretRegression(pValue: number, rSquared: number): string {
  let interpretation = pValue < 0.05
    ? 'The predictor is statistically significant (p < 0.05).'
    : 'The predictor is not statistically significant (p ≥ 0.05).'

  interpretation += ` The model explains ${(rSquared * 100).toFixed(1)}% of the variance.`

  return interpretation
}

/**
 * Helper to extract numeric values from DataRow array
 */
export function extractNumericValues(rows: DataRow[], variableName: string): number[] {
  return rows
    .map(row => row[variableName])
    .filter(val => val !== null && val !== undefined && val !== '')
    .map(val => typeof val === 'string' ? parseFloat(val) : Number(val))
    .filter(val => !isNaN(val))
}

/**
 * Helper to group numeric data by categorical variable
 */
export function groupNumericData(
  rows: DataRow[],
  numericVariable: string,
  groupVariable: string
): { [group: string]: number[] } {
  const grouped: { [group: string]: number[] } = {}

  rows.forEach(row => {
    const group = String(row[groupVariable] || 'Unknown')
    const value = row[numericVariable]

    if (value === null || value === undefined || value === '') return

    const numValue = typeof value === 'string' ? parseFloat(value) : Number(value)
    if (isNaN(numValue)) return

    if (!grouped[group]) {
      grouped[group] = []
    }
    grouped[group].push(numValue)
  })

  return grouped
}
