const express = require('express');
const Database = require('better-sqlite3');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const db = new Database('./datos.db');

db.exec(`CREATE TABLE IF NOT EXISTS registros (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  contenido TEXT
)`);

app.get('/api/registros', (req, res) => {
  const rows = db.prepare('SELECT * FROM registros').all();
  res.json(rows);
});

app.post('/api/registros', (req, res) => {
  const { contenido } = req.body;
  const result = db.prepare('INSERT INTO registros (contenido) VALUES (?)').run(contenido);
  res.json({ id: result.lastInsertRowid });
});

app.listen(3000, '0.0.0.0', () => {
  console.log('Servidor corriendo en el puerto 3000');
});