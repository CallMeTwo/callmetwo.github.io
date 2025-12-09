import { describe, it, expect } from 'vitest'
import { formatNumber, calculateStats } from '../index.js'

describe('Shared Utilities', () => {
  describe('formatNumber', () => {
    it('should format numbers with locale string', () => {
      expect(formatNumber(1000)).toBe('1,000')
      expect(formatNumber(1000.5)).toBe('1,000.5')
    })

    it('should round to 2 decimal places', () => {
      expect(formatNumber(10.456)).toBe('10.46')
      expect(formatNumber(5.123)).toBe('5.12')
    })

    it('should handle small numbers', () => {
      expect(formatNumber(0.5)).toBe('0.5')
      expect(formatNumber(0.99)).toBe('0.99')
    })

    it('should handle zero', () => {
      expect(formatNumber(0)).toBe('0')
    })

    it('should handle negative numbers', () => {
      expect(formatNumber(-1000.5)).toBe('-1,000.5')
    })
  })

  describe('calculateStats', () => {
    it('should calculate mean correctly', () => {
      const data = [10, 20, 30]
      const stats = calculateStats(data)
      expect(stats.mean).toBe(20)
    })

    it('should calculate median correctly', () => {
      const dataOdd = [10, 20, 30]
      expect(calculateStats(dataOdd).median).toBe(20)

      const dataEven = [10, 20, 30, 40]
      expect(calculateStats(dataEven).median).toBe(30)
    })

    it('should find min and max', () => {
      const data = [5, 100, 25, 50]
      const stats = calculateStats(data)
      expect(stats.min).toBe(5)
      expect(stats.max).toBe(100)
    })

    it('should handle single element', () => {
      const data = [42]
      const stats = calculateStats(data)
      expect(stats.mean).toBe(42)
      expect(stats.median).toBe(42)
      expect(stats.min).toBe(42)
      expect(stats.max).toBe(42)
    })

    it('should handle empty data', () => {
      const stats = calculateStats([])
      expect(stats).toBeNull()
    })

    it('should handle null or undefined', () => {
      expect(calculateStats(null)).toBeNull()
      expect(calculateStats(undefined)).toBeNull()
    })

    it('should handle negative numbers', () => {
      const data = [-10, -5, 0, 5, 10]
      const stats = calculateStats(data)
      expect(stats.mean).toBe(0)
      expect(stats.min).toBe(-10)
      expect(stats.max).toBe(10)
    })
  })
})
