import { useState } from 'react'
import { Card, Form, Button, Alert, ProgressBar, Row, Col, Spinner } from 'react-bootstrap'
import { TRANSLATIONS, fetchVerse } from '../utils/bibleApi'

const PLACEHOLDER = `John 3:16
Psalm 23:1
Philippians 4:13
Romans 8:28`

function parseReferences(raw) {
  return raw
    .split('\n')
    .map(l => l.trim())
    .filter(l => l.length > 0)
}

function BulkImport({ onImport }) {
  const [open, setOpen] = useState(false)
  const [raw, setRaw] = useState('')
  const [translation, setTranslation] = useState('kjv')
  const [importing, setImporting] = useState(false)
  const [progress, setProgress] = useState({ current: 0, total: 0 })
  const [feedback, setFeedback] = useState(null)

  const handleImport = async () => {
    const references = parseReferences(raw)
    if (references.length === 0) {
      setFeedback({ type: 'danger', message: 'Add at least one reference (one per line).' })
      return
    }

    setImporting(true)
    setFeedback(null)
    setProgress({ current: 0, total: references.length })

    const successes = []
    const failures = []

    for (let i = 0; i < references.length; i++) {
      const ref = references[i]
      try {
        const result = await fetchVerse(ref, translation)
        onImport({ reference: result.reference, text: result.text, tags: [] })
        successes.push(result.reference)
      } catch {
        failures.push(ref)
      }
      setProgress({ current: i + 1, total: references.length })
    }

    setImporting(false)
    setFeedback({
      type: failures.length === 0 ? 'success' : successes.length === 0 ? 'danger' : 'warning',
      message: `Imported ${successes.length} of ${references.length} verses.`,
      failures,
    })
    if (failures.length === 0) setRaw('')
  }

  const handleClose = () => {
    if (importing) return
    setOpen(false)
    setRaw('')
    setFeedback(null)
    setProgress({ current: 0, total: 0 })
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

  const progressPct = progress.total > 0 ? Math.round((progress.current / progress.total) * 100) : 0

  return (
    <Card className="mb-3 bulk-import-card">
      <Card.Body>
        <h3 className="h5 mb-2">Bulk Import Verses</h3>
        <p className="text-muted small mb-3">
          One reference per line (e.g. <code>John 3:16</code>). Each verse text will be looked up
          automatically from the selected translation.
        </p>

        <Row className="mb-3 align-items-end">
          <Col md={8}>
            <Form.Group>
              <Form.Label htmlFor="bulk-import-textarea">References (one per line)</Form.Label>
              <Form.Control
                id="bulk-import-textarea"
                as="textarea"
                rows={6}
                placeholder={PLACEHOLDER}
                value={raw}
                onChange={(e) => setRaw(e.target.value)}
                disabled={importing}
                aria-describedby="bulk-import-help"
              />
              <Form.Text id="bulk-import-help" className="text-muted">
                Tags can be added per-verse after import.
              </Form.Text>
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group>
              <Form.Label htmlFor="bulk-import-translation">Translation</Form.Label>
              <Form.Select
                id="bulk-import-translation"
                value={translation}
                onChange={(e) => setTranslation(e.target.value)}
                disabled={importing}
              >
                {TRANSLATIONS.map(t => (
                  <option key={t.id} value={t.id}>{t.label}</option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>

        {importing && (
          <div className="mb-3" aria-live="polite">
            <div className="d-flex justify-content-between mb-1">
              <small className="text-muted">Looking up verses...</small>
              <small className="text-muted">{progress.current} / {progress.total}</small>
            </div>
            <ProgressBar now={progressPct} animated striped />
          </div>
        )}

        {feedback && (
          <Alert variant={feedback.type} className="py-2" aria-live="polite">
            {feedback.message}
            {feedback.failures && feedback.failures.length > 0 && (
              <>
                <div className="small mt-1 fw-semibold">Could not find:</div>
                <ul className="mb-0 mt-1 small">
                  {feedback.failures.slice(0, 5).map((ref, i) => <li key={i}>{ref}</li>)}
                  {feedback.failures.length > 5 && <li>...and {feedback.failures.length - 5} more</li>}
                </ul>
              </>
            )}
          </Alert>
        )}

        <div className="d-flex gap-2">
          <Button
            variant="success"
            onClick={handleImport}
            disabled={importing || !raw.trim()}
          >
            {importing
              ? <><Spinner size="sm" className="me-1" />Importing...</>
              : 'Import Verses'}
          </Button>
          <Button variant="outline-secondary" onClick={handleClose} disabled={importing}>
            Close
          </Button>
        </div>
      </Card.Body>
    </Card>
  )
}

export default BulkImport
