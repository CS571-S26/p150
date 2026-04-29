import { useState, useEffect, useMemo } from 'react'
import { Container, Badge, ButtonGroup, Button, Row, Col } from 'react-bootstrap'
import VerseCard from '../components/VerseCard'
import VerseListItem from '../components/VerseListItem'
import AddVerseForm from '../components/AddVerseForm'
import SearchFilter from '../components/SearchFilter'
import BulkImport from '../components/BulkImport'
import EmptyState from '../components/EmptyState'
import TranslationCompare from '../components/TranslationCompare'
import ViewToggle from '../components/ViewToggle'

const MEMORIZED_FILTERS = [
  { value: 'all',         label: 'All' },
  { value: 'unmemorized', label: 'Not Memorized' },
  { value: 'memorized',   label: 'Memorized' },
]

function loadStoredView() {
  try {
    const stored = localStorage.getItem('verseViewMode')
    return stored ? JSON.parse(stored) : 'card'
  } catch {
    return 'card'
  }
}

function VersesPage({ verses, addVerse, deleteVerse, toggleMemorized }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTag, setSelectedTag] = useState('')
  const [memorizedFilter, setMemorizedFilter] = useState('all')
  const [compareVerse, setCompareVerse] = useState(null)
  const [viewMode, setViewMode] = useState(loadStoredView)

  useEffect(() => {
    localStorage.setItem('verseViewMode', JSON.stringify(viewMode))
  }, [viewMode])

  const allTags = useMemo(() => {
    const tagSet = new Set()
    verses.forEach(v => v.tags.forEach(t => tagSet.add(t)))
    return [...tagSet].sort()
  }, [verses])

  const filtered = useMemo(() => {
    return verses.filter(v => {
      const matchesSearch = searchTerm === '' ||
        v.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.text.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesTag = selectedTag === '' || v.tags.includes(selectedTag)
      const matchesMem = memorizedFilter === 'all' ||
        (memorizedFilter === 'memorized' && v.memorized) ||
        (memorizedFilter === 'unmemorized' && !v.memorized)
      return matchesSearch && matchesTag && matchesMem
    })
  }, [verses, searchTerm, selectedTag, memorizedFilter])

  const memorizedCount = useMemo(() => verses.filter(v => v.memorized).length, [verses])

  const clearFilters = () => {
    setSearchTerm('')
    setSelectedTag('')
    setMemorizedFilter('all')
  }

  const containerWidth = viewMode === 'grid' ? 1100 : 800

  const renderVerses = () => {
    if (viewMode === 'list') {
      return (
        <div className="verse-list">
          {filtered.map(verse => (
            <VerseListItem
              key={verse.id}
              verse={verse}
              onDelete={deleteVerse}
              onToggleMemorized={toggleMemorized}
              onCompare={setCompareVerse}
            />
          ))}
        </div>
      )
    }
    if (viewMode === 'grid') {
      return (
        <Row xs={1} md={2} className="g-3 verse-grid">
          {filtered.map(verse => (
            <Col key={verse.id}>
              <VerseCard
                verse={verse}
                onDelete={deleteVerse}
                onToggleMemorized={toggleMemorized}
                onCompare={setCompareVerse}
                compact
              />
            </Col>
          ))}
        </Row>
      )
    }
    return filtered.map(verse => (
      <VerseCard
        key={verse.id}
        verse={verse}
        onDelete={deleteVerse}
        onToggleMemorized={toggleMemorized}
        onCompare={setCompareVerse}
      />
    ))
  }

  return (
    <Container className="py-4" style={{ maxWidth: containerWidth, transition: 'max-width 0.3s ease' }}>
      <header className="d-flex justify-content-between align-items-center mb-3">
        <h1 className="h2 mb-0">
          My Verses <Badge bg="secondary">{verses.length}</Badge>
        </h1>
        <span className="text-muted small" aria-live="polite">
          {memorizedCount} memorized
        </span>
      </header>

      <AddVerseForm onAdd={addVerse} />
      <BulkImport onImport={addVerse} />

      <section aria-labelledby="filter-heading" className="mb-3">
        <h2 id="filter-heading" className="visually-hidden">Filter verses</h2>
        <div className="d-flex flex-wrap gap-2 justify-content-between align-items-center">
          <ButtonGroup size="sm" aria-label="Filter by memorization status">
            {MEMORIZED_FILTERS.map(f => (
              <Button
                key={f.value}
                variant={memorizedFilter === f.value ? 'primary' : 'outline-primary'}
                onClick={() => setMemorizedFilter(f.value)}
                aria-pressed={memorizedFilter === f.value}
              >
                {f.label}
                {f.value === 'memorized' && (
                  <Badge bg="light" text="dark" className="ms-1">{memorizedCount}</Badge>
                )}
                {f.value === 'unmemorized' && (
                  <Badge bg="light" text="dark" className="ms-1">{verses.length - memorizedCount}</Badge>
                )}
              </Button>
            ))}
          </ButtonGroup>
          <ViewToggle value={viewMode} onChange={setViewMode} />
        </div>
      </section>

      <SearchFilter
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedTag={selectedTag}
        setSelectedTag={setSelectedTag}
        allTags={allTags}
      />

      <section aria-labelledby="verses-heading" aria-live="polite">
        <h2 id="verses-heading" className="visually-hidden">Verse list</h2>

        {verses.length === 0 ? (
          <EmptyState
            icon="📖"
            title="No verses yet"
            message="Add your first verse using the form above to begin your memorization journey."
          />
        ) : filtered.length === 0 ? (
          <EmptyState
            icon="🔍"
            title="No matches found"
            message="No verses match your current filters."
            actionLabel="Clear Filters"
            onAction={clearFilters}
          />
        ) : (
          <>
            {renderVerses()}
            <p className="text-muted text-center small mt-3">
              Showing {filtered.length} of {verses.length} verses
            </p>
          </>
        )}
      </section>

      <TranslationCompare
        verse={compareVerse}
        show={compareVerse !== null}
        onClose={() => setCompareVerse(null)}
      />
    </Container>
  )
}

export default VersesPage
