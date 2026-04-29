import { Card, Button, Form } from 'react-bootstrap'
import TagBadge from './TagBadge'

function VerseCard({ verse, onDelete, onToggleMemorized, showActions = true }) {
  return (
    <Card className="verse-card mb-3">
      <Card.Body>
        <div className="d-flex justify-content-between align-items-start">
          <div>
            <Card.Title as="h3" className="verse-reference h5">{verse.reference}</Card.Title>
            <Card.Text className="verse-text">{verse.text}</Card.Text>
            <div className="d-flex flex-wrap gap-1 mt-2">
              {verse.tags.map(tag => (
                <TagBadge key={tag} tag={tag} />
              ))}
            </div>
          </div>
          {showActions && (
            <div className="d-flex flex-column gap-2 ms-3">
              <Form.Check
                type="checkbox"
                id={`memorized-${verse.id}`}
                checked={verse.memorized}
                onChange={() => onToggleMemorized(verse.id)}
                label="Memorized"
                className="text-nowrap"
                aria-label={`Mark ${verse.reference} as memorized`}
              />
              <Button
                variant="outline-danger"
                size="sm"
                onClick={() => onDelete(verse.id)}
                aria-label={`Remove ${verse.reference}`}
              >
                Remove
              </Button>
            </div>
          )}
        </div>
        <div className="text-muted small mt-2">
          Added {verse.dateAdded}
          {verse.lastReviewed && <> &middot; Last reviewed {verse.lastReviewed}</>}
          {verse.timesReviewed > 0 && <> &middot; Reviewed {verse.timesReviewed}x</>}
        </div>
      </Card.Body>
    </Card>
  )
}

export default VerseCard
