const pool = require('../config')

const isValidTokenDb = async ({ token, email, curDate }) => {
  const { rows } = await pool.query(
    `
      SELECT EXISTS(select * from public."reset_tokens" 
      where token = $1 AND email = $2 AND expiration > $3 AND used = $4)
    `,
    [token, email, curDate, false],
  )
  return rows[0].exists
}

const createResetTokenDb = async ({ email, expireDate, fpSalt }) => {
  await pool.query(
    'insert into public."reset_tokens" (email, expiration, token, used) values ($1, $2, $3, $4)',
    [email, expireDate, fpSalt, false],
  )

  return true
}

const setTokenStatusDb = async (email) => {
  await pool.query(
    'update public."reset_tokens" set used = $1 where email = $2',
    [true, email],
  )

  return true
}

const deleteResetTokenDb = async (curDate) => {
  await pool.query('delete from public."reset_tokens" where expiration <= $1', [
    curDate,
  ])
  return true
}

const activityLogin = async (type_user) => {
  await pool.query(`insert into public."log_login" (type_user) values($1)`, [
    type_user,
  ])
  return true
}

module.exports = {
  isValidTokenDb,
  createResetTokenDb,
  setTokenStatusDb,
  deleteResetTokenDb,
  activityLogin,
}
