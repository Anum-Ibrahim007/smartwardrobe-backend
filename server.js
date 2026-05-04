const express = require('express');
const path = require('path'); // Add this at the top
const cors = require('cors');
require('dotenv').config();
require('./db'); // add this line

const app = express();

app.use(cors({
  origin: ['https://glowing-sunburst-cf792a.netlify.app', 'http://localhost:5000'],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '10mb' })); // 10mb needed for base64 images
app.use(express.static('public'));

// ── Routes ──────────────────────────────────────────────
app.use('/api/auth',    require('./routes/auth'));
app.use('/api/closet',  require('./routes/closet'));
app.use('/api/outfits', require('./routes/outfits'));

// ── Health check ────────────────────────────────────────
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ── Start ────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
