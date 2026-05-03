const express = require('express');
const router = express.Router();
const db = require('../db');
const { verifyToken } = require('./auth');

// ── GET all items ───────────────────────────────────────
router.get('/', verifyToken, async (req, res) => {
  try {
    const result = await db.query(
      'SELECT * FROM clothing_items WHERE user_id = $1 ORDER BY created_at DESC',
      [req.userId]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// ── ADD item ────────────────────────────────────────────
router.post('/', verifyToken, async (req, res) => {
  const { name, type, color, season, formality, fabric, status, image_data } = req.body;
  if (!name || !type)
    return res.status(400).json({ error: 'Name and type are required' });
  try {
    const result = await db.query(
      `INSERT INTO clothing_items 
       (user_id, name, type, color, season, formality, fabric, status, image_data) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id`,
      [req.userId, name, type, color, season, formality, fabric, status || 'clean', image_data || null]
    );
    res.json({ id: result.rows[0].id, message: 'Item added successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// ── EDIT item ───────────────────────────────────────────
router.put('/:id', verifyToken, async (req, res) => {
  const { name, type, color, season, formality, fabric, status, image_data } = req.body;
  try {
    await db.query(
      `UPDATE clothing_items 
       SET name=$1, type=$2, color=$3, season=$4, formality=$5, fabric=$6, status=$7, image_data=$8 
       WHERE id=$9 AND user_id=$10`,
      [name, type, color, season, formality, fabric, status, image_data, req.params.id, req.userId]
    );
    res.json({ message: 'Item updated successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// ── UPDATE STATUS only (laundry tracker) ───────────────
router.patch('/:id/status', verifyToken, async (req, res) => {
  const { status } = req.body;
  const allowed = ['clean', 'dirty', 'repair'];
  if (!allowed.includes(status))
    return res.status(400).json({ error: 'Invalid status value' });
  try {
    await db.query(
      'UPDATE clothing_items SET status=$1 WHERE id=$2 AND user_id=$3',
      [status, req.params.id, req.userId]
    );
    res.json({ message: 'Status updated' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// ── INCREMENT wear count ────────────────────────────────
router.patch('/:id/wear', verifyToken, async (req, res) => {
  try {
    await db.query(
      'UPDATE clothing_items SET wear_count = wear_count + 1 WHERE id=$1 AND user_id=$2',
      [req.params.id, req.userId]
    );
    res.json({ message: 'Wear count updated' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// ── DELETE item ─────────────────────────────────────────
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    await db.query(
      'DELETE FROM clothing_items WHERE id=$1 AND user_id=$2',
      [req.params.id, req.userId]
    );
    res.json({ message: 'Item deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
