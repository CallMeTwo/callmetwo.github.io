// Pre-render the propensity-matching page's math with KaTeX at BUILD time,
// then inline a pruned KaTeX CSS + base64 woff2 fonts so the page stays
// fully self-contained (no runtime JS, no external fetch, no separate font files).
//
// Idempotent: re-running strips any previous injection and re-injects from the
// canonical FORMULAS list below (matched by the equation div's aria-label).
//
// Run: node scripts/inject-katex.js   (or `npm run katex:inject`)

import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'
import katex from 'katex'

const __dirname = dirname(fileURLToPath(import.meta.url))
const PAGE = resolve(__dirname, '../public/study-design/propensity-matching.html')

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

// Canonical formula list. aria-labels MUST match the <div class="equation" aria-label="..."> in the page.
const FORMULAS = [
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

// Fonts we actually need for these 6 simple formulas. Everything else
// (AMS, Caligraphic, Fraktur, Script, SansSerif, Typewriter, Size3/4) is dropped.
const KEPT_FONTS = new Set([
  'Main-Regular', 'Main-Italic', 'Main-Bold',
  'Math-Italic', 'Math-BoldItalic',
  'Size1-Regular', 'Size2-Regular'
])

function escapeRe(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') }

function buildInlinedCss() {
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
    // KEPT_FONTS holds style variants (Main-Regular, Math-Italic, Size1-Regular, ...)
    if (!KEPT_FONTS.has(stylePart)) { removed++; return '' }
    inlined++
    const b64 = readFileSync(resolve(katexDist, `fonts/${variant}.woff2`)).toString('base64')
    return `@font-face{font-family:${family};src:url("data:font/woff2;base64,${b64}") format("woff2");font-display:block;}`
  })
  console.log(`  CSS: inlined ${inlined} fonts, dropped ${removed} font-faces`)
  return css
}

let src = readFileSync(PAGE, 'utf8')

// 1) Strip a previous injection (if any) so the script is idempotent.
//    Consume trailing whitespace after </style> so re-injection is byte-identical.
if (/<style data-katex>/.test(src)) {
  src = src.replace(/<style data-katex>[\s\S]*?<\/style>\s*/g, '')
  console.log('  stripped prior katex <style> injection')
}

// 2) Replace each equation div (matched by its aria-label) with a pre-rendered KaTeX span.
let replaced = 0
for (const f of FORMULAS) {
  const katexHtml = katex.renderToString(f.tex, { throwOnError: true, displayMode: false })
  const divRe = new RegExp(
    `<div class="equation"[^>]*aria-label="${escapeRe(f.label)}"[^>]*>[\\s\\S]*?</div>`
  )
  if (!divRe.test(src)) {
    console.error(`  MISSING equation div for: ${f.label.slice(0, 40)}...`)
    process.exit(1)
  }
  src = src.replace(divRe, () => `<div class="equation" role="math" aria-label="${f.label}">${katexHtml}</div>`)
  replaced++
}
console.log(`  replaced ${replaced}/${FORMULAS.length} equation divs`)

// 3) Inject the inlined KaTeX CSS into <head>.
const css = buildInlinedCss()
src = src.replace('</head>', `<style data-katex>${css}</style>\n</head>`)

writeFileSync(PAGE, src)
console.log(`  wrote ${PAGE} (${Buffer.byteLength(src)} bytes)`)
