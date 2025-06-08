require('dotenv').config()
const { Pool } = require('pg')

const connectionString = process.env.DATABASE_URL
const dbPassword = process.env.DB_PASSWORD
const dbName = process.env.DB_NAME

const pool = new Pool({
  user: 'postgres',
  password: dbPassword,
  host: 'localhost',
  port: 5432,
  database: dbName,
  ssl: false, // Bắt buộc phải false với PostgreSQL local
});

module.exports = {
  connect: async () => await pool.connect(),
  query: (text, params) => pool.query(text, params),
  end: () => pool.end(),
}
