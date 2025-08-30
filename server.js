// server.js
const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve all static assets from /public
app.use(express.static(path.join(__dirname, 'public')));

// Route all other requests to index.html (for single-page apps)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Pittsburgh Prestige Remodeling site running at http://localhost:${PORT}`);
});
