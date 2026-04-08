import { Badge } from 'react-bootstrap'

const TAG_COLORS = {
  faith: 'primary',
  love: 'danger',
  salvation: 'success',
  strength: 'warning',
  comfort: 'info',
  trust: 'secondary',
  wisdom: 'dark',
  hope: 'primary',
}

function TagBadge({ tag, onClick }) {
  const color = TAG_COLORS[tag] || 'secondary'
  return (
    <Badge
      bg={color}
      className={onClick ? 'tag-badge clickable' : 'tag-badge'}
      onClick={onClick}
      style={onClick ? { cursor: 'pointer' } : {}}
    >
      {tag}
    </Badge>
  )
}

export default TagBadge
