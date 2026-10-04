(() => {
  const article = document.querySelector('.article-body')
  if (!article) return

  const colors = ['yellow', 'blue', 'pink']
  const highlightNames = Object.fromEntries(colors.map(color => [color, `reader-highlight-${color}`]))
  const storageKey = `biostatistics-library:highlights:v1:${location.pathname}`
  const quickModeKey = 'biostatistics-library:quick-highlight:v1'
  const quickColorKey = 'biostatistics-library:quick-highlight-color:v1'
  const statusId = 'article-highlight-status'
  let highlights = readHighlights()
  let quickMode = readQuickMode()
  let quickColor = readQuickColor()
  let pending = null
  let selectionTimer = null
  let pointerDown = false
  let quickSelectionId = null

  const controls = document.createElement('div')
  controls.className = 'article-highlight-controls'
  controls.innerHTML = `<span id="${statusId}" aria-live="polite"></span><button type="button" data-quick-highlight aria-pressed="false">Quick highlight: Off</button><select data-quick-color aria-label="Quick highlight color" hidden><option value="yellow">Yellow</option><option value="blue">Blue</option><option value="pink">Pink</option></select><button type="button" data-clear-highlights>Clear highlights</button>`
  const toc = document.querySelector('.article-toc')
  if (toc) toc.insertAdjacentElement('afterend', controls)

  const toolbar = document.createElement('div')
  toolbar.className = 'article-highlight-toolbar'
  toolbar.setAttribute('role', 'toolbar')
  toolbar.setAttribute('aria-label', 'Highlight selected text')
  toolbar.hidden = true
  toolbar.innerHTML = `<span>Highlight:</span>${colors.map(color => `<button type="button" data-highlight-color="${color}" aria-label="Highlight ${color}" title="Highlight ${color}">${color}</button>`).join('')}<button type="button" data-remove-highlight hidden>Remove</button>`
  document.body.append(toolbar)

  function syncQuickModeStyles() {
    document.body.classList.toggle('quick-highlight-mode', quickMode)
    colors.forEach(color => document.body.classList.toggle(`quick-highlight-${color}`, quickMode && quickColor === color))
  }

  syncQuickModeStyles()

  function newId() {
    return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`
  }

  function readHighlights() {
    try {
      const value = JSON.parse(localStorage.getItem(storageKey) || '[]')
      return Array.isArray(value)
        ? value.filter(item => item && typeof item.quote === 'string' && colors.includes(item.color))
          .map(item => ({ ...item, id: item.id || newId() }))
        : []
    } catch {
      return []
    }
  }

  function readQuickMode() {
    try {
      return localStorage.getItem(quickModeKey) === 'true'
    } catch {
      return false
    }
  }

  function readQuickColor() {
    try {
      const color = localStorage.getItem(quickColorKey)
      return colors.includes(color) ? color : 'yellow'
    } catch {
      return 'yellow'
    }
  }

  function saveHighlights() {
    try {
      localStorage.setItem(storageKey, JSON.stringify(highlights))
      return true
    } catch {
      status.textContent = 'Could not save highlights in this browser.'
      return false
    }
  }

  const status = controls.querySelector(`#${statusId}`)

  function normalize(value) {
    return value.replace(/\s+/g, ' ').trim()
  }

  function makeTextMap() {
    const walker = document.createTreeWalker(article, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        return node.parentElement?.closest('pre, code, mjx-container, script, style')
          ? NodeFilter.FILTER_REJECT
          : NodeFilter.FILTER_ACCEPT
      },
    })
    let text = ''
    const starts = []
    const ends = []
    let node
    while ((node = walker.nextNode())) {
      for (let offset = 0; offset < node.textContent.length; offset += 1) {
        const character = node.textContent[offset]
        const point = { node, offset }
        const after = { node, offset: offset + 1 }
        if (/\s/.test(character)) {
          if (!text.length) continue
          if (text.endsWith(' ')) {
            ends[ends.length - 1] = after
            continue
          }
          text += ' '
          starts.push(point)
          ends.push(after)
        } else {
          text += character
          starts.push(point)
          ends.push(after)
        }
      }
    }
    if (text.endsWith(' ')) {
      text = text.slice(0, -1)
      starts.pop()
      ends.pop()
    }
    return { text, starts, ends }
  }

  function rangeFromOffsets(map, start, end) {
    if (start < 0 || end <= start || end > map.text.length) return null
    const range = document.createRange()
    range.setStart(map.starts[start].node, map.starts[start].offset)
    range.setEnd(map.ends[end - 1].node, map.ends[end - 1].offset)
    return range
  }

  function contextScore(expectedPrefix, expectedSuffix, text, start, end) {
    const before = text.slice(Math.max(0, start - 80), start)
    const after = text.slice(end, end + 80)
    let score = 0
    for (let length = 1; length <= Math.min(expectedPrefix.length, before.length); length += 1) {
      if (expectedPrefix.slice(-length) !== before.slice(-length)) break
      score = length
    }
    for (let length = 1; length <= Math.min(expectedSuffix.length, after.length); length += 1) {
      if (expectedSuffix.slice(0, length) !== after.slice(0, length)) break
      score += length
    }
    return score
  }

  function locateHighlight(item, map) {
    const quote = normalize(item.quote)
    if (!quote) return null
    const matches = []
    let start = map.text.indexOf(quote)
    while (start !== -1) {
      const end = start + quote.length
      matches.push({ start, end, score: contextScore(item.prefix || '', item.suffix || '', map.text, start, end) })
      start = map.text.indexOf(quote, start + 1)
    }
    if (!matches.length) return null
    matches.sort((a, b) => b.score - a.score)
    if (matches.length > 1 && matches[0].score === matches[1].score && matches[0].score < 8) return null
    return rangeFromOffsets(map, matches[0].start, matches[0].end)
  }

  function renderHighlights() {
    if (window.CSS?.highlights && typeof window.Highlight === 'function') {
      colors.forEach(color => CSS.highlights.delete(highlightNames[color]))
      const map = makeTextMap()
      for (const color of colors) {
        const ranges = highlights.filter(item => item.color === color)
          .map(item => locateHighlight(item, map)).filter(Boolean)
        if (ranges.length) CSS.highlights.set(highlightNames[color], new Highlight(...ranges))
      }
    }
    status.textContent = highlights.length
      ? `${highlights.length} highlight${highlights.length === 1 ? '' : 's'} saved on this device.`
      : 'Select text to highlight. Highlights are saved on this device.'
    controls.querySelector('[data-clear-highlights]').disabled = highlights.length === 0
    const quickButton = controls.querySelector('[data-quick-highlight]')
    quickButton.textContent = `Quick highlight: ${quickMode ? 'On' : 'Off'}`
    quickButton.setAttribute('aria-pressed', String(quickMode))
    const colorSelect = controls.querySelector('[data-quick-color]')
    colorSelect.hidden = !quickMode
    colorSelect.value = quickColor
  }

  function makeAnchor(range) {
    const before = document.createRange()
    before.selectNodeContents(article)
    before.setEnd(range.startContainer, range.startOffset)
    const after = document.createRange()
    after.selectNodeContents(article)
    after.setStart(range.endContainer, range.endOffset)
    return {
      quote: normalize(range.toString()),
      prefix: normalize(before.toString()).slice(-80),
      suffix: normalize(after.toString()).slice(0, 80),
    }
  }

  function findExisting(anchor) {
    return highlights.findIndex(item => item.quote === anchor.quote &&
      contextScore(item.prefix || '', item.suffix || '', `${anchor.prefix}${anchor.quote}${anchor.suffix}`, anchor.prefix.length, anchor.prefix.length + anchor.quote.length) >= 8)
  }

  function hideToolbar() {
    toolbar.hidden = true
    pending = null
  }

  function updateToolbar() {
    const selection = window.getSelection()
    if (!selection || selection.isCollapsed || !selection.rangeCount) {
      quickSelectionId = null
      return hideToolbar()
    }
    const range = selection.getRangeAt(0)
    if (!article.contains(range.startContainer) || !article.contains(range.endContainer)) {
      quickSelectionId = null
      return hideToolbar()
    }
    if ([...article.querySelectorAll('pre, code, mjx-container')].some(node => range.intersectsNode(node))) {
      quickSelectionId = null
      return hideToolbar()
    }
    const anchor = makeAnchor(range)
    if (anchor.quote.length < 2 || anchor.quote.length > 2000) return hideToolbar()
    pending = { range: range.cloneRange(), anchor }
    if (quickMode) {
      let currentIndex = highlights.findIndex(item => item.id === quickSelectionId)
      if (currentIndex === -1) {
        currentIndex = findExisting(anchor)
        if (currentIndex !== -1) quickSelectionId = highlights[currentIndex].id
      }
      if (currentIndex === -1) {
        const item = { ...anchor, color: quickColor, id: newId() }
        highlights.push(item)
        quickSelectionId = item.id
      } else {
        highlights[currentIndex] = { ...highlights[currentIndex], ...anchor, color: quickColor }
      }
      if (saveHighlights()) renderHighlights()
      hideToolbar()
      return
    }
    toolbar.querySelector('[data-remove-highlight]').hidden = findExisting(anchor) === -1
    toolbar.hidden = false
  }

  toolbar.addEventListener('pointerdown', event => event.preventDefault())
  toolbar.addEventListener('click', event => {
    const button = event.target.closest('button')
    if (!button || !pending) return
    if (button.dataset.highlightColor) {
      const existingIndex = findExisting(pending.anchor)
      if (existingIndex !== -1) highlights.splice(existingIndex, 1)
      highlights.push({ ...pending.anchor, color: button.dataset.highlightColor })
    } else if (button.hasAttribute('data-remove-highlight')) {
      const existingIndex = findExisting(pending.anchor)
      if (existingIndex !== -1) highlights.splice(existingIndex, 1)
    } else return
    if (saveHighlights()) renderHighlights()
    window.getSelection()?.removeAllRanges()
    hideToolbar()
  })

  controls.querySelector('[data-clear-highlights]').addEventListener('click', () => {
    highlights = []
    quickSelectionId = null
    saveHighlights()
    renderHighlights()
  })

  controls.querySelector('[data-quick-highlight]').addEventListener('click', () => {
    quickMode = !quickMode
    syncQuickModeStyles()
    quickSelectionId = null
    try {
      localStorage.setItem(quickModeKey, String(quickMode))
    } catch {
      status.textContent = 'Could not save this preference in the browser.'
    }
    renderHighlights()
    if (quickMode) hideToolbar()
  })

  controls.querySelector('[data-quick-color]').addEventListener('change', event => {
    quickColor = event.target.value
    syncQuickModeStyles()
    try {
      localStorage.setItem(quickColorKey, quickColor)
    } catch {
      status.textContent = 'Could not save this color preference in the browser.'
    }
  })

  document.addEventListener('selectionchange', () => {
    clearTimeout(selectionTimer)
    selectionTimer = setTimeout(() => {
      if (!quickMode || !pointerDown) updateToolbar()
    }, 140)
  })

  document.addEventListener('pointerdown', () => { pointerDown = true }, true)
  document.addEventListener('pointerup', () => {
    pointerDown = false
    if (quickMode) {
      clearTimeout(selectionTimer)
      selectionTimer = setTimeout(updateToolbar, 80)
    }
  }, true)
  document.addEventListener('pointercancel', () => { pointerDown = false }, true)

  renderHighlights()
})()
