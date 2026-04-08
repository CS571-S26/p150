import { Container, Row, Col, Card, Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import StreakTracker from '../components/StreakTracker'

function HomePage({ verses, streak }) {
  const memorized = verses.filter(v => v.memorized).length
  const needsReview = verses.filter(v => !v.memorized).length

  return (
    <Container className="py-4">
      <div className="text-center mb-4">
        <h1 className="display-5 fw-bold">Scripture Memory</h1>
        <p className="lead text-muted">
          Hide God's Word in your heart. Memorize, review, and track your progress.
        </p>
      </div>

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
              <h3 className="stat-number text-success">{memorized}</h3>
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
              <h3 className="stat-number text-warning">{needsReview}</h3>
              <p className="text-muted mb-2">Need Review</p>
              <Button as={Link} to="/review" variant="outline-warning" size="sm">
                Start Review
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <div className="text-center mt-4">
        <Button as={Link} to="/review" variant="primary" size="lg">
          Start Daily Review
        </Button>
      </div>
    </Container>
  )
}

export default HomePage
