const express = require('express');
const router = express.Router();
const db = require('../db');
const { verifyToken } = require('./auth');

// ── GET all saved outfits ───────────────────────────────
router.get('/', verifyToken, async (req, res) => {
  try {
    const result = await db.query(
      'SELECT * FROM saved_outfits WHERE user_id = $1 ORDER BY saved_at DESC',
      [req.userId]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// ── SAVE outfit ─────────────────────────────────────────
router.post('/', verifyToken, async (req, res) => {
  const { name, item_ids, score, emojis } = req.body;
  if (!item_ids || !item_ids.length)
    return res.status(400).json({ error: 'item_ids are required' });
  try {
    const result = await db.query(
      'INSERT INTO saved_outfits (user_id, name, item_ids, score, emojis) VALUES ($1, $2, $3, $4, $5) RETURNING id',
      [req.userId, name, JSON.stringify(item_ids), score, emojis]
    );
    res.json({ id: result.rows[0].id, message: 'Outfit saved successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// ── DELETE outfit ───────────────────────────────────────
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    await db.query(
      'DELETE FROM saved_outfits WHERE id=$1 AND user_id=$2',
      [req.params.id, req.userId]
    );
    res.json({ message: 'Outfit deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
