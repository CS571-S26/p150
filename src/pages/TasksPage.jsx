import { useState } from 'react'
import { Container, Form, Button, ListGroup, Badge } from 'react-bootstrap'

function TasksPage() {
  const [tasks, setTasks] = useState([
    { id: 1, text: 'Set up React project', done: true },
    { id: 2, text: 'Add routing with HashRouter', done: true },
    { id: 3, text: 'Deploy to GitHub Pages', done: false },
  ])
  const [newTask, setNewTask] = useState('')

  const addTask = (e) => {
    e.preventDefault()
    const text = newTask.trim()
    if (!text) return
    setTasks([...tasks, { id: Date.now(), text, done: false }])
    setNewTask('')
  }

  const toggleTask = (id) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, done: !t.done } : t))
  }

  const removeTask = (id) => {
    setTasks(tasks.filter(t => t.id !== id))
  }

  const remaining = tasks.filter(t => !t.done).length

  return (
    <Container className="py-4" style={{ maxWidth: 600 }}>
      <h2 className="mb-3">
        My Tasks <Badge bg="secondary">{remaining} remaining</Badge>
      </h2>

      <Form onSubmit={addTask} className="d-flex gap-2 mb-3">
        <Form.Control
          type="text"
          placeholder="Add a new task..."
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
        />
        <Button type="submit" variant="primary">Add</Button>
      </Form>

      <ListGroup>
        {tasks.map(task => (
          <ListGroup.Item
            key={task.id}
            className="d-flex justify-content-between align-items-center"
          >
            <Form.Check
              type="checkbox"
              checked={task.done}
              onChange={() => toggleTask(task.id)}
              label={
                <span style={{ textDecoration: task.done ? 'line-through' : 'none' }}>
                  {task.text}
                </span>
              }
            />
            <Button
              variant="outline-danger"
              size="sm"
              onClick={() => removeTask(task.id)}
            >
              Remove
            </Button>
          </ListGroup.Item>
        ))}
        {tasks.length === 0 && (
          <ListGroup.Item className="text-muted text-center">
            No tasks yet. Add one above!
          </ListGroup.Item>
        )}
      </ListGroup>
    </Container>
  )
}

export default TasksPage
