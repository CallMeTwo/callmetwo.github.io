import { useState } from 'react'
import Navbar from '../../shared/Navbar'
import { articleHref, filterSections, sections, topicCount } from './topics'

export default function App() {
  const [query, setQuery] = useState('')
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set())
  const visibleSections = filterSections(query)
  const isSearching = query.trim().length > 0
  const visibleCount = visibleSections.reduce((sum, section) =>
    sum + section.groups.reduce((n, group) => n + group.topics.length, 0), 0)

  function toggleSection(id: string) {
    setCollapsed(previous => {
      const next = new Set(previous)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
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
      </aside>

      <main id="topic-index" className="main-content">
        <header className="hero">
          <h1>Biostatistics Library</h1>
          <div className="library-meta"><span><strong>{sections.length}</strong> subject areas</span><span><strong>{topicCount}</strong> articles</span></div>
        </header>

        <section className="index-tools" aria-label="Find topics">
          <div className="search-box"><svg aria-hidden="true" viewBox="0 0 24 24" fill="none"><circle cx="10.5" cy="10.5" r="6.5" /><path d="m16 16 5 5" /></svg><input id="topic-search" type="search" aria-label="Search biostatistics topics" placeholder="Search topics, e.g. regression or study design" value={query} onChange={event => setQuery(event.target.value)} />{query && <button className="clear-search" onClick={() => setQuery('')} aria-label="Clear search">Clear</button>}</div>
          <div className="index-heading"><div><h2>Topics</h2>{isSearching && <p role="status">{`${visibleCount} matching ${visibleCount === 1 ? 'topic' : 'topics'} in ${visibleSections.length} subject ${visibleSections.length === 1 ? 'area' : 'areas'}`}</p>}</div><div className="tree-actions"><button disabled={isSearching} onClick={() => setCollapsed(new Set())}>Expand all</button><span aria-hidden="true">/</span><button disabled={isSearching} onClick={() => setCollapsed(new Set(sections.map(section => section.id)))}>Collapse all</button></div></div>
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
                <div className="topic-groups">{section.groups.map(group => <div className="topic-group" key={group.title}><h4>{group.title}</h4><ul>{group.topics.map(topic => <li key={topic}><a className="topic-link" href={articleHref(section.id, topic)}><span>{topic}</span><span className="topic-arrow" aria-hidden="true">↗</span></a></li>)}</ul></div>)}</div>
              </div>
            </section>
          })}
          {visibleSections.length === 0 && <div className="empty-state"><h3>No topics found</h3><p>Try a broader term such as “data”, “test” or “regression”.</p><button onClick={() => setQuery('')}>Show all topics</button></div>}
        </div>
        <footer className="library-footer"><span>Biostatistics Library</span><a href="/">Back to Web Projects Hub ↗</a></footer>
      </main>
    </div>
  </>
}
