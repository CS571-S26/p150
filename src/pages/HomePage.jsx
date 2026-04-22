import { useMemo } from 'react'
import { Container, Row, Col, Card, Button, Badge } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import StreakTracker from '../components/StreakTracker'
import TagBadge from '../components/TagBadge'

function getDailyVerse(verses) {
  if (verses.length === 0) return null
  const today = new Date().toISOString().split('T')[0]
  const seed = parseInt(today.replace(/-/g, ''), 10)
  return verses[seed % verses.length]
}

function HomePage({ verses, streak }) {
  const today = new Date().toISOString().split('T')[0]

  const stats = useMemo(() => {
    const memorized = verses.filter(v => v.memorized).length
    const dueToday = verses.filter(v => !v.nextReviewDate || v.nextReviewDate <= today).length
    return { memorized, dueToday }
  }, [verses, today])

  const verseOfTheDay = useMemo(() => getDailyVerse(verses), [verses])

  return (
    <Container className="py-4">
      <div className="text-center mb-4">
        <h1 className="display-5 fw-bold">Scripture Memory</h1>
        <p className="lead text-muted">
          Hide God's Word in your heart. Memorize, review, and track your progress.
        </p>
      </div>

      {/* Verse of the Day */}
      {verseOfTheDay && (
        <Row className="justify-content-center mb-4">
          <Col md={8}>
            <Card className="verse-of-day-card">
              <Card.Body className="text-center py-4">
                <p className="text-muted small text-uppercase fw-semibold mb-2 letter-spacing">
                  Verse of the Day
                </p>
                <p className="verse-text-large mb-3">"{verseOfTheDay.text}"</p>
                <p className="verse-reference fs-5 mb-2">— {verseOfTheDay.reference}</p>
                <div className="d-flex flex-wrap gap-1 justify-content-center">
                  {verseOfTheDay.tags.map(tag => <TagBadge key={tag} tag={tag} />)}
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

      <Row className="justify-content-center mb-4">
        <Col md={4} className="mb-3">
          <StreakTracker streak={streak} />
        </Col>
      </Row>

      <Row className="justify-content-center">
        <Col md={4} className="mb-3">
          <Card className="stat-card text-center h-100">
            <Card.Body>
              <h3 className="stat-number text-primary">{verses.length}</h3>
              <p className="text-muted mb-2">Total Verses</p>
              <Button as={Link} to="/verses" variant="outline-primary" size="sm">
                View All
              </Button>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} className="mb-3">
          <Card className="stat-card text-center h-100">
            <Card.Body>
              <h3 className="stat-number text-success">{stats.memorized}</h3>
              <p className="text-muted mb-2">Memorized</p>
              <Button as={Link} to="/progress" variant="outline-success" size="sm">
                See Progress
              </Button>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} className="mb-3">
          <Card className="stat-card text-center h-100">
            <Card.Body>
              <h3 className="stat-number text-danger">
                {stats.dueToday}
                {stats.dueToday > 0 && <Badge bg="danger" className="ms-2 fs-6 align-middle">!</Badge>}
              </h3>
              <p className="text-muted mb-2">Due Today</p>
              <Button as={Link} to="/review" variant={stats.dueToday > 0 ? 'danger' : 'outline-secondary'} size="sm">
                {stats.dueToday > 0 ? `Review ${stats.dueToday} Now` : 'All Caught Up'}
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <div className="text-center mt-4">
        <Button as={Link} to="/review" variant="primary" size="lg">
          Start Daily Review
          {stats.dueToday > 0 && <Badge bg="light" text="dark" className="ms-2">{stats.dueToday} due</Badge>}
        </Button>
      </div>
    </Container>
  )
}

export default HomePage
