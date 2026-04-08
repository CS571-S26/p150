import { useMemo } from 'react'
import { Container, Row, Col, Card, ProgressBar, Table } from 'react-bootstrap'
import StreakTracker from '../components/StreakTracker'

function ProgressPage({ verses, streak, reviewHistory }) {
  const stats = useMemo(() => {
    const memorized = verses.filter(v => v.memorized).length
    const totalReviews = verses.reduce((sum, v) => sum + v.timesReviewed, 0)
    const retentionRate = verses.length > 0 ? Math.round((memorized / verses.length) * 100) : 0
    return { memorized, totalReviews, retentionRate }
  }, [verses])

  const recentHistory = useMemo(() => {
    return [...reviewHistory].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 7)
  }, [reviewHistory])

  const tagStats = useMemo(() => {
    const tagMap = {}
    verses.forEach(v => {
      v.tags.forEach(tag => {
        if (!tagMap[tag]) tagMap[tag] = { total: 0, memorized: 0 }
        tagMap[tag].total++
        if (v.memorized) tagMap[tag].memorized++
      })
    })
    return Object.entries(tagMap).sort((a, b) => b[1].total - a[1].total)
  }, [verses])

  return (
    <Container className="py-4" style={{ maxWidth: 900 }}>
      <h2 className="mb-4">Progress Dashboard</h2>

      <Row className="mb-4">
        <Col md={4} className="mb-3">
          <StreakTracker streak={streak} />
        </Col>
        <Col md={4} className="mb-3">
          <Card className="text-center h-100">
            <Card.Body>
              <h4 className="text-muted">Retention Rate</h4>
              <h2 className={stats.retentionRate >= 50 ? 'text-success' : 'text-warning'}>
                {stats.retentionRate}%
              </h2>
              <ProgressBar
                now={stats.retentionRate}
                variant={stats.retentionRate >= 70 ? 'success' : stats.retentionRate >= 40 ? 'warning' : 'danger'}
                className="mt-2"
              />
              <small className="text-muted mt-2 d-block">
                {stats.memorized} of {verses.length} verses memorized
              </small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} className="mb-3">
          <Card className="text-center h-100">
            <Card.Body>
              <h4 className="text-muted">Total Reviews</h4>
              <h2 className="text-primary">{stats.totalReviews}</h2>
              <small className="text-muted">across all verses</small>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col md={6} className="mb-4">
          <Card>
            <Card.Body>
              <Card.Title>Review History</Card.Title>
              {recentHistory.length === 0 ? (
                <p className="text-muted">No review history yet.</p>
              ) : (
                <Table size="sm" hover>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Verses Reviewed</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentHistory.map(entry => (
                      <tr key={entry.date}>
                        <td>{entry.date}</td>
                        <td>{entry.count}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} className="mb-4">
          <Card>
            <Card.Body>
              <Card.Title>Progress by Tag</Card.Title>
              {tagStats.length === 0 ? (
                <p className="text-muted">No tags yet.</p>
              ) : (
                tagStats.map(([tag, data]) => (
                  <div key={tag} className="mb-3">
                    <div className="d-flex justify-content-between mb-1">
                      <small className="fw-bold">{tag}</small>
                      <small className="text-muted">{data.memorized}/{data.total}</small>
                    </div>
                    <ProgressBar
                      now={data.total > 0 ? (data.memorized / data.total) * 100 : 0}
                      variant="info"
                    />
                  </div>
                ))
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}

export default ProgressPage
