import { useState } from 'react'
import { Form, Button, Card, Row, Col, Spinner, Alert } from 'react-bootstrap'
import { TRANSLATIONS, fetchVerse } from '../utils/bibleApi'

function AddVerseForm({ onAdd }) {
  const [reference, setReference] = useState('')
  const [text, setText] = useState('')
  const [tagInput, setTagInput] = useState('')
  const [translation, setTranslation] = useState('kjv')
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [lookupError, setLookupError] = useState('')
  const [lookedUpTranslation, setLookedUpTranslation] = useState('')

  const handleLookup = async () => {
    if (!reference.trim()) return
    setLoading(true)
    setLookupError('')
    setLookedUpTranslation('')
    try {
      const result = await fetchVerse(reference.trim(), translation)
      setReference(result.reference)
      setText(result.text)
      setLookedUpTranslation(TRANSLATIONS.find(t => t.id === translation)?.label || translation)
    } catch {
      setLookupError(`Could not find "${reference}". Check the reference and try again.`)
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') { e.preventDefault(); handleLookup() }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!reference.trim() || !text.trim()) return
    const tags = tagInput.split(',').map(t => t.trim().toLowerCase()).filter(t => t.length > 0)
    onAdd({ reference: reference.trim(), text: text.trim(), tags })
    setReference('')
    setText('')
    setTagInput('')
    setLookupError('')
    setLookedUpTranslation('')
    setOpen(false)
  }

  const handleCancel = () => {
    setReference('')
    setText('')
    setTagInput('')
    setLookupError('')
    setLookedUpTranslation('')
    setOpen(false)
  }

  if (!open) {
    return (
      <Button variant="primary" className="mb-3 w-100" onClick={() => setOpen(true)}>
        + Add New Verse
      </Button>
    )
  }

  return (
    <Card className="mb-3 add-verse-form">
      <Card.Body>
        <Card.Title as="h2" className="h5">Add a New Verse</Card.Title>
        <Form onSubmit={handleSubmit}>
          <Row className="mb-2">
            <Col md={5}>
              <Form.Group>
                <Form.Label>Reference</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="e.g., John 3:16"
                  value={reference}
                  onChange={(e) => setReference(e.target.value)}
                  onKeyDown={handleKeyDown}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Translation</Form.Label>
                <Form.Select value={translation} onChange={(e) => setTranslation(e.target.value)}>
                  {TRANSLATIONS.map(t => (
                    <option key={t.id} value={t.id}>{t.label}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={3} className="d-flex align-items-end">
              <Button
                variant="outline-primary"
                className="w-100"
                onClick={handleLookup}
                disabled={loading || !reference.trim()}
              >
                {loading
                  ? <><Spinner size="sm" className="me-1" />Looking up...</>
                  : 'Lookup'}
              </Button>
            </Col>
          </Row>

          {lookupError && <Alert variant="danger" className="py-2 mb-2">{lookupError}</Alert>}

          <Form.Group className="mb-3">
            <Form.Label>
              Verse Text
              {lookedUpTranslation && (
                <span className="text-muted fw-normal ms-2 small">— {lookedUpTranslation}</span>
              )}
            </Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Type verse text, or use Lookup above to auto-fill..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Tags <span className="text-muted fw-normal">(comma-separated)</span></Form.Label>
            <Form.Control
              type="text"
              placeholder="e.g., faith, love, salvation"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
            />
          </Form.Group>

          <div className="d-flex gap-2">
            <Button type="submit" variant="success" disabled={loading}>Save Verse</Button>
            <Button variant="outline-secondary" onClick={handleCancel}>Cancel</Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  )
}

export default AddVerseForm
