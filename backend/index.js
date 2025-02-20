const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME
});

db.connect(err => {
  if (err) console.error('Error al conectar a la BD:', err);
  else console.log('Conectado a la base de datos.');
});

app.get('/api/datos', (req, res) => {
  db.query('SELECT * FROM mi_tabla', (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

app.listen(3001, () => console.log('Servidor en puerto 3001'));
