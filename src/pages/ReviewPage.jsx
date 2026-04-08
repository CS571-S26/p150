import { useState, useMemo } from 'react'
import { Container, Card, Button, ProgressBar, Alert } from 'react-bootstrap'
import TagBadge from '../components/TagBadge'

function ReviewPage({ verses, markReviewed, toggleMemorized }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showText, setShowText] = useState(false)
  const [reviewedInSession, setReviewedInSession] = useState(new Set())

  const reviewQueue = useMemo(() => {
    return [...verses].sort((a, b) => {
      if (!a.lastReviewed && b.lastReviewed) return -1
      if (a.lastReviewed && !b.lastReviewed) return 1
      if (a.memorized && !b.memorized) return 1
      if (!a.memorized && b.memorized) return -1
      return a.timesReviewed - b.timesReviewed
    })
  }, [verses])

  if (reviewQueue.length === 0) {
    return (
      <Container className="py-4 text-center">
        <h2>Review</h2>
        <Alert variant="info" className="mt-4">
          No verses to review. Add some verses first!
        </Alert>
      </Container>
    )
  }

  const currentVerse = reviewQueue[currentIndex % reviewQueue.length]
  const progress = reviewQueue.length > 0 ? Math.round((reviewedInSession.size / reviewQueue.length) * 100) : 0

  const handleNext = () => {
    setShowText(false)
    setCurrentIndex((currentIndex + 1) % reviewQueue.length)
  }

  const handleMarkReviewed = () => {
    markReviewed(currentVerse.id)
    setReviewedInSession(new Set([...reviewedInSession, currentVerse.id]))
    handleNext()
  }

  const handleMarkMemorized = () => {
    toggleMemorized(currentVerse.id)
    markReviewed(currentVerse.id)
    setReviewedInSession(new Set([...reviewedInSession, currentVerse.id]))
    handleNext()
  }

  return (
    <Container className="py-4" style={{ maxWidth: 700 }}>
      <h2 className="mb-3">Daily Review</h2>

      <div className="mb-3">
        <div className="d-flex justify-content-between mb-1">
          <small className="text-muted">Session progress</small>
          <small className="text-muted">{reviewedInSession.size} / {reviewQueue.length}</small>
        </div>
        <ProgressBar now={progress} variant="success" />
      </div>

      <Card className="review-card text-center">
        <Card.Body className="py-5">
          <h3 className="mb-4">{currentVerse.reference}</h3>

          {showText ? (
            <p className="verse-text-large mb-4">{currentVerse.text}</p>
          ) : (
            <Button variant="outline-primary" size="lg" onClick={() => setShowText(true)} className="mb-4">
              Reveal Verse
            </Button>
          )}

          <div className="d-flex flex-wrap gap-1 justify-content-center mb-4">
            {currentVerse.tags.map(tag => (
              <TagBadge key={tag} tag={tag} />
            ))}
          </div>

          {currentVerse.memorized && (
            <div className="mb-3">
              <small className="text-success fw-bold">&#10003; Memorized</small>
            </div>
          )}

          <div className="d-flex justify-content-center gap-2 flex-wrap">
            <Button variant="outline-secondary" onClick={handleNext}>
              Skip
            </Button>
            <Button variant="primary" onClick={handleMarkReviewed}>
              Reviewed
            </Button>
            {!currentVerse.memorized && (
              <Button variant="success" onClick={handleMarkMemorized}>
                Mark Memorized
              </Button>
            )}
          </div>
        </Card.Body>
      </Card>

      <div className="text-center mt-3">
        <small className="text-muted">
          Verse {(currentIndex % reviewQueue.length) + 1} of {reviewQueue.length}
          {currentVerse.timesReviewed > 0 && <> &middot; Previously reviewed {currentVerse.timesReviewed} times</>}
        </small>
      </div>
    </Container>
  )
}

export default ReviewPage
