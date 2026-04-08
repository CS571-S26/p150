import { Link, useLocation } from 'react-router-dom'
import { Navbar, Nav, Container, Form } from 'react-bootstrap'

function Navigation({ darkMode, setDarkMode }) {
  const location = useLocation()

  return (
    <Navbar bg={darkMode ? 'dark' : 'primary'} variant="dark" expand="md" sticky="top">
      <Container>
        <Navbar.Brand as={Link} to="/">
          <span className="me-2">&#9776;</span>
          Scripture Memory
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="main-nav" />
        <Navbar.Collapse id="main-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/" active={location.pathname === '/'}>Home</Nav.Link>
            <Nav.Link as={Link} to="/verses" active={location.pathname === '/verses'}>My Verses</Nav.Link>
            <Nav.Link as={Link} to="/review" active={location.pathname === '/review'}>Review</Nav.Link>
            <Nav.Link as={Link} to="/progress" active={location.pathname === '/progress'}>Progress</Nav.Link>
          </Nav>
          <Form.Check
            type="switch"
            id="dark-mode-switch"
            label={darkMode ? 'Dark' : 'Light'}
            checked={darkMode}
            onChange={() => setDarkMode(!darkMode)}
            className="text-light"
          />
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default Navigation
