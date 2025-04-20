const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME
});

exports.buscarDados = async () => {
  const [rows] = await pool.query('SELECT categoria, valor FROM dados_grafico');
  return rows;
};

