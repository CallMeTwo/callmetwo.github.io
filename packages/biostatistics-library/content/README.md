# Article content

One markdown file per topic. File layout mirrors the topic map:

    content/<section-id>/<slug>.md

where `<slug>` is derived from the topic title (lowercase, spaces/punctuation
to hyphens, e.g. "What is biostatistics?" -> `what-is-biostatistics`).
The build script matches files to topics automatically — a file that does not
match a topic title fails the build.

## Frontmatter

    ---
    title: What is biostatistics?          # must match the topic title
    summary: One-line description shown in the topic map.
    ---

`summary` is optional but recommended (used as the <meta> description and the
card blurb).

## Body

Standard markdown: headings, lists, tables, code blocks, math in `<p>` text.
Use `##` for section headings (the title itself becomes the `<h1>`).

### Links

Markdown links are fully supported. During the build:

- **External links** (`http`/`https`) open in a new tab and get a small ↗
  marker.
- **Internal links** to other articles work with relative paths, e.g.
  `[Confidence intervals](../inference/confidence-intervals.html)`. Keep the
  `.html` extension in internal links — the static page exists at exactly that
  path.

## Adding an article

1. Write `content/<section-id>/<slug>.md`
2. `npm run build -w biostatistics-library`
3. The page is generated at `dist/<section-id>/<slug>.html`
4. Copy to root `/biostatistics-library/` and push (see deploy.sh)

Topics without a content file keep the "Planned article" placeholder in the
topic map.
