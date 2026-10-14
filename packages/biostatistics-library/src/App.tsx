import { useMemo, useState } from 'react'
import Navbar from '../../shared/Navbar'
import { filterTopics, topicCount, topicTags } from './topics'

export default function App() {
  const [query, setQuery] = useState('')
  const [activeTag, setActiveTag] = useState<string | null>(null)
  const topics = useMemo(() => filterTopics(query, activeTag), [query, activeTag])

  function toggleTag(tag: string) {
    setActiveTag(current => current === tag ? null : tag)
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

        <div className="tag-filter" aria-label="Filter by tag">
          <span className="tag-label">Tags</span>
          <button className={`tag-chip ${activeTag === null ? 'active' : ''}`} aria-pressed={activeTag === null} onClick={() => setActiveTag(null)}>All</button>
          {topicTags.map(tag => <button key={tag} className={`tag-chip ${activeTag === tag ? 'active' : ''}`} aria-pressed={activeTag === tag} onClick={() => toggleTag(tag)}>{tag}</button>)}
        </div>

        <div className="result-bar" aria-live="polite">
          <h2>Topics</h2>
          <span>{topics.length} of {topicCount}</span>
        </div>

        {topics.length > 0 ? <ul className="topic-list">
          {topics.map(topic => <li className="topic-card" key={topic.title}>
            <h3>{topic.title}</h3>
            <div className="topic-tags" aria-label={`Tags for ${topic.title}`}>
              {topic.tags.map(tag => <button key={tag} className={`topic-tag ${activeTag === tag ? 'selected' : ''}`} aria-pressed={activeTag === tag} onClick={() => toggleTag(tag)}>{tag}</button>)}
            </div>
          </li>)}
        </ul> : <div className="empty-state"><h3>No matching topics</h3><p>Clear the search or choose another tag.</p><button onClick={() => { setQuery(''); setActiveTag(null) }}>Clear filters</button></div>}
      </section>

      <footer className="library-footer"><span>Biostatistics Library</span><a href="/">Back to Web Projects Hub ↗</a></footer>
    </main>
  </>
}
