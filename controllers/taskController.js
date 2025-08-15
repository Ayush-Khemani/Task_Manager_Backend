// controllers/taskController.js
const pool = require('../db');

async function createTask (req, res) {
  try {
    const { title, description, user_id } = req.body;
    if (!title || !user_id) return res.status(400).json({ error: 'Title and user_id are required' });

    const [result] = await pool.execute(
      'INSERT INTO tasks (title, description, user_id) VALUES (?, ?, ?)',
      [title, description || null, user_id]
    );
    res.status(201).json({
      id: result.insertId,
      title,
      description,
      status: 'pending',
      user_id
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

async function getTasks (req, res) {
  try {
    let sql = 'SELECT * FROM tasks';
    let params = [];

    if (req.query.user_id) {
      sql += ' WHERE user_id = ?';
      params.push(req.query.user_id);
    }

    const [rows] = await pool.execute(sql, params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

async function updateTask (req, res) {
  try {
    const { id } = req.params;
    const { title, description, status } = req.body;

    const [result] = await pool.execute(
      'UPDATE tasks SET title = COALESCE(?, title), description = COALESCE(?, description), status = COALESCE(?, status) WHERE id = ?',
      [title, description, status, id]
    );

    if (result.affectedRows === 0) return res.status(404).json({ error: 'Task not found' });

    res.json({ message: 'Task updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

async function deleteTask (req, res) {
  try {
    const { id } = req.params;
    const [result] = await pool.execute('DELETE FROM tasks WHERE id = ?', [id]);

    if (result.affectedRows === 0) return res.status(404).json({ error: 'Task not found' });

    res.json({ message: 'Task deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


module.exports = {
    createTask,
    getTasks,
    updateTask,
    deleteTask
};
