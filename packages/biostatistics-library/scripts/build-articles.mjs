#!/usr/bin/env node
// Generate static article pages for biostatistics-library.
//
// Run automatically after `vite build` via the "build" script in package.json
// ("vite build && node scripts/build-articles.mjs").
//
// For every content/<section-id>/<slug>.md that matches a topic in the map,
// emit dist/<section-id>/<slug>.html — a full page (shared navbar + sidebar +
// rendered markdown) so each article is a real shareable URL on GitHub Pages.
//
// A markdown file that does not match any topic title fails the build, so the
// map and the content can never drift apart silently.

import { readFileSync, readdirSync, statSync, mkdirSync, writeFileSync, existsSync } from 'node:fs'
import { join, dirname, relative, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import esbuild from 'esbuild'
import { marked } from 'marked'
import { tmpdir } from 'node:os'

const here = dirname(fileURLToPath(import.meta.url))
const root = join(here, '..')
const contentDir = join(root, 'content')
const distDir = join(root, 'dist')

marked.setOptions({ gfm: true, breaks: false })

function fail(message) {
  console.error(`\n[biostatistics-library] ${message}`)
  process.exit(1)
}

function esc(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function escAttr(value) {
  return String(value ?? '').replace(/"/g, '&quot;')
}

// External (http/https) links open in a new tab and get a small arrow so
// readers can tell where they'll land. Internal cross-article links (relative
// hrefs) stay in the same tab, like a normal site.
function decorateLinks(html) {
  return html.replace(/<a href="([^"]*)">/g, (match, href) => {
    const external = /^https?:\/\//.test(href)
    if (!external) return match
    return `<a href="${href}" target="_blank" rel="noopener noreferrer" class="ext-link">`
  })
}

// Marked treats the TeX delimiters as Markdown escapes and drops their slashes.
// Protect them while parsing so MathJax can typeset inline and display TeX.
function renderMarkdownBody(markdown) {
  const inlineOpen = 'MATHJAXINLINEOPEN7E1D'
  const inlineClose = 'MATHJAXINLINECLOSE7E1D'
  const displayOpen = 'MATHJAXDISPLAYOPEN7E1D'
  const displayClose = 'MATHJAXDISPLAYCLOSE7E1D'
  return marked.parse(markdown
    .replaceAll('\\(', inlineOpen)
    .replaceAll('\\)', inlineClose)
    .replaceAll('\\[', displayOpen)
    .replaceAll('\\]', displayClose))
    .replaceAll(inlineOpen, '\\(')
    .replaceAll(inlineClose, '\\)')
    .replaceAll(displayOpen, '\\[')
    .replaceAll(displayClose, '\\]')
}

// Bundle topics.ts once and import it (keeps a single source of truth for the
// taxonomy — the article generator and the React app share the same file).
async function loadTopics() {
  const tmp = join(tmpdir(), `blib-topics-${Date.now()}.mjs`)
  const result = await esbuild.build({
    entryPoints: [join(root, 'src', 'topics.ts')],
    bundle: true,
    format: 'esm',
    platform: 'node',
    outfile: tmp,
    logLevel: 'silent',
  })
  if (result.errors.length) fail(`Could not bundle topics.ts: ${result.errors.join('\n')}`)
  return await import(pathToFileURL(tmp).href)
}

function parseFrontmatter(raw) {
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/.exec(raw)
  if (!match) return { data: {}, body: raw }
  const data = {}
  for (const line of match[1].split(/\r?\n/)) {
    const idx = line.indexOf(':')
    if (idx === -1) continue
    const key = line.slice(0, idx).trim()
    const value = line.slice(idx + 1).trim()
    if (key) data[key] = value.replace(/^["']|["']$/g, '')
  }
  return { data, body: raw.slice(match[0].length) }
}

function collectContentFiles() {
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

function navbarHtml(sectionTitle) {
  return `<nav style="background:#2c3e50;padding:12px 0;border-bottom:3px solid #3498db;position:sticky;top:0;z-index:1000;box-shadow:0 2px 4px rgba(0,0,0,.1)">
  <div style="max-width:1000px;margin:0 auto;padding:0 20px;display:flex;align-items:center;font-size:14px;flex-wrap:wrap;gap:0 5px">
    <a href="/" style="color:#3498db;text-decoration:none;font-weight:600;display:flex;align-items:center;gap:6px;padding:6px 12px;border-radius:4px">🏠 Home</a>
    <span style="color:#7f8c8d;margin:0 2px">/</span>
    <a href="../" style="color:#ecf0f1;text-decoration:none;transition:color .2s;padding:6px 8px;border-radius:4px">Biostatistics Library</a>
    ${sectionTitle ? `<span style="color:#7f8c8d;margin:0 2px">/</span><span style="color:#95a5a6;padding:6px 8px" data-active-section>${esc(sectionTitle)}</span>` : ''}
  </div>
</nav>`
}

function sidebarHtml(sections, activeSectionId) {
  const links = sections.map((section, index) => {
    const active = section.id === activeSectionId
    return `      <a href="../#topic-index" ${active ? `style="color:#17675d;background:#edf3ef;font-weight:700"` : ''}><span>${String(index + 1).padStart(2, '0')}</span>${esc(section.title)}</a>`
  }).join('\n')
  return `<aside class="article-sidebar" aria-label="Library navigation">
  <a class="article-brand" href="../" aria-label="Biostatistics Library home">
    <span class="article-brand-icon" aria-hidden="true">B<span>∑</span></span>
    <span>Biostatistics<br><strong>Library</strong></span>
  </a>
  <div class="article-nav-label">CONTENTS</div>
  <a class="article-overview" href="../#topic-index">All topics <span>${sections.reduce((count, item) => count + item.groups.reduce((n, group) => n + group.topics.length, 0), 0)}</span></a>
  <nav aria-label="Topic sections" class="article-sections">
${links}
  </nav>
  <div class="article-note-side"><span class="article-dot" /> Biostatistics Library<p>Explore statistical ideas and methods for health research.</p></div>
</aside>`
}

function articleCss() {
  // Article typography — intentionally self-contained so pages render
  // identically whether or not the React app's styles.css is available.
  return `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Libre+Caslon+Text:wght@400;700&display=swap');
  .article-page{font-family:'DM Sans',system-ui,sans-serif;color:#273e3b;background:#fbfcfa;min-height:100vh;font-synthesis:none;--teal:#17675d;--muted:#667975;--line:#dde5df}
  .article-page *{box-sizing:border-box}
  .article-page body{margin:0}
  .article-page a{color:var(--teal)}
  .article-page :focus-visible{outline:3px solid #b37b29;outline-offset:4px}
  .article-shell{display:grid;grid-template-columns:254px minmax(0,1fr);max-width:1440px;margin:auto}
  .article-sidebar{padding:38px 24px;border-right:1px solid var(--line);position:sticky;top:60px;align-self:start;height:calc(100dvh - 60px);overflow-y:auto}
  .article-brand{display:flex;align-items:center;gap:12px;text-decoration:none;font-size:15px;line-height:1.5;color:#273e3b;margin-bottom:42px}
  .article-brand strong{font-weight:700}
  .article-brand-icon{position:relative;display:grid;place-items:center;width:43px;height:48px;border:1px solid #b7cdc2;border-radius:3px 9px 9px 3px;background:#edf3ec;font:27px Georgia,serif;color:var(--teal);flex-shrink:0}
  .article-brand-icon span{position:absolute;font:11px Georgia,serif;bottom:5px;right:6px}
  .article-nav-label{font-size:10px;letter-spacing:1.7px;color:var(--muted);margin:0 10px 14px;font-weight:700}
  .article-overview{display:flex;justify-content:space-between;background:#e8f0eb;padding:12px;border-radius:5px;text-decoration:none;font-size:13px;font-weight:700;color:#273e3b}
  .article-sections{display:grid;gap:3px;margin-top:12px}
  .article-sections a{display:flex;align-items:baseline;gap:10px;font-size:12px;line-height:1.6;color:#536660;padding:9px 10px;text-decoration:none;border-radius:4px}
  .article-sections a span{color:#89968f;font-size:10px;font-variant-numeric:tabular-nums}
  .article-sections a:hover{color:var(--teal);background:#edf3ef}
  .article-note-side{margin:35px 10px 0;border-top:1px solid var(--line);padding-top:22px;font-size:11px;font-weight:600}
  .article-note-side p{color:var(--muted);font-weight:400;line-height:1.8}
  .article-dot{display:inline-block;background:#78a388;width:6px;height:6px;border-radius:50%;margin-right:5px}
  .article-main{padding:48px clamp(24px,4vw,64px) 24px;min-width:0}
  .article-breadcrumb{display:flex;flex-wrap:wrap;gap:8px;align-items:baseline;font-size:12px;color:var(--muted);margin-bottom:14px}
  .article-breadcrumb a{color:var(--teal);text-decoration:none}
  .article-breadcrumb .sep{color:#bcc8bf}
  .article-title{font:400 clamp(30px,3.4vw,44px)/1.2 'Libre Caslon Text',Georgia,serif;letter-spacing:-1.2px;margin:0 0 14px;color:#203f37}
  .article-summary{font-size:14px;line-height:1.85;color:var(--muted);margin:0 0 34px;padding-bottom:26px;border-bottom:1px solid var(--line)}
  .article-body{max-width:72ch;font-size:15px;line-height:1.85}
  .article-body h2{font:700 21px/1.4 'DM Sans',system-ui,sans-serif;margin:38px 0 14px;color:#203f37;padding-top:6px}
  .article-body h3{font-size:16px;font-weight:600;margin:28px 0 10px;color:#203f37}
  .article-toc{max-width:72ch;margin:0 0 30px;padding:18px 22px;background:#f0f4ef;border-radius:6px}
  .article-toc h2{font:600 14px 'DM Sans',system-ui,sans-serif;margin:0 0 8px}
  .article-toc ol{margin:0;padding-left:2rem;list-style-position:outside;font-size:12px;line-height:1.9}
  .article-toc li::marker{font-variant-numeric:tabular-nums;color:#667975}
  .article-toc li.h3{margin-left:0}
  .article-toc a{text-decoration:none;border-bottom:1px solid #bcd3c9}
  .article-body h2[id],.article-body h3[id]{scroll-margin-top:80px}
  .article-highlight-controls{max-width:72ch;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:8px 12px;margin:-16px 0 24px;color:var(--muted);font-size:12px}
  .article-highlight-controls button{border:1px solid var(--line);border-radius:5px;background:#fff;color:#34594c;padding:6px 10px;font:inherit;cursor:pointer}
  .article-highlight-controls button[data-quick-highlight][aria-pressed="true"]{background:#fff2b8;border-color:#d7b844;color:#453a12}
  .article-highlight-controls button:disabled{display:none}
  .article-highlight-toolbar{position:fixed;z-index:3000;left:50%;bottom:max(14px,env(safe-area-inset-bottom));transform:translateX(-50%);display:flex;align-items:center;gap:7px;max-width:calc(100vw - 20px);padding:9px 11px;border:1px solid #cbd6ce;border-radius:12px;background:#fff;color:#203f37;box-shadow:0 5px 24px rgba(20,40,32,.2);font:13px system-ui,sans-serif}
  .article-highlight-toolbar[hidden]{display:none}
  .article-highlight-toolbar button{border:1px solid #cbd6ce;border-radius:7px;background:#fff;color:#203f37;padding:7px 9px;font:inherit;cursor:pointer}
  .article-highlight-toolbar button[data-highlight-color="yellow"]{background:#fff2b8}
  .article-highlight-toolbar button[data-highlight-color="blue"]{background:#d8edff}
  .article-highlight-toolbar button[data-highlight-color="pink"]{background:#f9dce8}
  .article-highlight-toolbar button[data-remove-highlight]{margin-left:4px}
  .article-highlight-toolbar button[hidden]{display:none}
  ::highlight(reader-highlight-yellow){background-color:#ffe58a;color:#17211b}
  ::highlight(reader-highlight-blue){background-color:#b9e1ff;color:#17211b}
  ::highlight(reader-highlight-pink){background-color:#ffc8dc;color:#17211b}
  body.quick-highlight-mode ::selection{background:#ffe58a;color:#17211b}
  .article-body p{margin:0 0 16px}
  .article-body a{color:var(--teal);text-decoration:none;border-bottom:1px solid #bcd3c9}
  .article-body a:hover{border-bottom-color:var(--teal)}
  .article-body a.ext-link::after{content:'🌐';font-size:11px;margin-left:3px}
  .article-body ul,.article-body ol{margin:0 0 16px;padding-left:24px}
  .article-body li{margin-bottom:7px}
  .article-body li::marker{color:#78a388}
  .article-body blockquote{margin:0 0 16px;padding:10px 18px;border-left:3px solid #b7cdc2;background:#f0f4ef;border-radius:0 5px 5px 0;color:#4c615b}
  .article-body blockquote p:last-child{margin-bottom:0}
  .article-body table{border-collapse:collapse;width:100%;margin:0 0 20px;font-size:14px}
  .article-body th,.article-body td{border:1px solid var(--line);padding:9px 12px;text-align:left;vertical-align:top}
  .article-body th{background:#edf3ed;font-weight:600;color:#34594c}
  .article-body code{font:13px ui-monospace,SFMono-Regular,Menlo,monospace;background:#eef3ee;border:1px solid #dde5df;border-radius:4px;padding:1px 6px;color:#33584c}
  .article-body mjx-container[jax="CHTML"]{font-size:1.04em}
  .article-body mjx-container[display="true"]{max-width:100%;overflow-x:auto;overflow-y:hidden;padding:4px 0 10px}
  .article-body pre{background:#203f37;color:#dcebe2;padding:18px;border-radius:6px;overflow-x:auto;margin:0 0 20px}
  .article-body pre code{background:none;border:0;padding:0;color:inherit;font-size:13px}
  .article-body img{max-width:100%;border-radius:6px}
  .article-body hr{border:0;border-top:1px solid var(--line);margin:30px 0}
  .article-footer{display:flex;justify-content:space-between;gap:16px;flex-wrap:wrap;padding-top:34px;margin-top:44px;border-top:1px solid var(--line);font-size:10px;color:#7b8a7f}
  .article-footer a{text-decoration:none}
  .article-footer a:hover{text-decoration:underline}
  .article-pager{display:flex;justify-content:space-between;gap:16px;margin-top:30px;padding-top:20px;border-top:1px solid var(--line)}
  .article-pager a{max-width:48%;text-decoration:none;font-size:12px;line-height:1.6}
  .article-pager a span{display:block;color:var(--muted);font-size:10px;margin-bottom:4px}
  @media (max-width:720px){
    .article-shell{display:block}
    .article-sidebar{position:static;height:auto;border-right:0;border-bottom:1px solid var(--line);padding:15px 22px}
    .article-brand{margin:0 0 16px;font-size:13px}
    .article-nav-label,.article-sections,.article-note-side{display:none}
    .article-main{padding:30px 20px 24px}
    .article-title{font-size:32px}
  }`
}

function pageHtml({ title, summary, breadcrumb, sectionId, sectionTitle, tocHtml, bodyHtml, previous, next }) {
  const description = escAttr(summary || '')
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="${description}" />
    <title>${esc(title)} · Biostatistics Library</title>
    <script>
      window.MathJax = {
        tex: {
          inlineMath: [['\\\\(', '\\\\)']],
          displayMath: [['\\\\[', '\\\\]'], ['$$', '$$']],
          packages: { '[+]': ['ams'] },
        },
        options: { ignoreHtmlClass: 'tex2jax_ignore', processHtmlClass: 'tex2jax_process' },
        chtml: { matchFontHeight: false },
      }
    </script>
    <script defer src="https://cdn.jsdelivr.net/npm/mathjax@3.2.2/es5/tex-mml-chtml.js"></script>
    <style>${articleCss()}</style>
  </head>
  <body class="article-page">
    ${navbarHtml(sectionTitle)}
    <div class="article-shell">
      ${sidebarHtml(sectionsGlobal, sectionId)}
      <main class="article-main">
        <div class="article-breadcrumb">${breadcrumb}</div>
        <h1 class="article-title">${esc(title)}</h1>
        ${summary ? `<p class="article-summary">${esc(summary)}</p>` : ''}
        ${tocHtml}
        <article class="article-body">
          ${bodyHtml}
        </article>
        <nav class="article-pager" aria-label="Article navigation">
          ${previous ? `<a href="${previous.href}"><span>← Previous article</span>${esc(previous.title)}</a>` : '<span></span>'}
          ${next ? `<a href="${next.href}" style="text-align:right"><span>Next article →</span>${esc(next.title)}</a>` : '<span></span>'}
        </nav>
        <footer class="article-footer">
          <span>Biostatistics Library · <a href="../">Browse the topic map</a></span>
          <a href="/">Back to Web Projects Hub 🌐</a>
        </footer>
      </main>
    </div>
    <script src="../article-highlights.js" defer></script>
  </body>
</html>
`
}

let sectionsGlobal = []

function slugHeading(value) {
  return value.toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g, '')
    .replace(/<[^>]*>/g, '').replace(/&amp;/g, ' and ').replace(/&[^;]+;/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'section'
}

function addTableOfContents(html) {
  const counts = new Map()
  const headings = []
  const bodyHtml = html.replace(/<(h[23])>([\s\S]*?)<\/\1>/g, (_match, tag, inner) => {
    const label = inner.replace(/<[^>]*>/g, '').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'")
    const base = slugHeading(label)
    const count = (counts.get(base) || 0) + 1
    counts.set(base, count)
    const id = count === 1 ? base : `${base}-${count}`
    headings.push({ tag, id, label })
    return `<${tag} id="${id}">${inner}</${tag}>`
  })
  if (!headings.length) return { bodyHtml, tocHtml: '' }
  const tocItems = headings.map(heading => `<li class="${heading.tag}"><a href="#${heading.id}">${esc(heading.label)}</a></li>`).join('')
  return { bodyHtml, tocHtml: `<nav class="article-toc" aria-label="On this page"><h2>On this page</h2><ol>${tocItems}</ol></nav>` }
}

async function main() {
  const topicsModule = await loadTopics()
  const { sections, findTopicBySlug, topicSlug } = topicsModule
  sectionsGlobal = sections

  const contentFiles = existsSync(contentDir)
    ? collectContentFiles()
    : []

  const allTopics = sections.flatMap(section => section.groups.flatMap(group => group.topics.map(title => ({ section, group, title, slug: topicSlug(title) }))))
  const topicBySlug = new Map()
  for (const topic of allTopics) {
    if (topicBySlug.has(topic.slug)) fail(`Duplicate topic slug "${topic.slug}" for "${topic.title}" and "${topicBySlug.get(topic.slug).title}". Topic slugs must be unique across the library.`)
    topicBySlug.set(topic.slug, topic)
  }
  const contentByPath = new Map(contentFiles.map(file => [relative(contentDir, file).replace(/\\/g, '/').replace(/\.md$/, ''), file]))
  const orderedPublished = allTopics.filter(topic => contentByPath.has(`${topic.section.id}/${topic.slug}`))
  const publishedIndex = new Map(orderedPublished.map((topic, index) => [`${topic.section.id}/${topic.slug}`, index]))

  let generated = 0
  for (const file of contentFiles) {
    const rel = relative(contentDir, file)
    const [sectionId, fileName] = rel.split(/[/\\]/)
    const slug = fileName.replace(/\.md$/, '')
    if (!sectionId || !slug) fail(`Content file is not laid out as <section-id>/<slug>.md: ${rel}`)

    const location = findTopicBySlug(slug)
    if (!location) {
      fail(`"${rel}" does not match any topic in the map (src/topics.ts). Rename the file or add the topic.`)
    }
    if (location.section.id !== sectionId) {
      fail(`"${rel}" is under section "${sectionId}" but the topic belongs to "${location.section.id}". Move the file to content/${location.section.id}/.`)
    }

    const { data, body } = parseFrontmatter(readFileSync(file, 'utf8'))
    const title = data.title || location.title
    if (data.title && data.title !== location.title) {
      fail(`Frontmatter title "${data.title}" in ${rel} must match the topic title "${location.title}" exactly.`)
    }
    const summary = data.summary || ''
    const bodyHtml = decorateLinks(renderMarkdownBody(body))
    const { bodyHtml: anchoredBodyHtml, tocHtml } = addTableOfContents(bodyHtml)
    for (const [, href] of bodyHtml.matchAll(/<a\s+[^>]*href="([^"]+)"/g)) {
      if (/^(?:https?:|mailto:|#|\/\/)/i.test(href) || !/\.html(?:#.*)?$/.test(href)) continue
      const linkPath = decodeURIComponent(href.split('#')[0]).replace(/\.html$/, '.md')
      if (linkPath.startsWith('/') && !linkPath.startsWith('/biostatistics-library/')) continue
      const target = (linkPath.startsWith('/biostatistics-library/')
        ? linkPath.slice('/biostatistics-library/'.length)
        : relative(contentDir, resolve(dirname(file), linkPath))).replace(/\\/g, '/')
      if (!contentByPath.has(target.replace(/\.md$/, ''))) fail(`Broken internal article link "${href}" in ${rel}: no published article at ${target}.`)
    }

    const breadcrumb = [
      `<a href="../">Biostatistics Library</a>`,
      `<span class="sep">/</span>`,
      esc(location.section.title),
      `<span class="sep">/</span>`,
      esc(location.group.title),
      `<span class="sep">/</span>`,
      `<strong style="color:#273e3b">${esc(location.title)}</strong>`,
    ].join(' ')

    const outDir = join(distDir, sectionId)
    mkdirSync(outDir, { recursive: true })
    const outPath = join(outDir, `${slug}.html`)
    const currentIndex = publishedIndex.get(`${sectionId}/${slug}`)
    const previousTopic = currentIndex > 0 ? orderedPublished[currentIndex - 1] : null
    const nextTopic = currentIndex < orderedPublished.length - 1 ? orderedPublished[currentIndex + 1] : null
    const related = topic => topic && ({ title: topic.title, href: `../${topic.section.id}/${topic.slug}.html` })
    writeFileSync(outPath, pageHtml({ title, summary, breadcrumb, bodyHtml: anchoredBodyHtml, tocHtml, sectionId: location.section.id, sectionTitle: location.section.title, previous: related(previousTopic), next: related(nextTopic) }))
    console.log(`[biostatistics-library] article  ${sectionId}/${slug}.html  ←  ${rel}`)
    generated += 1
  }

  console.log(`[biostatistics-library] ${generated} article page(s) generated into ${distDir}`)
}

main().catch(error => fail(error.stack || String(error)))
