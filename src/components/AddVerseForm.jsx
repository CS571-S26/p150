import { useState } from 'react'
import { Form, Button, Card, Row, Col } from 'react-bootstrap'

function AddVerseForm({ onAdd }) {
  const [reference, setReference] = useState('')
  const [text, setText] = useState('')
  const [tagInput, setTagInput] = useState('')
  const [open, setOpen] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!reference.trim() || !text.trim()) return
    const tags = tagInput
      .split(',')
      .map(t => t.trim().toLowerCase())
      .filter(t => t.length > 0)
    onAdd({ reference: reference.trim(), text: text.trim(), tags })
    setReference('')
    setText('')
    setTagInput('')
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
        <Card.Title>Add a New Verse</Card.Title>
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Reference</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="e.g., John 3:16"
                  value={reference}
                  onChange={(e) => setReference(e.target.value)}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Tags (comma-separated)</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="e.g., faith, love, salvation"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                />
              </Form.Group>
            </Col>
          </Row>
          <Form.Group className="mb-3">
            <Form.Label>Verse Text</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Enter the verse text..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              required
            />
          </Form.Group>
          <div className="d-flex gap-2">
            <Button type="submit" variant="success">Save Verse</Button>
            <Button variant="outline-secondary" onClick={() => setOpen(false)}>Cancel</Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  )
}

export default AddVerseForm
