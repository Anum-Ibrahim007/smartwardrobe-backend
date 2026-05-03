const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');

// ── Middleware ──────────────────────────────────────────
function verifyToken(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: 'No token provided' });
  try {
    const decoded = jwt.verify(auth.split(' ')[1], process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
}

// ── REGISTER ────────────────────────────────────────────
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password)
    return res.status(400).json({ error: 'All fields are required' });
  try {
    const hashed = await bcrypt.hash(password, 10);
    await db.query(
      'INSERT INTO users (name, email, password) VALUES ($1, $2, $3)',
      [name, email, hashed]
    );
    res.json({ message: 'Registered successfully' });
  } catch (err) {
    if (err.code === '23505')
      return res.status(400).json({ error: 'Email already registered' });
    res.status(500).json({ error: 'Server error' });
  }
});

// ── LOGIN ───────────────────────────────────────────────
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ error: 'Email and password required' });
  try {
    const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    if (!result.rows.length)
      return res.status(401).json({ error: 'Invalid credentials' });
    const user = result.rows[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return res.status(401).json({ error: 'Invalid credentials' });
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({
      token,
      user: {
        id:              user.id,
        name:            user.name,
        email:           user.email,
        season:          user.season,
        age:             user.age,
        gender:          user.gender,
        preferred_style: user.preferred_style,
        body_type:       user.body_type,
      }
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// ── UPDATE PROFILE ──────────────────────────────────────
router.put('/profile', verifyToken, async (req, res) => {
  const { name, age, gender, preferred_style, body_type, season } = req.body;
  try {
    await db.query(
      'UPDATE users SET name=$1, age=$2, gender=$3, preferred_style=$4, body_type=$5, season=$6 WHERE id=$7',
      [name, age, gender, preferred_style, body_type, season, req.userId]
    );
    res.json({ message: 'Profile updated successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// ── GET PROFILE ─────────────────────────────────────────
router.get('/profile', verifyToken, async (req, res) => {
  try {
    const result = await db.query(
      'SELECT id, name, email, season, age, gender, preferred_style, body_type FROM users WHERE id=$1',
      [req.userId]
    );
    if (!result.rows.length)
      return res.status(404).json({ error: 'User not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
module.exports.verifyToken = verifyToken;
