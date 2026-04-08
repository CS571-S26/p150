import { useState, useEffect } from 'react'
import { HashRouter, Routes, Route } from 'react-router-dom'
import Navigation from './components/Navigation'
import HomePage from './pages/HomePage'
import VersesPage from './pages/VersesPage'
import ReviewPage from './pages/ReviewPage'
import ProgressPage from './pages/ProgressPage'
import './App.css'

const SAMPLE_VERSES = [
  {
    id: 1,
    reference: 'John 3:16',
    text: 'For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life.',
    tags: ['love', 'salvation', 'faith'],
    dateAdded: '2026-03-15',
    lastReviewed: '2026-04-07',
    timesReviewed: 12,
    memorized: true,
  },
  {
    id: 2,
    reference: 'Philippians 4:13',
    text: 'I can do all this through him who gives me strength.',
    tags: ['strength', 'faith'],
    dateAdded: '2026-03-20',
    lastReviewed: '2026-04-06',
    timesReviewed: 8,
    memorized: true,
  },
  {
    id: 3,
    reference: 'Psalm 23:1',
    text: 'The Lord is my shepherd, I lack nothing.',
    tags: ['comfort', 'trust'],
    dateAdded: '2026-04-01',
    lastReviewed: '2026-04-05',
    timesReviewed: 4,
    memorized: false,
  },
  {
    id: 4,
    reference: 'Proverbs 3:5-6',
    text: 'Trust in the Lord with all your heart and lean not on your own understanding; in all your ways submit to him, and he will make your paths straight.',
    tags: ['trust', 'wisdom'],
    dateAdded: '2026-04-03',
    lastReviewed: null,
    timesReviewed: 1,
    memorized: false,
  },
  {
    id: 5,
    reference: 'Romans 8:28',
    text: 'And we know that in all things God works for the good of those who love him, who have been called according to his purpose.',
    tags: ['faith', 'hope'],
    dateAdded: '2026-04-05',
    lastReviewed: null,
    timesReviewed: 0,
    memorized: false,
  },
]

function loadFromStorage(key, fallback) {
  try {
    const stored = localStorage.getItem(key)
    return stored ? JSON.parse(stored) : fallback
  } catch {
    return fallback
  }
}

function App() {
  const [darkMode, setDarkMode] = useState(() => loadFromStorage('darkMode', false))
  const [verses, setVerses] = useState(() => loadFromStorage('verses', SAMPLE_VERSES))
  const [streak, setStreak] = useState(() => loadFromStorage('streak', { current: 3, best: 7, lastDate: '2026-04-07' }))
  const [reviewHistory, setReviewHistory] = useState(() => loadFromStorage('reviewHistory', [
    { date: '2026-04-05', count: 3 },
    { date: '2026-04-06', count: 5 },
    { date: '2026-04-07', count: 4 },
  ]))

  useEffect(() => {
    localStorage.setItem('verses', JSON.stringify(verses))
  }, [verses])

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode))
    document.body.className = darkMode ? 'dark-mode' : ''
  }, [darkMode])

  useEffect(() => {
    localStorage.setItem('streak', JSON.stringify(streak))
  }, [streak])

  useEffect(() => {
    localStorage.setItem('reviewHistory', JSON.stringify(reviewHistory))
  }, [reviewHistory])

  const addVerse = (verse) => {
    setVerses([...verses, { ...verse, id: Date.now(), dateAdded: new Date().toISOString().split('T')[0], lastReviewed: null, timesReviewed: 0, memorized: false }])
  }

  const deleteVerse = (id) => {
    setVerses(verses.filter(v => v.id !== id))
  }

  const toggleMemorized = (id) => {
    setVerses(verses.map(v => v.id === id ? { ...v, memorized: !v.memorized } : v))
  }

  const markReviewed = (id) => {
    const today = new Date().toISOString().split('T')[0]
    setVerses(verses.map(v => v.id === id ? { ...v, lastReviewed: today, timesReviewed: v.timesReviewed + 1 } : v))

    setReviewHistory(prev => {
      const existing = prev.find(r => r.date === today)
      if (existing) {
        return prev.map(r => r.date === today ? { ...r, count: r.count + 1 } : r)
      }
      return [...prev, { date: today, count: 1 }]
    })

    setStreak(prev => {
      const today = new Date().toISOString().split('T')[0]
      if (prev.lastDate === today) return prev
      const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0]
      const newCurrent = prev.lastDate === yesterday ? prev.current + 1 : 1
      return { current: newCurrent, best: Math.max(prev.best, newCurrent), lastDate: today }
    })
  }

  return (
    <HashRouter>
      <div className={darkMode ? 'app dark-mode' : 'app'}>
        <Navigation darkMode={darkMode} setDarkMode={setDarkMode} />
        <Routes>
          <Route path="/" element={<HomePage verses={verses} streak={streak} />} />
          <Route path="/verses" element={<VersesPage verses={verses} addVerse={addVerse} deleteVerse={deleteVerse} toggleMemorized={toggleMemorized} />} />
          <Route path="/review" element={<ReviewPage verses={verses} markReviewed={markReviewed} toggleMemorized={toggleMemorized} />} />
          <Route path="/progress" element={<ProgressPage verses={verses} streak={streak} reviewHistory={reviewHistory} />} />
        </Routes>
      </div>
    </HashRouter>
  )
}

export default App
