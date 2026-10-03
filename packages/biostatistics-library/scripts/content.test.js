import { describe, expect, it } from 'vitest'
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import { join, relative, resolve } from 'node:path'
import { articleHref, findTopicBySlug, sections, topicSlug } from '../src/topics'

// vitest runs from the repository root
const contentDir = resolve(process.cwd(), 'packages/biostatistics-library/content')

function contentFiles() {
  if (!existsSync(contentDir)) return []
  const files = []
  const walk = dir => {
    for (const name of readdirSync(dir)) {
      if (name === 'README.md' || name.startsWith('.')) continue
      const full = join(dir, name)
      const st = statSync(full)
      if (st.isDirectory()) walk(full)
      else if (name.endsWith('.md')) files.push(full)
    }
  }
  walk(contentDir)
  return files
}

describe('topic slug helpers', () => {
  it('converts titles to lowercase hyphenated slugs', () => {
    expect(topicSlug('What is biostatistics?')).toBe('what-is-biostatistics')
    expect(topicSlug('P-values and significance levels')).toBe('p-values-and-significance-levels')
    expect(topicSlug('Mann–Whitney and Wilcoxon tests')).toBe('mann-whitney-and-wilcoxon-tests')
    expect(topicSlug('Fisher’s exact test')).toBe('fishers-exact-test')
  })

  it('produces unique slugs within every section', () => {
    for (const section of sections) {
      const slugs = section.groups.flatMap(group => group.topics).map(topicSlug)
      expect(new Set(slugs).size).toBe(slugs.length)
    }
  })

  it('builds article hrefs as <section>/<slug>.html', () => {
    expect(articleHref('foundations', 'What is biostatistics?')).toBe('foundations/what-is-biostatistics.html')
  })
})

describe('content ↔ topic map consistency', () => {
  const files = contentFiles()

  it('finds the sample article in the content directory', () => {
    expect(files.length).toBeGreaterThan(0)
    expect(files.some(file => {
      const slug = relative(contentDir, file).split(/[/\\]/)[1].replace(/\.md$/, '')
      return slug === 'what-is-biostatistics'
    })).toBe(true)
  })

  it('matches every content file to an existing topic in the right section', () => {
    for (const file of files) {
      const rel = relative(contentDir, file)
      const [sectionId, rawSlug] = rel.split(/[/\\]/)
      const slug = rawSlug.replace(/\.md$/, '')
      const location = findTopicBySlug(slug)
      expect(location, `${rel} does not match any topic title`).not.toBeNull()
      expect(location.section.id, `${rel} is in the wrong section folder`).toBe(sectionId)
    }
  })

  it('keeps frontmatter titles in sync with the topic map', () => {
    for (const file of files) {
      const rel = relative(contentDir, file)
      const [sectionId, rawSlug] = rel.split(/[/\\]/)
      const location = findTopicBySlug(rawSlug.replace(/\.md$/, ''))
      expect(location, `${rel} does not match any topic title`).not.toBeNull()
      const raw = readFileSync(file, 'utf8')
      const match = /^---\r?\n([\s\S]*?)\r?\n---/.exec(raw)
      if (!match) continue
      const titleLine = match[1].split(/\r?\n/).find(line => line.startsWith('title:'))
      if (!titleLine) continue
      const title = titleLine.slice(titleLine.indexOf(':') + 1).trim().replace(/^["']|["']$/g, '')
      expect(title, `frontmatter title in ${rel}`).toBe(location.title)
      expect(location.section.id).toBe(sectionId)
    }
  })
})
