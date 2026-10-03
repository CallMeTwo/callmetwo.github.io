import { useEffect, useRef, useState } from 'react'
import Navbar from '../../shared/Navbar'
import { filterSections, sections, topicCount } from './topics'

interface ArticlePreview { title: string; section: string; group: string }

export default function App() {
  const [query, setQuery] = useState('')
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set())
  const [article, setArticle] = useState<ArticlePreview | null>(null)
  const dialog = useRef<HTMLDialogElement>(null)
  const visibleSections = filterSections(query)
  const isSearching = query.trim().length > 0
  const visibleCount = visibleSections.reduce((sum, section) =>
    sum + section.groups.reduce((n, group) => n + group.topics.length, 0), 0)

  useEffect(() => {
    if (article && !dialog.current?.open) dialog.current?.showModal()
  }, [article])

  function toggleSection(id: string) {
    setCollapsed(previous => {
      const next = new Set(previous)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function closeArticle() {
    dialog.current?.close()
    setArticle(null)
  }

  return <>
    <a className="skip-link" href="#topic-index">Skip to topic index</a>
    <Navbar breadcrumbs={[{ label: 'Biostatistics Library' }]} />
    <div className="library-shell">
      <aside className="sidebar" aria-label="Library navigation">
        <a className="library-brand" href="./" aria-label="Biostatistics Library home">
          <span className="brand-icon" aria-hidden="true">B<span>∑</span></span>
          <span>Biostatistics<br /><strong>Library</strong></span>
        </a>
        <div className="nav-label">CONTENTS</div>
        <a className="overview-link" href="#topic-index">All topics <span>{topicCount}</span></a>
        <nav aria-label="Topic sections" className="section-nav">
          {sections.map((section, index) => <a key={section.id} href={`#${section.id}`} onClick={() => {
            setQuery('')
            setCollapsed(previous => { const next = new Set(previous); next.delete(section.id); return next })
          }}><span>{String(index + 1).padStart(2, '0')}</span>{section.title}</a>)}
        </nav>
        <div className="sidebar-note"><span className="small-dot" /> A library in the making<p>A starting map for learning, exploring and revisiting biostatistics.</p></div>
      </aside>

      <main id="topic-index" className="main-content">
        <header className="hero">
          <div className="eyebrow">THE KNOWLEDGE INDEX <span>Prototype</span></div>
          <h1>Biostatistics Library</h1>
          <p className="hero-description">A place to make sense of data, evidence and uncertainty.<br className="desktop-break" /> Explore the topic map, from first principles to applied methods.</p>
          <div className="library-meta"><span><strong>{sections.length}</strong> subject areas</span><span><strong>{topicCount}</strong> planned articles</span><span>From foundations to practice</span></div>
        </header>

        <div className="prototype-note"><span className="note-symbol" aria-hidden="true">i</span><p><strong>First look: the library’s structure.</strong> This is a draft topic map. Select any topic to preview the article layout; full content and references will come later.</p></div>

        <section className="index-tools" aria-label="Find topics">
          <label className="search-label" htmlFor="topic-search">Find a topic</label>
          <div className="search-box"><svg aria-hidden="true" viewBox="0 0 24 24" fill="none"><circle cx="10.5" cy="10.5" r="6.5" /><path d="m16 16 5 5" /></svg><input id="topic-search" type="search" placeholder="Search topics, e.g. regression or study design" value={query} onChange={event => setQuery(event.target.value)} />{query && <button className="clear-search" onClick={() => setQuery('')} aria-label="Clear search">Clear</button>}</div>
          <div className="index-heading"><div><h2>Browse the topic map</h2><p role="status">{isSearching ? `${visibleCount} matching ${visibleCount === 1 ? 'topic' : 'topics'} in ${visibleSections.length} subject ${visibleSections.length === 1 ? 'area' : 'areas'}` : 'A hierarchy of subjects, subtopics and planned articles.'}</p></div><div className="tree-actions"><button disabled={isSearching} onClick={() => setCollapsed(new Set())}>Expand all</button><span aria-hidden="true">/</span><button disabled={isSearching} onClick={() => setCollapsed(new Set(sections.map(section => section.id)))}>Collapse all</button></div></div>
        </section>

        <div className="topic-tree">
          {visibleSections.map(section => {
            const isOpen = isSearching || !collapsed.has(section.id)
            const number = sections.findIndex(item => item.id === section.id) + 1
            const count = section.groups.reduce((sum, group) => sum + group.topics.length, 0)
            return <section key={section.id} id={section.id} className="topic-section">
              <h3><button className="section-toggle" aria-expanded={isOpen} aria-controls={`${section.id}-topics`} onClick={() => toggleSection(section.id)} disabled={isSearching}>
                <span className="section-number">{String(number).padStart(2, '0')}</span><span className="section-title">{section.title}<span className="section-description">{section.description}</span></span><span className="article-count">{count} {count === 1 ? 'topic' : 'topics'}</span><span className={`chevron ${isOpen ? 'open' : ''}`} aria-hidden="true">⌄</span>
              </button></h3>
              <div id={`${section.id}-topics`} hidden={!isOpen}>
                <div className="topic-groups">{section.groups.map(group => <div className="topic-group" key={group.title}><h4>{group.title}</h4><ul>{group.topics.map(topic => <li key={topic}><button className="topic-link" onClick={() => setArticle({ title: topic, section: section.title, group: group.title })}><span>{topic}</span><span className="topic-arrow" aria-hidden="true">↗</span></button></li>)}</ul></div>)}</div>
              </div>
            </section>
          })}
          {visibleSections.length === 0 && <div className="empty-state"><h3>No topics found</h3><p>Try a broader term such as “data”, “test” or “regression”.</p><button onClick={() => setQuery('')}>Show all topics</button></div>}
        </div>
        <footer className="library-footer"><span>Biostatistics Library · Draft topic index</span><a href="/">Back to Web Projects Hub ↗</a></footer>
      </main>
    </div>

    <dialog ref={dialog} className="article-dialog" aria-labelledby="article-title" onCancel={closeArticle} onClose={() => setArticle(null)}>
      {article && <><div className="dialog-top"><span>ARTICLE PREVIEW</span><button autoFocus onClick={closeArticle} aria-label="Close article preview">Close ×</button></div><p className="article-breadcrumb">{article.section} / {article.group}</p><h2 id="article-title">{article.title}</h2><span className="draft-badge">Planned article</span><p className="article-intro">This page is a placeholder. The article will explain the topic with examples, interpretation notes and sources.</p><div className="article-outline"><h3>On this page</h3><ol><li>Overview and key ideas</li><li>When to use it</li><li>Assumptions and limitations</li><li>Worked example</li><li>Interpretation and common pitfalls</li><li>References and further reading</li></ol></div><p className="article-note">Dummy content for reviewing the library structure.</p><button className="primary-button" onClick={closeArticle}>Back to topic map</button></>}
    </dialog>
  </>
}
