import { mean, standardDeviation, variance } from 'simple-statistics'
import jstat from 'jstat'
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
}

export interface RegressionResult {
  testType: 'Linear Regression' | 'Logistic Regression'
  coefficients: { variable: string; coefficient: number; standardError: number; tStatistic?: number; pValue: number }[]
  rSquared?: number // For linear regression
  adjustedRSquared?: number
  fStatistic?: number
  intercept: number
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

  return {
    testType: 'Chi-Square Test of Independence',
    statistic: chiSquare,
    degreesOfFreedom: df,
    pValue,
    contingencyTable,
    cramersV,
    interpretation: interpretChiSquare(pValue, cramersV)
  }
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

  return {
    testType: 'One-Way ANOVA',
    fStatistic,
    degreesOfFreedomBetween: dfBetween,
    degreesOfFreedomWithin: dfWithin,
    pValue,
    groupMeans,
    etaSquared,
    interpretation: interpretANOVA(pValue, etaSquared)
  }
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

  // F-statistic
  const ssRegression = ssTotal - ssResidual
  const fStatistic = (ssRegression / 1) / (ssResidual / (n - 2))

  return {
    testType: 'Linear Regression',
    coefficients: [
      {
        variable: xName,
        coefficient: slope,
        standardError: slopeStandardError,
        tStatistic,
        pValue
      }
    ],
    rSquared,
    adjustedRSquared,
    fStatistic,
    intercept,
    interpretation: interpretRegression(pValue, rSquared)
  }
}

/**
 * T-distribution p-value using jstat
 * Calculates the cumulative distribution function (CDF) for the t-distribution
 * Returns the right-tailed p-value: P(T > |t|)
 */
function tDistributionPValue(t: number, df: number): number {
  // jstat.t.cdf returns P(T <= t), so we use 1 - CDF for right tail
  return 1 - jstat.t.cdf(t, df)
}

/**
 * T-distribution inverse using jstat
 * Calculates the inverse CDF (quantile function) for the t-distribution
 * Returns the t-value for a given cumulative probability
 */
function tDistributionInverse(p: number, df: number): number {
  return jstat.t.inv(p, df)
}

/**
 * Chi-square distribution p-value using jstat
 * Returns the right-tailed p-value: P(χ² > chiSquare)
 */
function chiSquarePValue(chiSquare: number, df: number): number {
  return 1 - jstat.chisquare.cdf(chiSquare, df)
}

/**
 * F-distribution p-value using jstat
 * Returns the right-tailed p-value: P(F > f)
 */
function fDistributionPValue(f: number, df1: number, df2: number): number {
  return 1 - jstat.f.cdf(f, df1, df2)
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
