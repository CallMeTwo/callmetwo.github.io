#!/usr/bin/env node
// Generate src/published-topics.json — the list of topics that have a
// markdown article in content/. Runs before `vite build` so the SPA (which
// imports the JSON) knows which topic links point at real pages. Keeping Vite
// away from the .md files entirely means they are never bundled as assets.

import { readFileSync, readdirSync, statSync, writeFileSync, existsSync, mkdirSync } from 'node:fs'
import { join, dirname, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const root = join(here, '..')
const contentDir = join(root, 'content')

function fail(message) {
  console.error(`\n[biostatistics-library] ${message}`)
  process.exit(1)
}

const entries = []
if (existsSync(contentDir)) {
  const walk = dir => {
    for (const name of readdirSync(dir)) {
      if (name === 'README.md' || name.startsWith('.')) continue
      const full = join(dir, name)
      const st = statSync(full)
      if (st.isDirectory()) walk(full)
      else if (name.endsWith('.md')) {
        const rel = relative(contentDir, full)
        const [sectionId, fileName] = rel.split(/[/\\]/)
        const slug = fileName.replace(/\.md$/, '')
        if (!sectionId || !slug) fail(`Content file is not laid out as <section-id>/<slug>.md: ${rel}`)
        entries.push({ sectionId, slug })
      }
    }
  }
  walk(contentDir)
}

const outPath = join(root, 'src', 'published-topics.json')
mkdirSync(dirname(outPath), { recursive: true })
writeFileSync(outPath, JSON.stringify(entries, null, 2) + '\n')
console.log(`[biostatistics-library] published topics: ${entries.length} → src/published-topics.json`)
