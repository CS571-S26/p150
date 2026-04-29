import { Link, useLocation } from 'react-router-dom'
import { Navbar, Nav, Container } from 'react-bootstrap'
import DarkModeToggle from './DarkModeToggle'

function Navigation({ darkMode, setDarkMode }) {
  const location = useLocation()

  return (
    <Navbar
      bg={darkMode ? 'dark' : 'primary'}
      variant="dark"
      expand="md"
      sticky="top"
      aria-label="Primary navigation"
    >
      <Container>
        <Navbar.Brand as={Link} to="/" aria-label="Scripture Memory home">
          <span aria-hidden="true" className="me-2">📖</span>
          Scripture Memory
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="main-nav" aria-label="Toggle navigation menu" />
        <Navbar.Collapse id="main-nav">
          <Nav className="me-auto" as="ul">
            <Nav.Item as="li">
              <Nav.Link as={Link} to="/" active={location.pathname === '/'}
                aria-current={location.pathname === '/' ? 'page' : undefined}>
                Home
              </Nav.Link>
            </Nav.Item>
            <Nav.Item as="li">
              <Nav.Link as={Link} to="/verses" active={location.pathname === '/verses'}
                aria-current={location.pathname === '/verses' ? 'page' : undefined}>
                My Verses
              </Nav.Link>
            </Nav.Item>
            <Nav.Item as="li">
              <Nav.Link as={Link} to="/review" active={location.pathname === '/review'}
                aria-current={location.pathname === '/review' ? 'page' : undefined}>
                Review
              </Nav.Link>
            </Nav.Item>
            <Nav.Item as="li">
              <Nav.Link as={Link} to="/progress" active={location.pathname === '/progress'}
                aria-current={location.pathname === '/progress' ? 'page' : undefined}>
                Progress
              </Nav.Link>
            </Nav.Item>
          </Nav>
          <DarkModeToggle darkMode={darkMode} setDarkMode={setDarkMode} />
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default Navigation
