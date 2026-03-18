import { HashRouter, Routes, Route } from 'react-router-dom'
import Navigation from './components/Navigation'
import HomePage from './pages/HomePage'
import TasksPage from './pages/TasksPage'
import AboutPage from './pages/AboutPage'

function App() {
  return (
    <HashRouter>
      <Navigation />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/tasks" element={<TasksPage />} />
        <Route path="/about" element={<AboutPage />} />
      </Routes>
    </HashRouter>
  )
}

export default App
