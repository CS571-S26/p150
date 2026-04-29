import { Card, Button } from 'react-bootstrap'

function EmptyState({ icon = '📖', title, message, actionLabel, onAction }) {
  return (
    <Card className="empty-state-card text-center my-4">
      <Card.Body className="py-5">
        <div className="empty-state-icon mb-3" aria-hidden="true">{icon}</div>
        <h3 className="h5 mb-2">{title}</h3>
        <p className="text-muted mb-4">{message}</p>
        {actionLabel && onAction && (
          <Button variant="primary" onClick={onAction}>{actionLabel}</Button>
        )}
      </Card.Body>
    </Card>
  )
}

export default EmptyState
