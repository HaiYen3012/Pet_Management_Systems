const {
  createPetDb,
  getPetListByUser_idDb,
  getPetByIdDb,
  getAllPetdb,
  updatePetDb,
  deletePetDb,
  getServicePet,
  getServicePetbyUser_ID,
} = require('../db/pets.db')
const { ErrorHandler } = require('../helpers/error')
class PetService {
  createPet = async (pet) => {
    try {
      return await createPetDb(pet)
    } catch (error) {
      throw new ErrorHandler(error.statusCode, error.message)
    }
  }
  getUserPetsByUser_Id = async (user_id) => {
    try {
      const pets = await getPetListByUser_idDb(user_id)
      return pets
    } catch (error) {
      throw new ErrorHandler(error.statusCode, error.message)
    }
  }

  getAllPet = async () => {
    try {
      const pets = await getAllPetdb()
      return pets
    } catch (error) {
      throw new ErrorHandler(error.statusCode, error.message)
    }
  }

  getPetById = async (pet_id) => {
    try {
      const pet = await getPetByIdDb(pet_id)
      return pet
    } catch (error) {
      throw new ErrorHandler(error.statusCode, error.message)
    }
  }
  updatePet = async (pet) => {
    const { fullname, species, age, weight, sex, health, describe, avatar } =
      pet
    const errors = {}
    try {
      if (Object.keys(errors).length > 0) {
        throw new ErrorHandler(403, errors)
      }
      return await updatePetDb(pet)
    } catch (error) {
      throw new ErrorHandler(error.statusCode, error.message)
    }
  }
  deletePet = async (pet_id) => {
    try {
      return await deletePetDb(pet_id)
    } catch (error) {
      throw new ErrorHandler(error.statusCode, error.message)
    }
  }

  getServicePet = async (id) => {
    try {
      return await getServicePet(id)
    } catch (error) {
      console.log(error)
      throw new ErrorHandler(error.statusCode, 'getDetailPet False')
    }
  }

  getServicePetbyUser_ID = async (id) => {
    try {
      return await getServicePetbyUser_ID(id)
    } catch (error) {
      console.log(error)
      throw new ErrorHandler(error.statusCode, 'getPetDetailbyUser_ID False')
    }
  }
}

module.exports = new PetService()
