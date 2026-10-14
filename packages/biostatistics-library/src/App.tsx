import { useMemo, useState } from 'react'
import Navbar from '../../shared/Navbar'
import { filterTopics, topicCount, topicTags } from './topics'

export default function App() {
  const [query, setQuery] = useState('')
  const [activeTags, setActiveTags] = useState<Set<string>>(new Set())
  const [tagsOpen, setTagsOpen] = useState(true)
  const topics = useMemo(() => filterTopics(query, activeTags), [query, activeTags])

  function toggleTag(tag: string) {
    setActiveTags(current => {
      const next = new Set(current)
      if (next.has(tag)) next.delete(tag)
      else next.add(tag)
      return next
    })
  }

  return <>
    <a className="skip-link" href="#topic-index">Skip to topic index</a>
    <Navbar breadcrumbs={[{ label: 'Biostatistics Library' }]} />
    <main id="topic-index" className="library-main">
      <header className="library-header">
        <div>
          <p className="eyebrow">BIOSTATISTICS · HEALTH RESEARCH</p>
          <h1>Biostatistics Library</h1>
          <p className="intro">Browse topics by name or use tags to find related methods.</p>
        </div>
        <div className="topic-total"><strong>{topicCount}</strong><span>topics</span></div>
      </header>

      <section className="directory" aria-label="Browse topics">
        <label className="search-box">
          <svg aria-hidden="true" viewBox="0 0 24 24" fill="none"><circle cx="10.5" cy="10.5" r="6.5" /><path d="m16 16 5 5" /></svg>
          <input type="search" aria-label="Search topics" placeholder="Search topics or tags" value={query} onChange={event => setQuery(event.target.value)} />
          {query && <button className="clear-search" onClick={() => setQuery('')} aria-label="Clear search">Clear</button>}
        </label>

        <div className={`tag-filter ${tagsOpen ? 'is-open' : 'is-closed'}`} aria-label="Filter by tag">
          <button className="tag-label" aria-expanded={tagsOpen} aria-controls="tag-options" onClick={() => setTagsOpen(open => !open)}>
            Tags <span className="tag-toggle-icon" aria-hidden="true">{tagsOpen ? '−' : '+'}</span>
          </button>
          <div id="tag-options" className="tag-options" hidden={!tagsOpen}>
            <button className={`tag-chip ${activeTags.size === 0 ? 'active' : ''}`} aria-pressed={activeTags.size === 0} onClick={() => setActiveTags(new Set())}>All</button>
            {topicTags.map(tag => <button key={tag} className={`tag-chip ${activeTags.has(tag) ? 'active' : ''}`} aria-pressed={activeTags.has(tag)} onClick={() => toggleTag(tag)}>{tag}</button>)}
          </div>
        </div>

        <div className="result-bar" aria-live="polite">
          <h2>Topics</h2>
          <span>{topics.length} of {topicCount}</span>
        </div>

        {topics.length > 0 ? <ul className="topic-list">
          {topics.map(topic => <li className="topic-card" key={topic.title}>
            {topic.href ? <a className="topic-title-link" href={topic.href}><h3>{topic.title}</h3><span aria-hidden="true">↗</span></a> : <h3>{topic.title}</h3>}
            <div className="topic-tags" aria-label={`Tags for ${topic.title}`}>
              {topic.tags.map(tag => <button key={tag} className={`topic-tag ${activeTags.has(tag) ? 'selected' : ''}`} aria-pressed={activeTags.has(tag)} onClick={() => toggleTag(tag)}>{tag}</button>)}
            </div>
          </li>)}
        </ul> : <div className="empty-state"><h3>No matching topics</h3><p>Clear the search or choose another tag.</p><button onClick={() => { setQuery(''); setActiveTags(new Set()) }}>Clear filters</button></div>}
      </section>

      <footer className="library-footer"><span>Biostatistics Library</span><a href="/">Back to Web Projects Hub ↗</a></footer>
    </main>
  </>
}
