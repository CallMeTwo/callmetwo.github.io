// Scoring system utilities and calculation logic

import { scoringSystems } from '../data/scoreDefinitions.js'

/**
 * Get a scoring system by ID
 * @param {string} scoreId - The ID of the scoring system
 * @returns {object} The scoring system definition
 */
export const getScoreSystem = (scoreId) => {
  return scoringSystems[scoreId] || scoringSystems.wells
}

/**
 * Calculate score and interpretation for a given scoring system
 * @param {string} scoreId - The ID of the scoring system
 * @param {object} values - The form values/variables for calculation
 * @returns {object} Object containing { score, interpretation }
 */
export const calculateScore = (scoreId, values) => {
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
export const formatScore = (score) => {
  if (score === null || score === undefined) return '-'
  return Number.isInteger(score) ? score.toString() : score.toFixed(1)
}

/**
 * Get all available scoring systems
 * @returns {array} Array of scoring system definitions
 */
export const getAllScoringSystems = () => {
  return Object.values(scoringSystems)
}

/**
 * Validate form values before calculation
 * @param {string} scoreId - The ID of the scoring system
 * @param {object} values - The form values to validate
 * @returns {object} { isValid: boolean, errors: array }
 */
export const validateScoreForm = (scoreId, values) => {
  const errors = []

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
