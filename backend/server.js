const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Create SQLite database
const db = new sqlite3.Database('events.db');

// Create events table
db.run(`CREATE TABLE IF NOT EXISTS events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT,
  date TEXT,
  location TEXT
)`);

// Get all events
app.get('/api/events', (req, res) => {
  db.all('SELECT * FROM events', [], (err, rows) => {
    if (err) return res.json({ error: err.message });
    res.json(rows);
  });
});

// Create event
app.post('/api/events', (req, res) => {
  const { title, date, location } = req.body;
  db.run('INSERT INTO events (title, date, location) VALUES (?, ?, ?)',
    [title, date, location],
    function(err) {
      if (err) return res.json({ error: err.message });
      res.json({ id: this.lastID, title, date, location });
    });
});

// Update event
app.put('/api/events/:id', (req, res) => {
  const { title, date, location } = req.body;
  db.run('UPDATE events SET title = ?, date = ?, location = ? WHERE id = ?',
    [title, date, location, req.params.id],
    (err) => {
      if (err) return res.json({ error: err.message });
      res.json({ message: 'Event updated' });
    });
});

// Delete event
app.delete('/api/events/:id', (req, res) => {
  db.run('DELETE FROM events WHERE id = ?', [req.params.id], (err) => {
    if (err) return res.json({ error: err.message });
    res.json({ message: 'Event deleted' });
  });
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));