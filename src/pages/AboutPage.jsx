import { Container, Card } from 'react-bootstrap'

function AboutPage() {
  return (
    <Container className="py-4" style={{ maxWidth: 600 }}>
      <h2 className="mb-3">About</h2>
      <Card>
        <Card.Body>
          <Card.Title>Task Tracker</Card.Title>
          <Card.Text>
            This app was built for CS 571: Building User Interfaces at
            UW-Madison. It demonstrates:
          </Card.Text>
          <ul className="text-start">
            <li>React functional components and hooks (useState)</li>
            <li>Client-side routing with React Router (HashRouter)</li>
            <li>UI components with React Bootstrap</li>
            <li>Deployment to GitHub Pages via Vite</li>
          </ul>
        </Card.Body>
      </Card>
    </Container>
  )
}

export default AboutPage
