import { useMemo } from 'react'
import { Container, Row, Col, Card, ProgressBar } from 'react-bootstrap'
import StreakTracker from '../components/StreakTracker'
import ReviewChart from '../components/ReviewChart'

function ProgressPage({ verses, streak, reviewHistory }) {
  const stats = useMemo(() => {
    const memorized = verses.filter(v => v.memorized).length
    const totalReviews = verses.reduce((sum, v) => sum + v.timesReviewed, 0)
    const retentionRate = verses.length > 0 ? Math.round((memorized / verses.length) * 100) : 0
    const today = new Date().toISOString().split('T')[0]
    const dueToday = verses.filter(v => !v.nextReviewDate || v.nextReviewDate <= today).length
    return { memorized, totalReviews, retentionRate, dueToday }
  }, [verses])

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
        <Col md={3} className="mb-3">
          <StreakTracker streak={streak} />
        </Col>
        <Col md={3} className="mb-3">
          <Card className="text-center h-100">
            <Card.Body>
              <p className="text-muted mb-1">Retention Rate</p>
              <h2 className={stats.retentionRate >= 50 ? 'text-success' : 'text-warning'}>
                {stats.retentionRate}%
              </h2>
              <ProgressBar
                now={stats.retentionRate}
                variant={stats.retentionRate >= 70 ? 'success' : stats.retentionRate >= 40 ? 'warning' : 'danger'}
                style={{ height: 6 }}
              />
              <small className="text-muted d-block mt-1">
                {stats.memorized} / {verses.length} memorized
              </small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} className="mb-3">
          <Card className="text-center h-100">
            <Card.Body>
              <p className="text-muted mb-1">Total Reviews</p>
              <h2 className="text-primary">{stats.totalReviews}</h2>
              <small className="text-muted">all time</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} className="mb-3">
          <Card className="text-center h-100">
            <Card.Body>
              <p className="text-muted mb-1">Due Today</p>
              <h2 className={stats.dueToday > 0 ? 'text-danger' : 'text-success'}>
                {stats.dueToday}
              </h2>
              <small className="text-muted">{stats.dueToday === 0 ? 'All caught up!' : 'verses waiting'}</small>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col md={7} className="mb-4">
          <Card className="h-100">
            <Card.Body>
              <Card.Title>Reviews This Week</Card.Title>
              <ReviewChart reviewHistory={reviewHistory} />
            </Card.Body>
          </Card>
        </Col>
        <Col md={5} className="mb-4">
          <Card className="h-100">
            <Card.Body>
              <Card.Title>Progress by Tag</Card.Title>
              {tagStats.length === 0 ? (
                <p className="text-muted">No tags yet.</p>
              ) : (
                tagStats.map(([tag, data]) => (
                  <div key={tag} className="mb-3">
                    <div className="d-flex justify-content-between mb-1">
                      <small className="fw-bold text-capitalize">{tag}</small>
                      <small className="text-muted">{data.memorized}/{data.total}</small>
                    </div>
                    <ProgressBar
                      now={data.total > 0 ? (data.memorized / data.total) * 100 : 0}
                      variant="info"
                      style={{ height: 8 }}
                    />
                  </div>
                ))
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col>
          <Card>
            <Card.Body>
              <Card.Title>All Verses — Review Schedule</Card.Title>
              <div className="table-responsive">
                <table className="table table-sm table-hover mb-0">
                  <thead>
                    <tr>
                      <th>Reference</th>
                      <th>Reviews</th>
                      <th>Last Reviewed</th>
                      <th>Next Due</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {verses.map(v => {
                      const today = new Date().toISOString().split('T')[0]
                      const isDue = !v.nextReviewDate || v.nextReviewDate <= today
                      return (
                        <tr key={v.id}>
                          <td className="fw-semibold">{v.reference}</td>
                          <td>{v.timesReviewed}</td>
                          <td>{v.lastReviewed || '—'}</td>
                          <td>{v.nextReviewDate || '—'}</td>
                          <td>
                            {v.memorized
                              ? <span className="text-success">✓ Memorized</span>
                              : isDue
                                ? <span className="text-danger">Due</span>
                                : <span className="text-muted">Scheduled</span>
                            }
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}

export default ProgressPage
