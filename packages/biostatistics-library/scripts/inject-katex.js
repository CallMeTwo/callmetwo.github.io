// Pre-render a topic page's math with KaTeX at BUILD time, then inline a
// pruned KaTeX CSS + base64 woff2 fonts so the page stays fully self-contained
// (no runtime JS, no external fetch, no separate font files).
//
// Idempotent: re-running strips any previous injection and re-injects from the
// canonical formula list (each equation div is matched by its aria-label).
//
// Usage:
//   node scripts/inject-katex.js
//     -> default: study-design/propensity-matching.html + built-in FORMULAS
//   node scripts/inject-katex.js <page.html> <formulas.json>
//     -> page relative to the package root; formulas.json is an array of
//        { "label": <aria-label>, "tex": <KaTeX source> }
//
// Run: npm run katex:inject   (or with the two args above for another page)

import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'
import katex from 'katex'

const __dirname = dirname(fileURLToPath(import.meta.url))
const PKG = resolve(__dirname, '..')

// Resolve katex/dist by walking up from this script until we find it (handles npm hoisting).
function findKatexDist() {
  let dir = __dirname
  for (let i = 0; i < 6; i++) {
    const candidate = resolve(dir, 'node_modules/katex/dist')
    try {
      readFileSync(resolve(candidate, 'katex.min.css'))
      return candidate
    } catch { /* keep walking up */ }
    dir = resolve(dir, '..')
  }
  throw new Error('could not locate katex/dist; run: npm install katex')
}
const katexDist = findKatexDist()

// Default (propensity) formula list. aria-labels MUST match the
// <div class="equation" aria-label="..."> in the page.
const DEFAULT_FORMULAS = [
  {
    label: 'Propensity score e of x equals the probability of treatment A equal to one given covariates X equal to x',
    tex: 'e(x) = \\mathrm{P}(A = 1 \\mid X = x)'
  },
  {
    label: 'A is conditionally independent of the potential outcomes Y zero and Y one given e of X',
    tex: 'A \\perp \\{Y(0), Y(1)\\} \\mid e(X)'
  },
  {
    label: 'Logit of e equals beta zero plus beta one x one plus \u2026 plus beta k x k',
    tex: '\\mathrm{logit}(e) = \\beta_0 + \\beta_1 x_1 + \\cdots + \\beta_k x_k'
  },
  {
    label: 'The conventional caliper equals zero point two times the standard deviation of the logit of the propensity score, computed on the whole sample',
    tex: '\\mathrm{caliper} = 0.2 \\times \\mathrm{SD}\\big(\\mathrm{logit}(e)\\big)'
  },
  {
    label: 'SMD equals the difference in treated and untreated means divided by the square root of the average of the two variances',
    tex: '\\mathrm{SMD} = \\dfrac{\\mu_t - \\mu_u}{\\sqrt{\\dfrac{\\sigma_t^{2} + \\sigma_u^{2}}{2}}}'
  },
  {
    label: 'Binary SMD equals the difference in treated and untreated proportions divided by the square root of the average of the two proportion variances',
    tex: '\\mathrm{SMD} = \\dfrac{p_t - p_u}{\\sqrt{\\dfrac{p_t(1 - p_t) + p_u(1 - p_u)}{2}}}'
  }
]

// Base font style-variants always inlined. Fraction / radical / big-operator
// symbols (\\dfrac, \\sqrt, \\sum, ...) pull in the Size1/Size2 variants, and a
// display-size operator (msumsize3/4) would pull in Size3/Size4 — detected
// below from the actual rendered output so we only inline what is used.
const BASE_FONTS = new Set([
  'Main-Regular', 'Main-Italic', 'Main-Bold',
  'Math-Italic', 'Math-BoldItalic'
])

function fontsForRendered(rendered) {
  const fonts = new Set(BASE_FONTS)
  // Fraction bars, radical bars and big operators at display size live in the
  // Size1/Size2 families; very large ones (msumsize3/4) add Size3/Size4.
  if (/mfrac|msqrt|mradical|mops|msumsize[12]/.test(rendered)) {
    fonts.add('Size1-Regular'); fonts.add('Size2-Regular')
  }
  if (/msize[34]|msumsize[34]/.test(rendered)) {
    fonts.add('Size3-Regular'); fonts.add('Size4-Regular')
  }
  return fonts
}

function escapeRe(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') }

function buildInlinedCss(keptFonts) {
  let css = readFileSync(resolve(katexDist, 'katex.min.css'), 'utf8')
  let removed = 0, inlined = 0
  css = css.replace(/@font-face\{[^}]*\}/g, (block) => {
    // minified CSS has no space after "font-family:" and quotes are optional
    const famM = block.match(/font-family:(?:"([^"]+)"|([^;]+));/)
    // the woff2 source filename encodes the exact style variant we keep/drop
    const varM = block.match(/url\(fonts\/(KaTeX_[\w-]+)\.woff2\)/)
    if (!famM || !varM) return block
    const family = (famM[1] || famM[2]).trim()
    const variant = varM[1] // e.g. KaTeX_Main-Regular
    const stylePart = variant.replace(/^KaTeX_/, '') // e.g. Main-Regular
    if (!keptFonts.has(stylePart)) { removed++; return '' }
    inlined++
    const b64 = readFileSync(resolve(katexDist, `fonts/${variant}.woff2`)).toString('base64')
    return `@font-face{font-family:${family};src:url("data:font/woff2;base64,${b64}") format("woff2");font-display:block;}`
  })
  console.log(`  CSS: inlined ${inlined} fonts, dropped ${removed} font-faces`)
  return css
}

// ---- Resolve target page + formulas (CLI args override the default) --------
const [, , pageArg, formulasArg] = process.argv
let PAGE, FORMULAS
if (pageArg && formulasArg) {
  PAGE = resolve(PKG, pageArg)
  FORMULAS = JSON.parse(readFileSync(resolve(PKG, formulasArg), 'utf8'))
  if (!Array.isArray(FORMULAS) || !FORMULAS.every(f => f.label && f.tex)) {
    console.error('formulas.json must be an array of { "label", "tex" }')
    process.exit(1)
  }
} else {
  PAGE = resolve(PKG, 'public/study-design/propensity-matching.html')
  FORMULAS = DEFAULT_FORMULAS
}

let src = readFileSync(PAGE, 'utf8')

// 1) Strip a previous injection (if any) so the script is idempotent.
//    Consume trailing whitespace after </style> so re-injection is byte-identical.
if (/<style data-katex>/.test(src)) {
  src = src.replace(/<style data-katex>[\s\S]*?<\/style>\s*/g, '')
  console.log('  stripped prior katex <style> injection')
}

// 2) Render every formula once up front (also lets us pick the font set), then
//    replace each equation div (matched by its aria-label) with the KaTeX span.
const renderedAll = FORMULAS.map(f =>
  katex.renderToString(f.tex, { throwOnError: true, displayMode: false })
)
const keptFonts = fontsForRendered(renderedAll.join(''))
let replaced = 0
FORMULAS.forEach((f, i) => {
  const divRe = new RegExp(
    `<div class="equation"[^>]*aria-label="${escapeRe(f.label)}"[^>]*>[\\s\\S]*?</div>`
  )
  if (!divRe.test(src)) {
    console.error(`  MISSING equation div for: ${f.label.slice(0, 40)}...`)
    process.exit(1)
  }
  src = src.replace(divRe, () => `<div class="equation" role="math" aria-label="${f.label}">${renderedAll[i]}</div>`)
  replaced++
})
console.log(`  replaced ${replaced}/${FORMULAS.length} equation divs`)

// 3) Inject the inlined KaTeX CSS into <head>.
const css = buildInlinedCss(keptFonts)
src = src.replace('</head>', `<style data-katex>${css}</style>\n</head>`)

writeFileSync(PAGE, src)
console.log(`  wrote ${PAGE} (${Buffer.byteLength(src)} bytes)`)
