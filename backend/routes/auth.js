const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../database');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const sql = `INSERT INTO users (username, email, password) VALUES (?, ?, ?)`;

        db.run(sql, [username, email, hashedPassword], function (err) {
            if (err) {
                if (err.message.includes('UNIQUE constraint failed')) {
                    return res.status(400).json({ error: 'Username or email already exists' });
                }
                return res.status(500).json({ error: err.message });
            }
            res.status(201).json({ message: 'User registered successfully', userId: this.lastID });
        });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Login
router.post('/login', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    const sql = `SELECT * FROM users WHERE email = ?`;
    db.get(sql, [email], async (err, user) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!user) return res.status(400).json({ error: 'Invalid credentials' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token, user: { id: user.id, username: user.username, email: user.email, bio: user.bio } });
    });
});

// Get User Profile
router.get('/me', authMiddleware, (req, res) => {
    const sql = `SELECT id, username, email, bio FROM users WHERE id = ?`;
    db.get(sql, [req.user.id], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!row) return res.status(404).json({ error: 'User not found' });
        res.json(row);
    });
});

// Update User Profile
router.put('/me', authMiddleware, (req, res) => {
    const { bio, username } = req.body;
    // Allow updating bio and username (if unique)

    const sql = `UPDATE users SET bio = ?, username = ? WHERE id = ?`;
    db.run(sql, [bio, username, req.user.id], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Profile updated successfully' });
    });
});

// Change Password
router.put('/change-password', authMiddleware, async (req, res) => {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    const sql = `SELECT password FROM users WHERE id = ?`;
    db.get(sql, [req.user.id], async (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!row) return res.status(404).json({ error: 'User not found' });

        const isMatch = await bcrypt.compare(currentPassword, row.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Incorrect current password' });
        }

        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        const updateSql = `UPDATE users SET password = ? WHERE id = ?`;

        db.run(updateSql, [hashedNewPassword, req.user.id], function (err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: 'Password updated successfully' });
        });
    });
});

module.exports = router;
