require('dotenv').config()
const { Pool } = require('pg')

const connectionString = process.env.DATABASE_URL

const pool = new Pool({
  user: 'postgres',
  password: '23102004',
  host: 'localhost',
  port: 5432,
  database: 'pet_home',
  ssl: false, // Bắt buộc phải false với PostgreSQL local
});

module.exports = {
  connect: async () => await pool.connect(),
  query: (text, params) => pool.query(text, params),
  end: () => pool.end(),
}
