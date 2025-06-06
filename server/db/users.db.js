const pool = require('../config')

const getAllUsersDb = async () => {
  const { rows: users } = await pool.query('SELECT * FROM users')
  return users
}

const getAllCustomersDb = async () => {
  const { rows: users } = await pool.query(`
      SELECT user_id, username, email, fullname, phone_numbers, roles, address, city, country, avatar, created_at
      FROM users
      WHERE roles = $1
    `, ['customer']);
  return users;
};

const createUserDb = async ({
  username,
  password,
  email,
  fullname,
  phone_numbers,
  address,
  city,
  country,
  avatar,
  roles,
}) => {
  const { rows: user } = await pool.query(
    `INSERT INTO users(username, password, email, fullname, phone_numbers, address, city, country, avatar, roles) 
        VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) 
        returning user_id, username, email, fullname, roles, phone_numbers, address, city, country, created_at, avatar`,
    [
      username,
      password,
      email,
      fullname,
      phone_numbers,
      address,
      city,
      country,
      avatar,
      roles ?? 'customer',
    ],
  )
  return user[0]
}

const getUserByIdDb = async (user_id) => {
  const { rows: user } = await pool.query(
    'SELECT users.* FROM users WHERE users.user_id = $1',
    [user_id],
  )
  return user[0]
}
const getUserByUsernameDb = async (username) => {
  const { rows: user } = await pool.query(
    'SELECT users.* FROM users WHERE lower(users.username) = lower($1)',
    [username],
  )
  return user[0]
}

const getUserByEmailDb = async (email) => {
  const { rows: user } = await pool.query(
    'SELECT users.* FROM users WHERE lower(email) = lower($1)',
    [email],
  )
  return user[0]
}

const updateUserDb = async ({
  username,
  email,
  fullname,
  user_id,
  phone_numbers,
  address,
  city,
  country,
  avatar,
}) => {
  const { rows: user } = await pool.query(
    `UPDATE users set username = $1, email = $2, fullname = $3, phone_numbers = $4, address = $5, city = $6, country = $7, avatar = $8
        WHERE user_id = $9 returning username, email, fullname, user_id, phone_numbers, address, city, country, avatar`,
    [
      username,
      email,
      fullname,
      phone_numbers,
      address,
      city,
      country,
      avatar,
      user_id,
    ],
  )
  return user[0]
}

const deleteUserDb = async (user_id) => {
  const { rows: user } = await pool.query(
    'DELETE FROM users WHERE user_id = $1 returning *',
    [user_id],
  )
  return user[0]
}

const createUserGoogleDb = async ({ sub, defaultUsername, email, name }) => {
  const { rows } = await pool.query(
    `INSERT INTO users(google_id,username, email, fullname) 
        VALUES($1, $2, $3, $4) ON CONFLICT (email) 
        DO UPDATE SET google_id = $1, fullname = $4 returning *`,
    [sub, defaultUsername, email, name],
  )
  return rows[0]
}

const changeUserPasswordDb = async (hashedPassword, email) => {
  return await pool.query('update users set password = $1 WHERE email = $2', [
    hashedPassword,
    email,
  ])
}

module.exports = {
  getAllUsersDb,
  getUserByIdDb,
  getUserByEmailDb,
  updateUserDb,
  createUserDb,
  createUserGoogleDb,
  deleteUserDb,
  getUserByUsernameDb,
  changeUserPasswordDb,
  getAllCustomersDb
}
