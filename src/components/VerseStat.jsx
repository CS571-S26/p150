import { Card, Button, Badge } from 'react-bootstrap'
import { Link } from 'react-router-dom'

function VerseStat({ label, value, color = 'primary', linkTo, linkLabel, badge, urgent }) {
  return (
    <Card className="stat-card text-center h-100">
      <Card.Body>
        <h3 className={`stat-number text-${color}`}>
          {value}
          {badge && <Badge bg={color} className="ms-2 fs-6 align-middle">{badge}</Badge>}
        </h3>
        <p className="text-muted mb-2">{label}</p>
        {linkTo && (
          <Button
            as={Link}
            to={linkTo}
            variant={urgent ? color : `outline-${color}`}
            size="sm"
          >
            {linkLabel}
          </Button>
        )}
      </Card.Body>
    </Card>
  )
}

export default VerseStat
