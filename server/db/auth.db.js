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

const activityLogin = async ({
    user_id = 1,
    type_user = 'customer',            // enum roles_t
    login_method = 'email',         // enum login_method_t
    ip_address = null,
    user_agent = null,
    success = true,
    error_message = null,
  }) => {
    if (!user_id) {
      throw new Error('user_id is required for login logging')
    }

    await pool.query(
      `
      INSERT INTO public."log_login" 
        (user_id, type_user, login_method, ip_address, user_agent, success, error_message)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      `,
      [user_id, type_user, login_method, ip_address, user_agent, success, error_message]
    )

    return true
}

module.exports = {
  isValidTokenDb,
  createResetTokenDb,
  setTokenStatusDb,
  deleteResetTokenDb,
  activityLogin,
}
