import { ButtonGroup, Button } from 'react-bootstrap'

const VIEWS = [
  { id: 'card', label: 'Card', icon: '☰' },
  { id: 'list', label: 'List', icon: '≡' },
  { id: 'grid', label: 'Grid', icon: '⊞' },
]

function ViewToggle({ value, onChange }) {
  return (
    <ButtonGroup size="sm" aria-label="Verse view mode">
      {VIEWS.map(v => (
        <Button
          key={v.id}
          variant={value === v.id ? 'primary' : 'outline-secondary'}
          onClick={() => onChange(v.id)}
          aria-pressed={value === v.id}
          aria-label={`${v.label} view`}
        >
          <span className="me-1" aria-hidden="true">{v.icon}</span>
          {v.label}
        </Button>
      ))}
    </ButtonGroup>
  )
}

export default ViewToggle
