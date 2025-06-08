const pool = require('../config')

const getAllStaffsDb = async () => {
  const { rows: staffs } = await pool.query(
    `SELECT * FROM public.users u WHERE u.roles IN ($1, $2)`,
    ['staff', 'doctor']
  )
  return staffs
}


const createStaffDb = async ({
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
  const { rows: staff } = await pool.query(
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
      roles,
    ],
  )
  return staff[0]
}

const getStaffByIdDb = async (staff_id) => {
  const { rows: staff } = await pool.query(
    'SELECT users.* FROM users WHERE users.user_id = $1',
    [staff_id],
  )
  return staff[0]
}

const getStaffByUsernameDb = async (staffName) => {
  const { rows: staff } = await pool.query(
    'SELECT users.* FROM users WHERE lower(users.username) = lower($1)',
    [staffName],
  )
  return staff[0]
}

const getStaffByEmailDb = async (email) => {
  const { rows: staff } = await pool.query(
    'SELECT users.* FROM users WHERE lower(email) = lower($1)',
    [email],
  )
  return staff[0]
}

const updateStaffDb = async ({
  username,
  email,
  fullname,
  staff_id,
  phone_numbers,
  address,
  city,
  country,
  avatar,
  roles,
}) => {
  const { rows: staff } = await pool.query(
    `UPDATE users set username = $1, email = $2, fullname = $3, phone_numbers = $4, address = $5, city = $6, country = $7, avatar = $8, roles = $10
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
      staff_id,
      roles,
    ],
  )
  return staff[0]
}

const deleteStaffDb = async (staff_id) => {
  const { rows: staff } = await pool.query(
    'DELETE FROM users WHERE user_id = $1 returning *',
    [staff_id],
  )
  return staff[0]
}

// const createStaffGoogleDb = async ({ sub, defaultUsername, email, name }) => {
//   const { rows } = await pool.query(
//     `INSERT INTO users(google_id,username, email, fullname)
//         VALUES($1, $2, $3, $4) ON CONFLICT (email)
//         DO UPDATE SET google_id = $1, fullname = $4 returning *`,
//     [sub, defaultUsername, email, name],
//   )
//   return rows[0]
// }

const changeStaffPasswordDb = async (hashedPassword, staffId) => {
  return await pool.query('update users set password = $1 WHERE user_id = $2', [
    hashedPassword,
    staffId,
  ])
}

module.exports = {
  getAllStaffsDb,
  getStaffByIdDb,
  getStaffByEmailDb,
  updateStaffDb,
  createStaffDb,
  deleteStaffDb,
  getStaffByUsernameDb,
  changeStaffPasswordDb,
}
