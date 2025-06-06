const userService = require('../services/users.service')
const { ErrorHandler } = require('../helpers/error')
const { hashPassword } = require('../helpers/hashPassword')

const getAllUsers = async (req, res) => {
  const results = await userService.getAllUsers()
  res.status(200).json(results)
}

const getAllCustomers = async (req, res) => {
  try {
    const listCustomer = await userService.getAllCustomers()
    return res.status(200).json(listCustomer)
  } catch (error) {
    // throw new ErrorHandler(error.statusCode, 'Error get all customer')
    console.log(error);
  }
}

const createUser = async (req, res) => {
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
    roles,
  } = req.body
  const hashedPassword = hashPassword(password)

  const user = await userService.createUser({
    username,
    hashedPassword,
    email,
    fullname,
    phone_numbers,
    address,
    city,
    country,
    avatar,
    roles,
  })

  res.status(201).json({
    status: 'success',
    user,
  })
}

const getUserById = async (req, res) => {
  const { user_id } = req.params
  if (+user_id === req.user.user_id || req.user.roles.includes('admin')) {
    try {
      const user = await userService.getUserById(user_id)
      return res.status(200).json(user)
    } catch (error) {
      throw new ErrorHandler(error.statusCode, 'User not found')
    }
  } else {
    throw new ErrorHandler(401, 'Unauthorized')
  }
}

const getUserProfile = async (req, res) => {
  const { user_id } = req.user

  const user = await userService.getUserById(user_id)

  return res.status(200).json(user)
}

const updateUser = async (req, res) => {
  const { username, email, fullname, address, phone_numbers, city, country } =
    req.body
  if (
    +req.params.user_id === req.user.user_id ||
    req.user.roles.includes('admin')
  ) {
    try {
      const results = await userService.updateUser({
        username,
        email,
        fullname,
        phone_numbers,
        address,
        city,
        country,
        user_id: req.params.user_id,
      })
      return res.status(201).json(results)
    } catch (error) {
      throw new ErrorHandler(error.statusCode, error.message)
    }
  }
  throw new ErrorHandler(401, 'Unauthorized')
}

const deleteUser = async (req, res) => {
  const { user_id } = req.params
  if (
    req.user &&
    (req.user.user_id === +user_id || req.user.roles.includes('admin'))
  ) {
    try {
      const result = await userService.deleteUser(user_id)
      res.status(200).json(result)
    } catch (error) {
      throw new ErrorHandler(error.statusCode, error.message)
    }
  }
  // throw new ErrorHandler(401, "Unauthorized");
}

module.exports = {
  getAllUsers,
  createUser,
  getUserById,
  updateUser,
  deleteUser,
  getUserProfile,
  getAllCustomers
}
