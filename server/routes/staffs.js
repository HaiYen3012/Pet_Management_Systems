const {
  getAllStaffs,
  createStaff,
  getStaffById,
  updateStaff,
  deleteStaff,
  getStaffProfile,
} = require('../controllers/staffs.controller')
const router = require('express').Router()
const verifyStaff = require('../middleware/verifyStaff')
const verifyToken = require('../middleware/verifyToken')
const verifyAdmin = require('../middleware/verifyAdmin')

router.use(verifyToken)
router.use(verifyStaff)
router.route('/').get(verifyAdmin, getAllStaffs).post(verifyAdmin, createStaff)
router.route('/profile').get(getStaffProfile)
router
  .route('/:staff_id')
  .get(getStaffById)
  .put(updateStaff)
  .delete(deleteStaff)

module.exports = router
