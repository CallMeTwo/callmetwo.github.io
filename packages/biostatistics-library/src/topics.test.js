import { describe, expect, it } from 'vitest'
import { filterSections, sections } from './topics'

describe('library topic search', () => {
  it('keeps a matching article in its parent hierarchy', () => {
    const result = filterSections('  FISHER  ')
    expect(result).toHaveLength(1)
    expect(result[0].title).toBe('Comparing groups')
    expect(result[0].groups).toEqual([{ title: 'Categorical outcomes', topics: ['Fisher’s exact test'] }])
  })

  it('finds all descendants when a subject or subtopic matches', () => {
    expect(filterSections('Foundations')).toEqual([sections[0]])
    const result = filterSections('Hypothesis testing')
    expect(result).toHaveLength(1)
    expect(result[0].groups).toHaveLength(1)
    expect(result[0].groups[0].topics).toContain('P-values and significance levels')
  })

  it('combines words across the hierarchy and handles no results', () => {
    expect(filterSections('comparisons-not-a-topic')).toEqual([])
    expect(filterSections('regression logistic')[0].groups[0].topics).toEqual(['Logistic regression'])
  })

  it('restores the whole index after clearing search without changing the source', () => {
    const before = JSON.stringify(sections)
    filterSections('Fisher')
    expect(JSON.stringify(sections)).toBe(before)
    expect(filterSections('  ')).toEqual(sections)
  })
})
