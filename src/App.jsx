import { useState, useEffect } from 'react'
import { HashRouter, Routes, Route } from 'react-router-dom'
import Navigation from './components/Navigation'
import Footer from './components/Footer'
import OnboardingModal from './components/OnboardingModal'
import HomePage from './pages/HomePage'
import VersesPage from './pages/VersesPage'
import ReviewPage from './pages/ReviewPage'
import ProgressPage from './pages/ProgressPage'
import './App.css'

const INTERVALS = { again: 1, hard: 3, good: 7, easy: 14 }

function addDays(dateStr, days) {
  const d = dateStr ? new Date(dateStr) : new Date()
  d.setDate(d.getDate() + days)
  return d.toISOString().split('T')[0]
}

const TODAY = new Date().toISOString().split('T')[0]

const SAMPLE_VERSES = [
  {
    id: 1,
    reference: 'John 3:16',
    text: 'For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life.',
    tags: ['love', 'salvation', 'faith'],
    dateAdded: '2026-03-15',
    lastReviewed: '2026-04-21',
    timesReviewed: 12,
    memorized: true,
    nextReviewDate: TODAY,
    interval: 7,
  },
  {
    id: 2,
    reference: 'Philippians 4:13',
    text: 'I can do all things through Christ which strengtheneth me.',
    tags: ['strength', 'faith'],
    dateAdded: '2026-03-20',
    lastReviewed: '2026-04-20',
    timesReviewed: 8,
    memorized: true,
    nextReviewDate: TODAY,
    interval: 7,
  },
  {
    id: 3,
    reference: 'Psalm 23:1',
    text: 'The Lord is my shepherd; I shall not want.',
    tags: ['comfort', 'trust'],
    dateAdded: '2026-04-01',
    lastReviewed: '2026-04-19',
    timesReviewed: 4,
    memorized: false,
    nextReviewDate: TODAY,
    interval: 3,
  },
  {
    id: 4,
    reference: 'Proverbs 3:5-6',
    text: 'Trust in the Lord with all thine heart; and lean not unto thine own understanding. In all thy ways acknowledge him, and he shall direct thy paths.',
    tags: ['trust', 'wisdom'],
    dateAdded: '2026-04-03',
    lastReviewed: null,
    timesReviewed: 1,
    memorized: false,
    nextReviewDate: addDays(TODAY, 2),
    interval: 3,
  },
  {
    id: 5,
    reference: 'Romans 8:28',
    text: 'And we know that all things work together for good to them that love God, to them who are the called according to his purpose.',
    tags: ['faith', 'hope'],
    dateAdded: '2026-04-05',
    lastReviewed: null,
    timesReviewed: 0,
    memorized: false,
    nextReviewDate: null,
    interval: null,
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
  const [streak, setStreak] = useState(() => loadFromStorage('streak', { current: 3, best: 7, lastDate: '2026-04-21' }))
  const [reviewHistory, setReviewHistory] = useState(() => loadFromStorage('reviewHistory', [
    { date: '2026-04-17', count: 2 },
    { date: '2026-04-18', count: 4 },
    { date: '2026-04-19', count: 3 },
    { date: '2026-04-20', count: 5 },
    { date: '2026-04-21', count: 4 },
  ]))
  const [showOnboarding, setShowOnboarding] = useState(() => !loadFromStorage('onboardingSeen', false))

  const handleCloseOnboarding = () => {
    setShowOnboarding(false)
    localStorage.setItem('onboardingSeen', JSON.stringify(true))
  }

  useEffect(() => { localStorage.setItem('verses', JSON.stringify(verses)) }, [verses])
  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode))
    document.body.className = darkMode ? 'dark-mode' : ''
  }, [darkMode])
  useEffect(() => { localStorage.setItem('streak', JSON.stringify(streak)) }, [streak])
  useEffect(() => { localStorage.setItem('reviewHistory', JSON.stringify(reviewHistory)) }, [reviewHistory])

  const addVerse = (verse) => {
    setVerses([...verses, {
      ...verse,
      id: Date.now(),
      dateAdded: TODAY,
      lastReviewed: null,
      timesReviewed: 0,
      memorized: false,
      nextReviewDate: null,
      interval: null,
    }])
  }

  const deleteVerse = (id) => setVerses(verses.filter(v => v.id !== id))

  const toggleMemorized = (id) => {
    setVerses(verses.map(v => v.id === id ? { ...v, memorized: !v.memorized } : v))
  }

  const markReviewed = (id, rating = 'good') => {
    const today = new Date().toISOString().split('T')[0]
    const days = INTERVALS[rating]
    const nextReviewDate = addDays(today, days)

    setVerses(verses.map(v => v.id === id ? {
      ...v,
      lastReviewed: today,
      timesReviewed: v.timesReviewed + 1,
      nextReviewDate,
      interval: days,
    } : v))

    setReviewHistory(prev => {
      const existing = prev.find(r => r.date === today)
      if (existing) return prev.map(r => r.date === today ? { ...r, count: r.count + 1 } : r)
      return [...prev, { date: today, count: 1 }]
    })

    setStreak(prev => {
      const yesterday = addDays(today, -1)
      if (prev.lastDate === today) return prev
      const newCurrent = prev.lastDate === yesterday ? prev.current + 1 : 1
      return { current: newCurrent, best: Math.max(prev.best, newCurrent), lastDate: today }
    })
  }

  return (
    <HashRouter>
      <div className={darkMode ? 'app dark-mode' : 'app'}>
        <a href="#main-content" className="skip-link">Skip to main content</a>
        <Navigation darkMode={darkMode} setDarkMode={setDarkMode} />
        <main id="main-content">
          <Routes>
            <Route path="/" element={<HomePage verses={verses} streak={streak} />} />
            <Route path="/verses" element={<VersesPage verses={verses} addVerse={addVerse} deleteVerse={deleteVerse} toggleMemorized={toggleMemorized} />} />
            <Route path="/review" element={<ReviewPage verses={verses} markReviewed={markReviewed} toggleMemorized={toggleMemorized} />} />
            <Route path="/progress" element={<ProgressPage verses={verses} streak={streak} reviewHistory={reviewHistory} />} />
          </Routes>
        </main>
        <Footer />
        <OnboardingModal show={showOnboarding} onClose={handleCloseOnboarding} />
      </div>
    </HashRouter>
  )
}

export default App
