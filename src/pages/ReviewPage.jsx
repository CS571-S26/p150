import { useState, useMemo } from 'react'
import { Container, Card, Button, ProgressBar, Alert, Badge, Form } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import TagBadge from '../components/TagBadge'
import EmptyState from '../components/EmptyState'

function normalizeWord(w) {
  return w.toLowerCase().replace(/[.,;:!?'"()\-]/g, '').trim()
}

function compareWords(userText, verseText) {
  const verseWords = verseText.trim().split(/\s+/)
  const userWords = userText.trim() === '' ? [] : userText.trim().split(/\s+/).map(normalizeWord)
  return verseWords.map((word, i) => ({
    original: word,
    correct: normalizeWord(word) === (userWords[i] || ''),
  }))
}

function makeHint(text) {
  return text.replace(/[a-zA-Z]+/g, (word) =>
    word[0] + '_'.repeat(word.length - 1)
  )
}

const SRS_BUTTONS = [
  { rating: 'again', label: 'Again', variant: 'outline-danger', days: '1 day' },
  { rating: 'hard', label: 'Hard', variant: 'outline-warning', days: '3 days' },
  { rating: 'good', label: 'Good', variant: 'outline-primary', days: '7 days' },
  { rating: 'easy', label: 'Easy', variant: 'outline-success', days: '14 days' },
]

function ReviewPage({ verses, markReviewed, toggleMemorized }) {
  const [quizMode, setQuizMode] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showText, setShowText] = useState(false)
  const [showHint, setShowHint] = useState(false)
  const [userAnswer, setUserAnswer] = useState('')
  const [checked, setChecked] = useState(false)
  const [reviewedInSession, setReviewedInSession] = useState(new Set())

  const today = new Date().toISOString().split('T')[0]

  const reviewQueue = useMemo(() => {
    const due = verses.filter(v => !v.nextReviewDate || v.nextReviewDate <= today)
    const upcoming = verses.filter(v => v.nextReviewDate && v.nextReviewDate > today)
    due.sort((a, b) => (a.timesReviewed - b.timesReviewed))
    return [...due, ...upcoming]
  }, [verses, today])

  const dueCount = useMemo(
    () => verses.filter(v => !v.nextReviewDate || v.nextReviewDate <= today).length,
    [verses, today]
  )

  if (reviewQueue.length === 0) {
    return (
      <Container className="py-4">
        <h1 className="h2 mb-3">Daily Review</h1>
        <EmptyState
          icon="✨"
          title="No verses yet"
          message="Add some verses to start memorizing. Then come back here to review them."
          actionLabel="Add Verses"
          onAction={() => window.location.hash = '#/verses'}
        />
      </Container>
    )
  }

  const idx = currentIndex % reviewQueue.length
  const currentVerse = reviewQueue[idx]
  const progress = reviewQueue.length > 0
    ? Math.round((reviewedInSession.size / Math.max(dueCount, 1)) * 100)
    : 0

  const quizResult = checked ? compareWords(userAnswer, currentVerse.text) : null
  const quizScore = quizResult
    ? Math.round(quizResult.filter(w => w.correct).length / quizResult.length * 100)
    : null

  const goNext = () => {
    setShowText(false)
    setShowHint(false)
    setUserAnswer('')
    setChecked(false)
    setCurrentIndex(idx + 1)
  }

  const handleRate = (rating) => {
    markReviewed(currentVerse.id, rating)
    setReviewedInSession(new Set([...reviewedInSession, currentVerse.id]))
    goNext()
  }

  const handleCheck = () => {
    setChecked(true)
    setShowText(true)
  }

  const switchMode = () => {
    setQuizMode(!quizMode)
    setShowText(false)
    setShowHint(false)
    setUserAnswer('')
    setChecked(false)
  }

  const isDue = !currentVerse.nextReviewDate || currentVerse.nextReviewDate <= today

  return (
    <Container className="py-4" style={{ maxWidth: 700 }}>
      <header className="d-flex justify-content-between align-items-center mb-3">
        <h1 className="h2 mb-0">
          Daily Review
          {dueCount > 0 && <Badge bg="danger" className="ms-2">{dueCount} due</Badge>}
        </h1>
        <Form.Check
          type="switch"
          id="quiz-mode-switch"
          label="Quiz Mode"
          checked={quizMode}
          onChange={switchMode}
          className="fs-6"
          aria-label={`Quiz mode is ${quizMode ? 'on' : 'off'}`}
        />
      </header>

      <div className="mb-3">
        <div className="d-flex justify-content-between mb-1">
          <small className="text-muted">Session progress</small>
          <small className="text-muted">{reviewedInSession.size} / {dueCount} due</small>
        </div>
        <ProgressBar now={Math.min(progress, 100)} variant="success" />
      </div>

      {reviewedInSession.size >= dueCount && dueCount > 0 && (
        <Alert variant="success" className="mb-3">
          All due verses reviewed! Great work. Keep going for extra practice.
        </Alert>
      )}

      <Card className="review-card">
        <Card.Body className="py-4 px-4">

          <div className="d-flex justify-content-between align-items-start mb-3">
            <h2 className="h3 verse-reference mb-0">{currentVerse.reference}</h2>
            <div className="d-flex flex-column align-items-end gap-1">
              {currentVerse.memorized && <Badge bg="success">Memorized</Badge>}
              {isDue
                ? <Badge bg="danger">Due today</Badge>
                : <Badge bg="secondary">Next: {currentVerse.nextReviewDate}</Badge>
              }
            </div>
          </div>

          <div className="d-flex flex-wrap gap-1 mb-4">
            {currentVerse.tags.map(tag => <TagBadge key={tag} tag={tag} />)}
          </div>

          {/* --- QUIZ MODE --- */}
          {quizMode && (
            <>
              {!checked ? (
                <>
                  <Form.Group className="mb-3">
                    <Form.Label htmlFor="quiz-answer" className="text-muted">
                      Type the verse from memory:
                    </Form.Label>
                    <Form.Control
                      id="quiz-answer"
                      as="textarea"
                      rows={4}
                      placeholder="Start typing..."
                      value={userAnswer}
                      onChange={(e) => setUserAnswer(e.target.value)}
                      autoFocus
                      aria-describedby="quiz-help"
                    />
                    <Form.Text id="quiz-help" className="text-muted">
                      Press Check Answer when you're done.
                    </Form.Text>
                  </Form.Group>
                  <Button variant="primary" onClick={handleCheck} disabled={!userAnswer.trim()}>
                    Check Answer
                  </Button>
                </>
              ) : (
                <>
                  <div className="quiz-score mb-3" role="status" aria-live="polite">
                    <span className={`fs-4 fw-bold ${quizScore >= 80 ? 'text-success' : quizScore >= 50 ? 'text-warning' : 'text-danger'}`}>
                      {quizScore}% correct
                    </span>
                  </div>
                  <div className="quiz-result mb-4 p-3 rounded" aria-label="Verse with correctness highlighting">
                    {quizResult.map((w, i) => (
                      <span
                        key={i}
                        className={`quiz-word ${w.correct ? 'quiz-correct' : 'quiz-incorrect'}`}
                        aria-label={w.correct ? `${w.original} correct` : `${w.original} incorrect`}
                      >
                        {w.original}{' '}
                      </span>
                    ))}
                  </div>
                </>
              )}
            </>
          )}

          {/* --- NORMAL MODE --- */}
          {!quizMode && (
            <>
              {showText ? (
                <p className="verse-text-large mb-4">{currentVerse.text}</p>
              ) : showHint ? (
                <>
                  <p className="hint-text mb-3" aria-label="Hint: first letter of each word">
                    {makeHint(currentVerse.text)}
                  </p>
                  <Button
                    variant="primary"
                    size="lg"
                    className="w-100 mb-4"
                    onClick={() => setShowText(true)}
                  >
                    Reveal Full Verse
                  </Button>
                </>
              ) : (
                <div className="d-flex gap-2 mb-4">
                  <Button
                    variant="outline-secondary"
                    size="lg"
                    className="flex-fill"
                    onClick={() => setShowHint(true)}
                  >
                    Show Hint
                  </Button>
                  <Button
                    variant="outline-primary"
                    size="lg"
                    className="flex-fill"
                    onClick={() => setShowText(true)}
                  >
                    Reveal Verse
                  </Button>
                </div>
              )}
            </>
          )}

          {/* --- SRS RATING BUTTONS (shown after reveal or after quiz check) --- */}
          {(showText || checked) && (
            <div className="mt-3" role="group" aria-label="Rate your recall">
              <p className="text-muted small mb-2">How well did you know it?</p>
              <div className="d-flex gap-2 flex-wrap">
                {SRS_BUTTONS.map(({ rating, label, variant, days }) => (
                  <Button
                    key={rating}
                    variant={variant}
                    onClick={() => handleRate(rating)}
                    aria-label={`Rate as ${label}, schedule next review in ${days}`}
                  >
                    {label}
                    <span className="d-block" style={{ fontSize: '0.7rem', opacity: 0.8 }}>+{days}</span>
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* --- SKIP (always available) --- */}
          {!showText && !checked && (
            <div className="mt-3">
              <Button variant="link" size="sm" className="text-muted p-0" onClick={goNext}>
                Skip for now
              </Button>
            </div>
          )}

        </Card.Body>
      </Card>

      <div className="text-center mt-3">
        <small className="text-muted">
          Verse {idx + 1} of {reviewQueue.length}
          {currentVerse.timesReviewed > 0 && <> &middot; Reviewed {currentVerse.timesReviewed}×</>}
        </small>
      </div>
    </Container>
  )
}

export default ReviewPage
