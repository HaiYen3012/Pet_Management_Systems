const { ErrorHandler } = require('../helpers/error')

module.exports = (req, res, next) => {
  const { roles, user_id: staff_id } = req.user
  if (roles && (roles.includes('staff') || roles.includes('admin'))) {
    console.log(req.staff)
    req.staff = {
      ...req.user,
      roles,
      staff_id,
    }
    return next()
  } else {
    throw new ErrorHandler(401, 'require admin role or staff role')
  }
}
