import { Card } from 'react-bootstrap'

function StreakTracker({ streak }) {
  return (
    <Card className="streak-card text-center">
      <Card.Body>
        <div className="streak-flame">{streak.current > 0 ? '\uD83D\uDD25' : '\u2744\uFE0F'}</div>
        <h2 className="streak-number">{streak.current}</h2>
        <p className="text-muted mb-1">Day Streak</p>
        <small className="text-muted">Best: {streak.best} days</small>
      </Card.Body>
    </Card>
  )
}

export default StreakTracker
