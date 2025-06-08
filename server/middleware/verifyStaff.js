const { ErrorHandler } = require('../helpers/error')

// verifyStaff.js
module.exports = (req, res, next) => {
  const { roles, user_id: staff_id } = req.user;
  if (roles && (roles.includes('staff') || roles.includes('doctor') || roles.includes('admin'))) {
    req.staff = {
      ...req.user,
      roles,
      staff_id,
    };
    return next();
  } else {
    throw new ErrorHandler(401, 'Yêu cầu vai trò staff, doctor hoặc admin');
  }
};