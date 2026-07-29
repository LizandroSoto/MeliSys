const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const db = new sqlite3.Database('./datos.db');

db.run(`CREATE TABLE IF NOT EXISTS registros (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  contenido TEXT
)`);

app.get('/api/registros', (req, res) => {
  db.all('SELECT * FROM registros', [], (err, rows) => {
    res.json(rows);
  });
});

app.post('/api/registros', (req, res) => {
  const { contenido } = req.body;
  db.run('INSERT INTO registros (contenido) VALUES (?)', [contenido], function(err) {
    res.json({ id: this.lastID });
  });
});

app.listen(3000, '0.0.0.0', () => {
  console.log('Servidor corriendo en el puerto 3000');
});