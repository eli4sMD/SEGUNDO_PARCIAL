const mysql = require('mysql2');
const mongoose = require('mongoose');

// Configuración de conexión a MySQL
const mysqlPool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  port: process.env.MYSQL_PORT,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  connectionLimit: 20
});

// Configuración de conexión a MongoDB
const mongoURI = `mongodb+srv://elias:elias@servidortp.wqke606.mongodb.net/`;

// Conexión a la base de datos MySQL
const mysqlConnection = mysqlPool.promise();

// Conexión a la base de datos MongoDB
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Conexión exitosa a MongoDB'))
  .catch(error => console.error('Error al conectar a MongoDB:', error));

async function getConnection() {
  try {
    const connection = await mysqlConnection.getConnection();
    return connection;
  } catch (error) {
    console.error("OCURRIÓ UN ERROR AL CONECTAR A LA DB: ", error.message);
    throw error;
  }
}

async function query(sql, values) {
  let conn;
  try {
    conn = await getConnection();
    const result = await conn.query(sql, values);
    return result;
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    if (conn) {
      conn.release();
    }
  }
}

module.exports = { mysqlConnection, getConnection, query };
