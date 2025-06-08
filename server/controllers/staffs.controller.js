const staffService = require('../services/staffs.service')
const { ErrorHandler } = require('../helpers/error')
const { hashPassword } = require('../helpers/hashPassword')
const { logger } = require('../utils/logger')

const getAllStaffs = async (req, res) => {
  const results = await staffService.getAllStaffs()
  res.status(200).json(results)
}

const createStaff = async (req, res) => {
  const {
    username,
    password,
    email,
    fullname,
    phone_numbers,
    address,
    city,
    country,
    avatar,
  } = req.body

  const hashedPassword = await hashPassword(password)

  const staff = await staffService.createStaff({
    username,
    password: hashedPassword,
    email,
    fullname,
    phone_numbers,
    address,
    city,
    country,
    avatar,
  })

  res.status(201).json({
    status: 'success',
    staff,
  })
}

const getStaffById = async (req, res) => {
  const { staff_id } = req.params
  if (+staff_id === req.staff.staff_id || req.user.roles.includes('admin')) {
    try {
      const staff = await staffService.getStaffById(staff_id)
      return res.status(200).json(staff)
    } catch (error) {
      throw new ErrorHandler(error.statusCode, 'Staff not found')
    }
  } else {
    throw new ErrorHandler(401, 'Unauthorized')
  }
}

const getStaffProfile = async (req, res) => {
  const { staff_id } = req.staff

  const staff = await staffService.getStaffById(staff_id)

  return res.status(200).json(staff)
}

const updateStaff = async (req, res) => {
  const { username, email, fullname, address, phone_numbers, city, country } =
    req.body
  if (
    +req.params.staff_id === req.staff.staff_id ||
    req.staff.roles.includes('admin')
  ) {
    try {
      const results = await staffService.updateStaff({
        username,
        email,
        fullname,
        phone_numbers,
        address,
        city,
        country,
        staff_id: req.params.staff_id,
      })
      return res.status(201).json(results)
    } catch (error) {
      throw new ErrorHandler(error.statusCode, error.message)
    }
  }
  throw new ErrorHandler(401, 'Unauthorized')
}

const deleteStaff = async (req, res) => {
  const { staff_id } = req.params
  if (
    req.staff &&
    (req.staff.staff_id === +staff_id || req.staff.roles.includes('admin'))
  ) {
    try {
      const result = await staffService.deleteStaff(staff_id)
      res.status(200).json(result)
    } catch (error) {
      throw new ErrorHandler(error.statusCode, error.message)
    }
  }
  // throw new ErrorHandler(401, "Unauthorized");
}

module.exports = {
  getAllStaffs,
  createStaff,
  getStaffById,
  updateStaff,
  deleteStaff,
  getStaffProfile,
}
