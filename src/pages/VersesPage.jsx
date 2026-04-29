import { useState, useMemo } from 'react'
import { Container, Badge, ButtonGroup, Button } from 'react-bootstrap'
import VerseCard from '../components/VerseCard'
import AddVerseForm from '../components/AddVerseForm'
import SearchFilter from '../components/SearchFilter'
import BulkImport from '../components/BulkImport'
import EmptyState from '../components/EmptyState'
import TranslationCompare from '../components/TranslationCompare'

const MEMORIZED_FILTERS = [
  { value: 'all',         label: 'All' },
  { value: 'unmemorized', label: 'Not Memorized' },
  { value: 'memorized',   label: 'Memorized' },
]

function VersesPage({ verses, addVerse, deleteVerse, toggleMemorized }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTag, setSelectedTag] = useState('')
  const [memorizedFilter, setMemorizedFilter] = useState('all')
  const [compareVerse, setCompareVerse] = useState(null)

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

  return (
    <Container className="py-4" style={{ maxWidth: 800 }}>
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
            {filtered.map(verse => (
              <VerseCard
                key={verse.id}
                verse={verse}
                onDelete={deleteVerse}
                onToggleMemorized={toggleMemorized}
                onCompare={setCompareVerse}
              />
            ))}
            <p className="text-muted text-center small mt-2">
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
