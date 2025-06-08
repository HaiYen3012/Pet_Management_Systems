const {
  getAllStaffsDb,
  getStaffByIdDb,
  getStaffByEmailDb,
  updateStaffDb,
  createStaffDb,
  deleteStaffDb,
  getStaffByUsernameDb,
  changeStaffPasswordDb,
} = require('../db/staffs.db')
const { ErrorHandler } = require('../helpers/error')
const { logger } = require('../utils/logger')

class StaffService {
  createStaff = async (staff) => {
    try {
      console.log(staff)
      const { email, username } = staff
      const errors = {}
      

      const foundUserByEmail = await getStaffByEmailDb(email)
      const foundUserByName = await getStaffByUsernameDb(username)

      if (typeof foundUserByEmail === 'object') {
        errors['email'] = 'Email is already taken'
      }
      if (foundUserByName === 'object') {
        errors['username'] = 'Username is already taken'
      }

      if (Object.keys(errors).length > 0) {
        throw new ErrorHandler(403, errors)
      }
      console.log(staff)
      return await createStaffDb(staff)
    } catch (error) {
      throw new ErrorHandler(error.statusCode, error.message)
    }
  }
  getStaffByEmail = async (email) => {
    try {
      const staff = await getStaffByEmailDb(email)
      return staff
    } catch (error) {
      throw new ErrorHandler(error.statusCode, error.message)
    }
  }
  getStaffByUsername = async (staffName) => {
    try {
      const staff = await getStaffByUsernameDb(staffName)
      delete staff.password
      return staff
    } catch (error) {
      throw new ErrorHandler(error.statusCode, error.message)
    }
  }
  getStaffById = async (staff_id) => {
    try {
      const staff = await getStaffByIdDb(staff_id)
      delete staff.password
      return staff
    } catch (error) {
      throw new ErrorHandler(error.statusCode, error.message)
    }
  }

  changeStaffPassword = async (password, staff_id) => {
    try {
      return await changeStaffPasswordDb(password, staff_id)
    } catch (error) {
      throw new ErrorHandler(error.statusCode, error.message)
    }
  }

  updateStaff = async (staff) => {
    const { email, username, staff_id } = staff
    const errors = {}
    try {
      const getUser = await getStaffByIdDb(staff_id)
      const findUserByEmail = await getStaffByEmailDb(email)
      const findUserByUsername = await getStaffByUsernameDb(username)
      const emailChanged =
        email && getUser.email.toLowerCase() !== email.toLowerCase()
      const usernameChanged =
        username && getUser.username.toLowerCase() !== username.toLowerCase()

      if (emailChanged && typeof findUserByEmail === 'object') {
        errors['email'] = 'Email is already taken'
      }
      if (usernameChanged && typeof findUserByUsername === 'object') {
        errors['username'] = 'Username is already taken'
      }

      if (Object.keys(errors).length > 0) {
        throw new ErrorHandler(403, errors)
      }

      return await updateStaffDb(staff)
    } catch (error) {
      throw new ErrorHandler(error.statusCode, error.message)
    }
  }

  deleteStaff = async (staff_id) => {
    try {
      return await deleteStaffDb(staff_id)
    } catch (error) {
      throw new ErrorHandler(error.statusCode, error.message)
    }
  }

  getAllStaffs = async () => {
    try {
      return await getAllStaffsDb()
    } catch (error) {
      throw new ErrorHandler(error.statusCode, error.message)
    }
  }
}

module.exports = new StaffService()
