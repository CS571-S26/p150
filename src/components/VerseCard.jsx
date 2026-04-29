import { Card, Button, Form } from 'react-bootstrap'
import TagBadge from './TagBadge'

function VerseCard({ verse, onDelete, onToggleMemorized, onCompare, showActions = true, compact = false }) {
  const cardClass = compact ? 'verse-card verse-card-compact h-100' : 'verse-card mb-3'

  return (
    <Card className={cardClass}>
      <Card.Body className={compact ? 'd-flex flex-column' : ''}>
        <div className={compact ? '' : 'd-flex justify-content-between align-items-start'}>
          <div className={compact ? 'mb-3' : ''}>
            <Card.Title as="h3" className="verse-reference h5">{verse.reference}</Card.Title>
            <Card.Text className={`verse-text ${compact ? 'verse-text-clamped' : ''}`}>
              {verse.text}
            </Card.Text>
            <div className="d-flex flex-wrap gap-1 mt-2">
              {verse.tags.map(tag => (
                <TagBadge key={tag} tag={tag} />
              ))}
            </div>
          </div>
          {showActions && !compact && (
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
              {onCompare && (
                <Button
                  variant="outline-primary"
                  size="sm"
                  onClick={() => onCompare(verse)}
                  aria-label={`Compare ${verse.reference} across translations`}
                >
                  Compare
                </Button>
              )}
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

        <div className={`text-muted small ${compact ? 'mt-auto pt-2' : 'mt-2'}`}>
          Added {verse.dateAdded}
          {verse.lastReviewed && <> &middot; Last reviewed {verse.lastReviewed}</>}
          {verse.timesReviewed > 0 && <> &middot; Reviewed {verse.timesReviewed}×</>}
        </div>

        {showActions && compact && (
          <div className="d-flex flex-wrap gap-2 align-items-center mt-3 pt-2 border-top">
            <Form.Check
              type="checkbox"
              id={`memorized-grid-${verse.id}`}
              checked={verse.memorized}
              onChange={() => onToggleMemorized(verse.id)}
              label="Memorized"
              className="me-auto"
              aria-label={`Mark ${verse.reference} as memorized`}
            />
            {onCompare && (
              <Button
                variant="outline-primary"
                size="sm"
                onClick={() => onCompare(verse)}
                aria-label={`Compare ${verse.reference} across translations`}
              >
                Compare
              </Button>
            )}
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
      </Card.Body>
    </Card>
  )
}

export default VerseCard
