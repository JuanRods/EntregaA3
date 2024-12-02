const db = require('mysql2'); // ou qualquer cliente MySQL que você usa

const pool = db.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  port: process.env.DB_PORT,
});

module.exports.produtosMaisVendidos = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT produto_id, COUNT(*) AS total_vendas
      FROM vendas
      GROUP BY produto_id
      ORDER BY total_vendas DESC
      LIMIT 10;
    `);
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).send('Erro ao gerar relatório.');
  }
};
