import { useState } from 'react'
import { Card, Form, Button, Alert } from 'react-bootstrap'

const PLACEHOLDER = `John 3:16 | For God so loved the world that he gave his only begotten Son...
Psalm 23:1 | The Lord is my shepherd, I shall not want.
Philippians 4:13 | I can do all things through Christ which strengtheneth me.`

function parseBulkInput(raw) {
  const lines = raw.split('\n').map(l => l.trim()).filter(l => l.length > 0)
  const verses = []
  const errors = []

  lines.forEach((line, i) => {
    const sepIndex = line.indexOf('|')
    if (sepIndex === -1) {
      errors.push(`Line ${i + 1}: missing "|" separator`)
      return
    }
    const reference = line.slice(0, sepIndex).trim()
    const text = line.slice(sepIndex + 1).trim()
    if (!reference || !text) {
      errors.push(`Line ${i + 1}: empty reference or text`)
      return
    }
    verses.push({ reference, text, tags: [] })
  })

  return { verses, errors }
}

function BulkImport({ onImport }) {
  const [open, setOpen] = useState(false)
  const [raw, setRaw] = useState('')
  const [feedback, setFeedback] = useState(null)

  const handleImport = () => {
    const { verses, errors } = parseBulkInput(raw)
    if (verses.length === 0) {
      setFeedback({ type: 'danger', message: 'No valid verses found. Use format: Reference | Verse text' })
      return
    }
    verses.forEach(v => onImport(v))
    setFeedback({
      type: errors.length > 0 ? 'warning' : 'success',
      message: `Imported ${verses.length} verse${verses.length === 1 ? '' : 's'}.${errors.length > 0 ? ` ${errors.length} line${errors.length === 1 ? '' : 's'} skipped.` : ''}`,
      errors,
    })
    setRaw('')
  }

  const handleClose = () => {
    setOpen(false)
    setRaw('')
    setFeedback(null)
  }

  if (!open) {
    return (
      <Button
        variant="outline-secondary"
        className="mb-3 w-100"
        onClick={() => setOpen(true)}
        aria-expanded={false}
      >
        Bulk Import Verses
      </Button>
    )
  }

  return (
    <Card className="mb-3 bulk-import-card">
      <Card.Body>
        <h3 className="h5 mb-2">Bulk Import Verses</h3>
        <p className="text-muted small mb-3">
          One verse per line. Format: <code>Reference | Verse text</code>
        </p>

        <Form.Group className="mb-3">
          <Form.Label htmlFor="bulk-import-textarea">Verses (one per line)</Form.Label>
          <Form.Control
            id="bulk-import-textarea"
            as="textarea"
            rows={5}
            placeholder={PLACEHOLDER}
            value={raw}
            onChange={(e) => setRaw(e.target.value)}
            aria-describedby="bulk-import-help"
          />
          <Form.Text id="bulk-import-help" className="text-muted">
            Tags can be added individually after import.
          </Form.Text>
        </Form.Group>

        {feedback && (
          <Alert variant={feedback.type} className="py-2">
            {feedback.message}
            {feedback.errors && feedback.errors.length > 0 && (
              <ul className="mb-0 mt-1 small">
                {feedback.errors.slice(0, 3).map((err, i) => <li key={i}>{err}</li>)}
                {feedback.errors.length > 3 && <li>...and {feedback.errors.length - 3} more</li>}
              </ul>
            )}
          </Alert>
        )}

        <div className="d-flex gap-2">
          <Button variant="success" onClick={handleImport} disabled={!raw.trim()}>
            Import Verses
          </Button>
          <Button variant="outline-secondary" onClick={handleClose}>Close</Button>
        </div>
      </Card.Body>
    </Card>
  )
}

export default BulkImport
