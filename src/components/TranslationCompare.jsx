import { useState, useEffect } from 'react'
import { Modal, Card, Spinner, Badge } from 'react-bootstrap'
import { TRANSLATIONS, fetchVerse } from '../utils/bibleApi'

function TranslationCompare({ verse, show, onClose }) {
  const [results, setResults] = useState([])

  useEffect(() => {
    if (!show || !verse) return

    setResults(TRANSLATIONS.map(t => ({ ...t, loading: true, text: null, error: null })))

    let cancelled = false

    TRANSLATIONS.forEach((t, i) => {
      fetchVerse(verse.reference, t.id)
        .then(data => {
          if (cancelled) return
          setResults(prev => prev.map((r, idx) =>
            idx === i ? { ...r, text: data.text, loading: false } : r
          ))
        })
        .catch(() => {
          if (cancelled) return
          setResults(prev => prev.map((r, idx) =>
            idx === i ? { ...r, error: 'Not available in this translation', loading: false } : r
          ))
        })
    })

    return () => { cancelled = true }
  }, [show, verse])

  if (!verse) return null

  const loadedCount = results.filter(r => !r.loading).length
  const totalCount = results.length

  return (
    <Modal show={show} onHide={onClose} size="lg" centered scrollable aria-labelledby="compare-title">
      <Modal.Header closeButton closeLabel="Close translation comparison">
        <Modal.Title as="h2" id="compare-title" className="h4">
          Compare Translations
          <div className="text-muted small fw-normal mt-1">{verse.reference}</div>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="text-muted small mb-3" aria-live="polite">
          {loadedCount < totalCount
            ? `Loading translations... (${loadedCount} of ${totalCount})`
            : `Showing ${loadedCount} translations`}
        </div>

        {results.map((r) => (
          <Card key={r.id} className="mb-3 translation-card">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-start mb-2">
                <h3 className="h6 mb-0">
                  <Badge bg="primary" className="me-2 translation-badge">{r.shortLabel}</Badge>
                  <span className="text-muted fw-normal small">
                    {r.label.split('—')[1]?.trim() || r.label}
                  </span>
                </h3>
              </div>

              {r.loading && (
                <div className="text-muted small d-flex align-items-center">
                  <Spinner size="sm" className="me-2" />
                  Loading...
                </div>
              )}

              {r.error && (
                <p className="text-muted fst-italic small mb-0">{r.error}</p>
              )}

              {r.text && (
                <p className="verse-text mb-0">{r.text}</p>
              )}
            </Card.Body>
          </Card>
        ))}
      </Modal.Body>
    </Modal>
  )
}

export default TranslationCompare
