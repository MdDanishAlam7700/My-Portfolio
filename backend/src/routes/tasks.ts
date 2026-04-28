import { Router } from 'express';
// import Task from '../models/Task'; // Disabled Mongoose model due to no local MongoDB

const router = Router();

// In-Memory Database Fallback for testing!
let tasks: any[] = [];
let nextId = 1;

// Get all tasks
router.get('/', (req, res) => {
  res.json(tasks.sort((a, b) => a.order - b.order));
});

// Create a task
router.post('/', (req, res) => {
  const { title, description, status, priority, dueDate, subtasks } = req.body;
  const newOrder = tasks.length > 0 ? Math.max(...tasks.map(t => t.order)) + 1000 : 1000;

  const newTask = {
    _id: `mock_id_${nextId++}_${Date.now()}`,
    title,
    description: description || '',
    status: status || 'todo',
    priority: priority || 'medium',
    dueDate: dueDate || null,
    subtasks: subtasks || [],
    tags: [],
    order: newOrder,
    createdAt: new Date().toISOString()
  };

  tasks.push(newTask);
  res.status(201).json(newTask);
});

// Update a task
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const index = tasks.findIndex(t => t._id === id);
  
  if (index === -1) return res.status(404).json({ error: 'Task not found' });
  
  tasks[index] = { ...tasks[index], ...req.body };
  res.json(tasks[index]);
});

// Delete a task
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  const initialLength = tasks.length;
  tasks = tasks.filter(t => t._id !== id);
  if (tasks.length === initialLength) return res.status(404).json({ error: 'Task not found' });
  res.json({ message: 'Task deleted successfully' });
});

// Reorder tasks
router.put('/reorder', (req, res) => {
  const { updates } = req.body;
  if (!Array.isArray(updates)) return res.status(400).json({ error: 'Invalid payload' });

  updates.forEach(update => {
    const task = tasks.find(t => t._id === update.id);
    if (task) {
      task.order = update.order;
      if (update.status) task.status = update.status;
    }
  });

  res.json({ message: 'Tasks reordered successfully' });
});

export default router;
