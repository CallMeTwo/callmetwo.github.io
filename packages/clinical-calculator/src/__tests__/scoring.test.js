import { describe, it, expect } from 'vitest'
import {
  calculateScore,
  getScoreSystem,
  formatScore,
  getAllScoringSystems,
  validateScoreForm
} from '../utils/scoring.js'

describe('Clinical Calculator - Scoring Utilities', () => {
  describe('getScoreSystem', () => {
    it('should return Wells score system', () => {
      const system = getScoreSystem('wells')
      expect(system.id).toBe('wells')
      expect(system.name).toContain('Wells')
    })

    it('should return Alvarado score system', () => {
      const system = getScoreSystem('alvarado')
      expect(system.id).toBe('alvarado')
      expect(system.name).toContain('Alvarado')
    })

    it('should return Child-Pugh score system', () => {
      const system = getScoreSystem('child')
      expect(system.id).toBe('child')
      expect(system.name).toContain('Child-Pugh')
    })

    it('should default to Wells for invalid ID', () => {
      const system = getScoreSystem('invalid')
      expect(system.id).toBe('wells')
    })
  })

  describe('calculateScore', () => {
    it('should calculate Wells score correctly', () => {
      const values = {
        dvt_signs: true,
        pe_likely: false,
        heart_rate: true,
        immobilization: false,
        dvt_pe_history: false,
        hemoptysis: false,
        malignancy: false
      }
      const { score, interpretation } = calculateScore('wells', values)
      expect(score).toBe(2)
      expect(interpretation.category).toBe('Low Risk')
    })

    it('should calculate Alvarado score correctly', () => {
      const values = {
        migration_pain: true,
        anorexia: true,
        nausea_vomiting: true,
        rlq_pain: true,
        rebound_tenderness: true,
        elevated_temperature: true,
        elevated_wbc: true,
        left_shift: true
      }
      const { score, interpretation } = calculateScore('alvarado', values)
      expect(score).toBe(10)
      expect(interpretation.category).toBe('High Probability')
    })

    it('should return correct interpretation for score range', () => {
      const values = {
        dvt_signs: true,
        pe_likely: true,
        heart_rate: true,
        immobilization: true,
        dvt_pe_history: true,
        hemoptysis: true,
        malignancy: true
      }
      const { score, interpretation } = calculateScore('wells', values)
      expect(score).toBe(7)
      expect(interpretation.category).toBe('High Risk')
    })
  })

  describe('formatScore', () => {
    it('should format integer scores', () => {
      expect(formatScore(5)).toBe('5')
      expect(formatScore(10)).toBe('10')
    })

    it('should format decimal scores to one decimal place', () => {
      expect(formatScore(5.5)).toBe('5.5')
      expect(formatScore(3.1)).toBe('3.1')
    })

    it('should handle null/undefined', () => {
      expect(formatScore(null)).toBe('-')
      expect(formatScore(undefined)).toBe('-')
    })
  })

  describe('getAllScoringSystems', () => {
    it('should return array of all scoring systems', () => {
      const systems = getAllScoringSystems()
      expect(Array.isArray(systems)).toBe(true)
      expect(systems.length).toBe(3)
    })

    it('should contain Wells, Alvarado, and Child-Pugh', () => {
      const systems = getAllScoringSystems()
      const ids = systems.map(s => s.id)
      expect(ids).toContain('wells')
      expect(ids).toContain('alvarado')
      expect(ids).toContain('child')
    })
  })

  describe('validateScoreForm', () => {
    it('should validate correct form', () => {
      const values = {
        dvt_signs: false,
        pe_likely: false,
        heart_rate: false,
        immobilization: false,
        dvt_pe_history: false,
        hemoptysis: false,
        malignancy: false
      }
      const result = validateScoreForm('wells', values)
      expect(result.isValid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })

    it('should reject invalid scoring system', () => {
      const values = { test: true }
      const result = validateScoreForm('invalid', values)
      expect(result.isValid).toBe(false)
      expect(result.errors.length).toBeGreaterThan(0)
    })

    it('should reject empty values', () => {
      const result = validateScoreForm('wells', {})
      expect(result.isValid).toBe(false)
    })

    it('should reject null values', () => {
      const result = validateScoreForm('wells', null)
      expect(result.isValid).toBe(false)
    })
  })
})
