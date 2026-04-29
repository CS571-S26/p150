import { Container } from 'react-bootstrap'

function Footer() {
  return (
    <footer className="app-footer mt-5 py-4" role="contentinfo">
      <Container>
        <div className="d-flex flex-wrap justify-content-between align-items-center gap-2">
          <div>
            <strong>Scripture Memory</strong>
            <span className="text-muted ms-2 small">
              Built with React, React Router, and React Bootstrap
            </span>
          </div>
          <div className="small text-muted">
            <a
              href="https://github.com/CS571-S26/p150"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-link"
              aria-label="View source code on GitHub (opens in new tab)"
            >
              View on GitHub
            </a>
            <span className="mx-2" aria-hidden="true">&middot;</span>
            <span>Made for CS 571 &mdash; UW Madison</span>
          </div>
        </div>
      </Container>
    </footer>
  )
}

export default Footer
