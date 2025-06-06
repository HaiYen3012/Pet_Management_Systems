const {
  createUserDb,
  getUserByEmailDb,
  createUserGoogleDb,
  changeUserPasswordDb,
  getUserByIdDb,
  updateUserDb,
  deleteUserDb,
  getAllUsersDb,
  getUserByUsernameDb,
  getAllCustomersDb,
} = require('../db/users.db')

const { ErrorHandler } = require('../helpers/error')
class UserService {
  createUser = async (user) => {
    try {
      return await createUserDb(user)
    } catch (error) {
      throw new ErrorHandler(error.statusCode, error.message)
    }
  }
  getUserByEmail = async (email) => {
    try {
      const user = await getUserByEmailDb(email)
      return user
    } catch (error) {
      throw new ErrorHandler(error.statusCode, error.message)
    }
  }
  getUserByUsername = async (username) => {
    try {
      const user = await getUserByUsernameDb(username)
      return user
    } catch (error) {
      throw new ErrorHandler(error.statusCode, error.message)
    }
  }
  getUserById = async (user_id) => {
    try {
      const user = await getUserByIdDb(user_id)
      user.password = undefined
      user.google_id = undefined
      // user.cart_id = undefined;
      return user
    } catch (error) {
      throw new ErrorHandler(error.statusCode, error.message)
    }
  }
  createGoogleAccount = async (user) => {
    try {
      return await createUserGoogleDb(user)
    } catch (error) {
      throw new ErrorHandler(error.statusCode, error.message)
    }
  }
  changeUserPassword = async (password, email) => {
    try {
      return await changeUserPasswordDb(password, email)
    } catch (error) {
      throw new ErrorHandler(error.statusCode, error.message)
    }
  }
  updateUser = async (user) => {
    const { email, username, user_id } = user
    const errors = {}
    try {
      const getUser = await getUserByIdDb(user_id)
      const findUserByEmail = await getUserByEmailDb(email)
      const findUserByUsername = await getUserByUsernameDb(username)
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

      return await updateUserDb(user)
    } catch (error) {
      throw new ErrorHandler(error.statusCode, error.message)
    }
  }

  deleteUser = async (user_id) => {
    try {
      return await deleteUserDb(user_id)
    } catch (error) {
      throw new ErrorHandler(error.statusCode, error.message)
    }
  }

  getAllUsers = async () => {
    try {
      return await getAllUsersDb()
    } catch (error) {
      throw new ErrorHandler(error.statusCode, error.message)
    }
  }

  getAllCustomers = async () => {
    try {
      return await getAllCustomersDb()
    } catch (error) {
      // throw new ErrorHandler(error.statusCode, error.message);
      console.log(error)
    }
  }
}

module.exports = new UserService()
