import { useState, useMemo } from 'react'
import { Container, Badge } from 'react-bootstrap'
import VerseCard from '../components/VerseCard'
import AddVerseForm from '../components/AddVerseForm'
import SearchFilter from '../components/SearchFilter'

function VersesPage({ verses, addVerse, deleteVerse, toggleMemorized }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTag, setSelectedTag] = useState('')

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
      return matchesSearch && matchesTag
    })
  }, [verses, searchTerm, selectedTag])

  return (
    <Container className="py-4" style={{ maxWidth: 800 }}>
      <h2 className="mb-3">
        My Verses <Badge bg="secondary">{verses.length}</Badge>
      </h2>

      <AddVerseForm onAdd={addVerse} />
      <SearchFilter
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedTag={selectedTag}
        setSelectedTag={setSelectedTag}
        allTags={allTags}
      />

      {filtered.length === 0 ? (
        <p className="text-muted text-center py-4">
          {verses.length === 0 ? 'No verses yet. Add your first verse above!' : 'No verses match your search.'}
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
    </Container>
  )
}

export default VersesPage
