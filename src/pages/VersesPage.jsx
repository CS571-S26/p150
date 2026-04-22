import { useState, useMemo } from 'react'
import { Container, Badge, ButtonGroup, Button } from 'react-bootstrap'
import VerseCard from '../components/VerseCard'
import AddVerseForm from '../components/AddVerseForm'
import SearchFilter from '../components/SearchFilter'

const MEMORIZED_FILTERS = [
  { value: 'all',          label: 'All' },
  { value: 'unmemorized',  label: 'Not Memorized' },
  { value: 'memorized',    label: 'Memorized' },
]

function VersesPage({ verses, addVerse, deleteVerse, toggleMemorized }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTag, setSelectedTag] = useState('')
  const [memorizedFilter, setMemorizedFilter] = useState('all')

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

  return (
    <Container className="py-4" style={{ maxWidth: 800 }}>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="mb-0">
          My Verses <Badge bg="secondary">{verses.length}</Badge>
        </h2>
        <span className="text-muted small">{memorizedCount} memorized</span>
      </div>

      <AddVerseForm onAdd={addVerse} />

      <div className="mb-3">
        <ButtonGroup size="sm">
          {MEMORIZED_FILTERS.map(f => (
            <Button
              key={f.value}
              variant={memorizedFilter === f.value ? 'primary' : 'outline-primary'}
              onClick={() => setMemorizedFilter(f.value)}
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
      </div>

      <SearchFilter
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedTag={selectedTag}
        setSelectedTag={setSelectedTag}
        allTags={allTags}
      />

      {filtered.length === 0 ? (
        <p className="text-muted text-center py-4">
          {verses.length === 0
            ? 'No verses yet. Add your first verse above!'
            : 'No verses match your filters.'}
        </p>
      ) : (
        filtered.map(verse => (
          <VerseCard
            key={verse.id}
            verse={verse}
            onDelete={deleteVerse}
            onToggleMemorized={toggleMemorized}
          />
        ))
      )}

      {filtered.length > 0 && (
        <p className="text-muted text-center small mt-2">
          Showing {filtered.length} of {verses.length} verses
        </p>
      )}
    </Container>
  )
}

export default VersesPage
