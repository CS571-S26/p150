import { Modal, Button } from 'react-bootstrap'

function OnboardingModal({ show, onClose }) {
  return (
    <Modal show={show} onHide={onClose} centered size="lg" aria-labelledby="onboarding-title">
      <Modal.Header closeButton closeLabel="Close welcome dialog">
        <Modal.Title id="onboarding-title">Welcome to Scripture Memory</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p className="lead">
          A simple way to memorize Bible verses and track your progress over time.
        </p>

        <h3 className="h5 mt-4">Three steps to get started:</h3>
        <ol className="onboarding-steps">
          <li className="mb-3">
            <strong>Add verses</strong> &mdash; type a reference like <em>John 3:16</em> and use
            the lookup feature to auto-fill the text. You can also bulk import or add manually.
          </li>
          <li className="mb-3">
            <strong>Review daily</strong> &mdash; rate each verse as Again / Hard / Good / Easy.
            Spaced repetition schedules the next review at the optimal interval.
          </li>
          <li className="mb-3">
            <strong>Track progress</strong> &mdash; watch your streak grow, see your retention
            rate, and review your weekly activity chart.
          </li>
        </ol>

        <p className="text-muted small mt-4">
          All data is saved locally in your browser. No account needed.
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={onClose} autoFocus>
          Get Started
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default OnboardingModal
