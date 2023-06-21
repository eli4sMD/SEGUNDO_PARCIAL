const express = require('express');
const app = express();
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const { query, mysqlConnection } = require('./database');
const mongoose = require('mongoose');

app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Un saludo');
});

app.get('/check-mysql-connection', async (req, res) => {
  try {
    // Obtener una conexión del pool
    await mysqlConnection.getConnection();

    // Retornar una respuesta exitosa
    res.json({ status: 'success', message: 'La conexión a MySQL exitosa' });
  } catch (error) {
    // Si ocurre un error, retornar una respuesta de error
    console.error('Error al conectar a MySQL:', error.message);
    res.status(500).json({ status: 'error', message: 'Error al conectar a MySQL' });
  }
});

app.get('/check-mongodb-connection', (req, res) => {
  const db = mongoose.connection;

  if (db.readyState === 1) {
    res.json({ status: 'success', message: 'La conexión a MongoDB exitosa' });
  } else {
    res.status(500).json({ status: 'error', message: 'Error al conectar a MongoDB' });
  }
});

app.listen(3000, () => {
  console.log('Escuchando en el puerto 3000');
});
