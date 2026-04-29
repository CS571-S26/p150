import { useState } from 'react'
import { Form, Button, Badge } from 'react-bootstrap'
import TagBadge from './TagBadge'

function truncate(text, max = 90) {
  if (text.length <= max) return text
  return text.slice(0, max).replace(/\s+\S*$/, '') + '…'
}

function VerseListItem({ verse, onDelete, onToggleMemorized, onCompare }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className={`verse-list-item ${expanded ? 'expanded' : ''}`}>
      <button
        type="button"
        className="verse-list-header"
        onClick={() => setExpanded(!expanded)}
        aria-expanded={expanded}
        aria-controls={`verse-body-${verse.id}`}
      >
        <span className="verse-list-chevron" aria-hidden="true">›</span>
        <span className="verse-list-reference">{verse.reference}</span>
        {verse.memorized && (
          <Badge bg="success" className="verse-list-badge" aria-label="Memorized">✓</Badge>
        )}
        <span className="verse-list-preview text-muted">
          {truncate(verse.text)}
        </span>
      </button>

      <div
        className="verse-list-collapse"
        id={`verse-body-${verse.id}`}
        role="region"
        aria-label={`${verse.reference} details`}
      >
        <div className="verse-list-body">
          <p className="verse-text mb-3">{verse.text}</p>

          {verse.tags.length > 0 && (
            <div className="d-flex flex-wrap gap-1 mb-3">
              {verse.tags.map(tag => <TagBadge key={tag} tag={tag} />)}
            </div>
          )}

          <div className="text-muted small mb-3">
            Added {verse.dateAdded}
            {verse.lastReviewed && <> &middot; Last reviewed {verse.lastReviewed}</>}
            {verse.timesReviewed > 0 && <> &middot; Reviewed {verse.timesReviewed}×</>}
          </div>

          <div className="d-flex flex-wrap gap-2 align-items-center">
            <Form.Check
              type="checkbox"
              id={`memorized-list-${verse.id}`}
              checked={verse.memorized}
              onChange={() => onToggleMemorized(verse.id)}
              label="Memorized"
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
        </div>
      </div>
    </div>
  )
}

export default VerseListItem
