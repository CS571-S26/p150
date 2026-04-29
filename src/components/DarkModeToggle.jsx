import { Form } from 'react-bootstrap'

function DarkModeToggle({ darkMode, setDarkMode }) {
  return (
    <Form.Check
      type="switch"
      id="dark-mode-switch"
      label={darkMode ? 'Dark mode' : 'Light mode'}
      checked={darkMode}
      onChange={() => setDarkMode(!darkMode)}
      className="text-light"
      aria-label={`Toggle dark mode, currently ${darkMode ? 'on' : 'off'}`}
    />
  )
}

export default DarkModeToggle
