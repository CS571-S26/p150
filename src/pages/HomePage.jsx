import { useMemo } from 'react'
import { Container, Row, Col, Card, Button, Badge } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import StreakTracker from '../components/StreakTracker'
import TagBadge from '../components/TagBadge'
import VerseStat from '../components/VerseStat'

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
      <header className="text-center mb-4">
        <h1 className="display-5 fw-bold">Scripture Memory</h1>
        <p className="lead text-muted">
          Hide God's Word in your heart. Memorize, review, and track your progress.
        </p>
      </header>

      {verseOfTheDay && (
        <section aria-labelledby="votd-heading" className="mb-4">
          <Row className="justify-content-center">
            <Col md={8}>
              <Card className="verse-of-day-card">
                <Card.Body className="text-center py-4">
                  <h2 id="votd-heading" className="text-muted small text-uppercase fw-semibold mb-2 letter-spacing">
                    Verse of the Day
                  </h2>
                  <p className="verse-text-large mb-3">"{verseOfTheDay.text}"</p>
                  <p className="verse-reference fs-5 mb-2">— {verseOfTheDay.reference}</p>
                  <div className="d-flex flex-wrap gap-1 justify-content-center">
                    {verseOfTheDay.tags.map(tag => <TagBadge key={tag} tag={tag} />)}
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </section>
      )}

      <section aria-labelledby="snapshot-heading">
        <h2 id="snapshot-heading" className="visually-hidden">Today's snapshot</h2>

        <Row className="justify-content-center mb-4">
          <Col md={4} className="mb-3">
            <StreakTracker streak={streak} />
          </Col>
        </Row>

        <Row className="justify-content-center">
          <Col md={4} className="mb-3">
            <VerseStat
              label="Total Verses"
              value={verses.length}
              color="primary"
              linkTo="/verses"
              linkLabel="View All"
            />
          </Col>
          <Col md={4} className="mb-3">
            <VerseStat
              label="Memorized"
              value={stats.memorized}
              color="success"
              linkTo="/progress"
              linkLabel="See Progress"
            />
          </Col>
          <Col md={4} className="mb-3">
            <VerseStat
              label="Due Today"
              value={stats.dueToday}
              color="danger"
              badge={stats.dueToday > 0 ? '!' : null}
              linkTo="/review"
              linkLabel={stats.dueToday > 0 ? `Review ${stats.dueToday} Now` : 'All Caught Up'}
              urgent={stats.dueToday > 0}
            />
          </Col>
        </Row>
      </section>

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
