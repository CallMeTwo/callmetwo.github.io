// Scoring system utilities and calculation logic

import { scoringSystems, ScoringSystem, Interpretation } from '../data/scoreDefinitions'

/**
 * Get a scoring system by ID
 * @param {string} scoreId - The ID of the scoring system
 * @returns {ScoringSystem} The scoring system definition
 */
export const getScoreSystem = (scoreId: string): ScoringSystem => {
  return scoringSystems[scoreId] || scoringSystems.wells
}

interface CalculateScoreResult {
  score: number
  interpretation: Interpretation | undefined
}

/**
 * Calculate score and interpretation for a given scoring system
 * @param {string} scoreId - The ID of the scoring system
 * @param {Record<string, number | boolean>} values - The form values/variables for calculation
 * @returns {CalculateScoreResult} Object containing { score, interpretation }
 */
export const calculateScore = (scoreId: string, values: Record<string, number | boolean>): CalculateScoreResult => {
  const system = getScoreSystem(scoreId)
  const score = system.calculate(values)
  const interpretation = system.interpretations.find(
    interp => score >= interp.range[0] && score <= interp.range[1]
  )
  return { score, interpretation }
}

/**
 * Format score for display
 * @param {number} score - The score value
 * @returns {string} Formatted score string
 */
export const formatScore = (score: number | null | undefined): string => {
  if (score === null || score === undefined) return '-'
  return Number.isInteger(score) ? score.toString() : score.toFixed(1)
}

/**
 * Get all available scoring systems
 * @returns {ScoringSystem[]} Array of scoring system definitions
 */
export const getAllScoringSystems = (): ScoringSystem[] => {
  return Object.values(scoringSystems)
}

interface ValidationResult {
  isValid: boolean
  errors: string[]
}

/**
 * Validate form values before calculation
 * @param {string} scoreId - The ID of the scoring system
 * @param {Record<string, number | boolean>} values - The form values to validate
 * @returns {ValidationResult} { isValid: boolean, errors: array }
 */
export const validateScoreForm = (scoreId: string, values: Record<string, number | boolean>): ValidationResult => {
  const errors: string[] = []

  // Check if scoring system exists
  if (!scoringSystems[scoreId]) {
    errors.push('Invalid scoring system selected')
  }

  if (!values || Object.keys(values).length === 0) {
    errors.push('No form values provided')
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}
