const express = require('express');
const Database = require('better-sqlite3');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const db = new Database('./datos.db');

db.exec(`CREATE TABLE IF NOT EXISTS peliculas (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  titulo TEXT,
  vista INTEGER DEFAULT 0
)`);

db.exec(`CREATE TABLE IF NOT EXISTS series (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  titulo TEXT,
  vista INTEGER DEFAULT 0
)`);

db.exec(`CREATE TABLE IF NOT EXISTS recordatorios (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  fecha TEXT,
  texto TEXT
)`);

// Películas
app.get('/api/peliculas', (req, res) => {
  res.json(db.prepare('SELECT * FROM peliculas ORDER BY id DESC').all());
});
app.post('/api/peliculas', (req, res) => {
  const { titulo } = req.body;
  const result = db.prepare('INSERT INTO peliculas (titulo, vista) VALUES (?, 0)').run(titulo);
  res.json({ id: result.lastInsertRowid });
});
app.patch('/api/peliculas/:id', (req, res) => {
  const { vista } = req.body;
  db.prepare('UPDATE peliculas SET vista = ? WHERE id = ?').run(vista ? 1 : 0, req.params.id);
  res.json({ ok: true });
});
app.delete('/api/peliculas/:id', (req, res) => {
  db.prepare('DELETE FROM peliculas WHERE id = ?').run(req.params.id);
  res.json({ ok: true });
});

// Series
app.get('/api/series', (req, res) => {
  res.json(db.prepare('SELECT * FROM series ORDER BY id DESC').all());
});
app.post('/api/series', (req, res) => {
  const { titulo } = req.body;
  const result = db.prepare('INSERT INTO series (titulo, vista) VALUES (?, 0)').run(titulo);
  res.json({ id: result.lastInsertRowid });
});
app.patch('/api/series/:id', (req, res) => {
  const { vista } = req.body;
  db.prepare('UPDATE series SET vista = ? WHERE id = ?').run(vista ? 1 : 0, req.params.id);
  res.json({ ok: true });
});
app.delete('/api/series/:id', (req, res) => {
  db.prepare('DELETE FROM series WHERE id = ?').run(req.params.id);
  res.json({ ok: true });
});

// Recordatorios
app.get('/api/recordatorios', (req, res) => {
  res.json(db.prepare('SELECT * FROM recordatorios ORDER BY fecha ASC').all());
});
app.post('/api/recordatorios', (req, res) => {
  const { fecha, texto } = req.body;
  const result = db.prepare('INSERT INTO recordatorios (fecha, texto) VALUES (?, ?)').run(fecha, texto);
  res.json({ id: result.lastInsertRowid });
});
app.delete('/api/recordatorios/:id', (req, res) => {
  db.prepare('DELETE FROM recordatorios WHERE id = ?').run(req.params.id);
  res.json({ ok: true });
});

app.listen(3000, '0.0.0.0', () => {
  console.log('Servidor corriendo en el puerto 3000');
});