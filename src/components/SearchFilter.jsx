import { Form, Row, Col, Button } from 'react-bootstrap'
import TagBadge from './TagBadge'

function SearchFilter({ searchTerm, setSearchTerm, selectedTag, setSelectedTag, allTags }) {
  return (
    <div className="mb-3">
      <Row className="align-items-end">
        <Col md={8}>
          <Form.Group>
            <Form.Label>Search verses</Form.Label>
            <Form.Control
              type="text"
              placeholder="Search by reference or keyword..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Form.Group>
        </Col>
        <Col md={4}>
          <Form.Group>
            <Form.Label>Filter by tag</Form.Label>
            <Form.Select
              value={selectedTag}
              onChange={(e) => setSelectedTag(e.target.value)}
            >
              <option value="">All tags</option>
              {allTags.map(tag => (
                <option key={tag} value={tag}>{tag}</option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
      </Row>
      {selectedTag && (
        <div className="mt-2">
          Filtered by: <TagBadge tag={selectedTag} onClick={() => setSelectedTag('')} />
          <Button variant="link" size="sm" className="p-0 ms-2" onClick={() => setSelectedTag('')}>
            Clear
          </Button>
        </div>
      )}
    </div>
  )
}

export default SearchFilter
