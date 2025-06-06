const { ErrorHandler } = require('../helpers/error')
const {
  createBeautydb,
  createBeautyOrderdb,
  getAllBeautyDB,
  getBeautysByDateAndTimeSlotdb,
  getBeautybyIDdb,
  getAllBeautybyUser_IDdb,
  deleteBeautydb,
  updateBeautydb,
  updateBeautyStatusdb,
  getBeautybyPetIDdb,
} = require('../db/serviceBeauty.db')

class ServiceService {
  createBeauty = async (beauty) => {
    try {
      return await createBeautydb(beauty)
    } catch (error) {
      console.log(error)
      throw new ErrorHandler(error.statusCode, error.message)
    }
  }

  createBeautyOrder = async (beauty_order) => {
    try {
      return await createBeautyOrderdb(beauty_order)
    } catch (error) {
      console.log(error)
      throw new ErrorHandler(error.statusCode, error.message)
    }
  }

  getAllBeauty = async () => {
    try {
      return await getAllBeautyDB()
    } catch (error) {
      console.log(error)
      throw new ErrorHandler(error.statusCode, 'getAllBeauty False')
    }
  }

  getBeautysByDateAndTimeSlot = async (date, time_slot) => {
    try {
      return await getBeautysByDateAndTimeSlotdb(date, time_slot)
    } catch (error) {
      console.log(error)
      throw new ErrorHandler(error.statusCode, error.message)
    }
  }

  getBeautybyPetID = async (pet_id) => {
    try {
      return await getBeautybyPetIDdb(pet_id)
    } catch (error) {
      console.log(error)
      throw new ErrorHandler(error.statusCode, error.message)
    }
  }

  getAllBeautybyUser_ID = async (user_id, isAdmin) => {
    try {
      return await getAllBeautybyUser_IDdb(user_id, isAdmin)
    } catch (error) {
      console.log(error)
      throw new ErrorHandler(error.statusCode, 'getAllBeautybyUser_ID False')
    }
  }

  getBeautybyID = async (id) => {
    try {
      return await getBeautybyIDdb(id)
    } catch (error) {
      console.log(error)
      throw new ErrorHandler(error.statusCode, 'getBeautybyID False')
    }
  }

  deleteBeauty = async (id) => {
    try {
      return await deleteBeautydb(id)
    } catch (error) {
      console.log(error)
      throw new ErrorHandler(error.statusCode, 'deleteBeauty False')
    }
  }

  updateBeauty = async (update_appointment) => {
    try {
      return await updateBeautydb(update_appointment)
    } catch (error) {
      console.log(error)
      throw new ErrorHandler(error.statusCode, 'updateBeauty False')
    }
  }

  updateBeautyStatus = async (response) => {
    try {
      console.log(response)
      return await updateBeautyStatusdb(response)
    } catch (error) {
      console.log(error)
      throw new ErrorHandler(error.statusCode, 'updateBeautyStatus False')
    }
  }
}

module.exports = new ServiceService()
