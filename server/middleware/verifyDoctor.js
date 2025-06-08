const { ErrorHandler } = require('../helpers/error')

module.exports = (req, res, next) => {
  const { roles, user_id: staff_id } = req.user
  if (roles && roles.includes('doctor')) {
    req.staff = {
      ...req.user,
      roles,
      staff_id,
    }
    return next()
  } else {
    throw new ErrorHandler(401, 'Yêu cầu vai trò doctor')
  }
}