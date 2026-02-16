const express = require('express');
const db = require('../database');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Get all tasks for the logged in user
router.get('/', authMiddleware, (req, res) => {
    const { status, search } = req.query;
    let sql = `SELECT * FROM tasks WHERE user_id = ?`;
    let params = [req.user.id];

    if (status) {
        sql += ` AND status = ?`;
        params.push(status);
    }

    if (search) {
        sql += ` AND (title LIKE ? OR description LIKE ?)`;
        params.push(`%${search}%`, `%${search}%`);
    }

    sql += ` ORDER BY created_at DESC`;

    db.all(sql, params, (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// Create a new task
router.post('/', authMiddleware, (req, res) => {
    const { title, description, status } = req.body;

    if (!title) {
        return res.status(400).json({ error: 'Title is required' });
    }

    const sql = `INSERT INTO tasks (user_id, title, description, status) VALUES (?, ?, ?, ?)`;
    const taskStatus = status || 'pending';

    db.run(sql, [req.user.id, title, description, taskStatus], function (err) {
        if (err) return res.status(500).json({ error: err.message });

        db.get(`SELECT * FROM tasks WHERE id = ?`, [this.lastID], (err, row) => {
            if (err) return res.status(500).json({ error: err.message });
            res.status(201).json(row);
        });
    });
});

// Update a task
router.put('/:id', authMiddleware, (req, res) => {
    const { title, description, status } = req.body;
    const { id } = req.params;

    // Check if task exists and belongs to user
    db.get(`SELECT * FROM tasks WHERE id = ? AND user_id = ?`, [id, req.user.id], (err, task) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!task) return res.status(404).json({ error: 'Task not found' });

        const sql = `UPDATE tasks SET title = ?, description = ?, status = ? WHERE id = ?`;
        db.run(sql, [title || task.title, description || task.description, status || task.status, id], function (err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: 'Task updated successfully' });
        });
    });
});

// Delete a task
router.delete('/:id', authMiddleware, (req, res) => {
    const { id } = req.params;
    const sql = `DELETE FROM tasks WHERE id = ? AND user_id = ?`;

    db.run(sql, [id, req.user.id], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        if (this.changes === 0) return res.status(404).json({ error: 'Task not found' });
        res.json({ message: 'Task deleted successfully' });
    });
});

module.exports = router;
