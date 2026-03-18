import { Container, Row, Col, Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'

function HomePage() {
  return (
    <Container className="text-center py-5">
      <Row className="justify-content-center">
        <Col md={8}>
          <h1 className="display-4 mb-3">Task Tracker</h1>
          <p className="lead text-muted mb-4">
            A simple React app to keep track of your tasks.
            Built with React, React Router, and React Bootstrap.
          </p>
          <Button as={Link} to="/tasks" variant="primary" size="lg">
            View Tasks
          </Button>
        </Col>
      </Row>
    </Container>
  )
}

export default HomePage
