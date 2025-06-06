const petService = require('../services/pets.service')
const userService = require('../services/users.service')
const { ErrorHandler } = require('../helpers/error')

const createPetByStaff = async (req, res) => {
  const {
    fullname,
    species,
    age,
    weight,
    sex,
    health,
    describe,
    avatar,
    user_id,
  } = req.body
  const user = await userService.getUserById(user_id)
  if (!user) {
    throw new ErrorHandler(404, 'User not found')
  }
  const pet = await petService.createPet({
    fullname,
    species,
    age,
    weight,
    sex,
    health,
    describe,
    avatar,
    user_id,
  })

  res.status(201).json({
    status: 'success',
    pet,
  })
}

const createPet = async (req, res) => {
  const { fullname, species, age, weight, sex, health, describe, avatar } =
    req.body
  const { user_id } = req.params
  const user = await userService.getUserById(user_id)
  // console.log("User:", user);
  // console.log("User_id in db:", req.user.user_id);
  // console.log("User id in req:", user_id);
  if (!user) {
    throw new ErrorHandler(404, 'User not found')
  }
  if (+user_id === req.user.user_id || req.user.roles.includes('admin')) {
    const pet = await petService.createPet({
      fullname,
      species,
      age,
      weight,
      sex,
      health,
      describe,
      avatar,
      user_id, // Assign the user_id to the pet
    })

    res.status(201).json({
      status: 'success',
      pet,
    })
  } else {
    throw new ErrorHandler(401, 'Unauthorized')
  }
}

const getPetList = async (req, res) => {
  const { user_id } = req.user

  const pets = await petService.getUserPetsByUser_Id(user_id)

  return res.status(200).json(pets)
}

const allPet = async (req, res) => {
  const pets = await petService.getAllPet()

  return res.status(200).json(pets)
}

const getPetById = async (req, res) => {
  const { user_id } = req.user
  const { pet_id } = req.params
  const user = await userService.getUserById(user_id)
  if (!user) {
    throw new ErrorHandler(404, 'User not found')
  }
  if (+user_id === req.user.user_id || req.user.roles.includes('admin')) {
    const pet = await petService.getPetById(pet_id)
    if (!pet) {
      throw new ErrorHandler(404, 'Pet not found')
    }
    return res.status(200).json(pet)
  } else {
    throw new ErrorHandler(401, 'Unauthorized')
  }
}

const updatePet = async (req, res) => {
  const { pet_id } = req.params
  const { fullname, species, age, weight, sex, health, describe, avatar } =
    req.body
  const { user_id } = req.user
  const user = await userService.getUserById(user_id)
  if (!user) {
    throw new ErrorHandler(404, 'User not found')
  }
  if (+user_id === req.user.user_id || req.user.roles.includes('admin')) {
    const results = await petService.updatePet({
      pet_id,
      fullname,
      species,
      age,
      weight,
      sex,
      health,
      describe,
      avatar,
    })

    return res.status(201).json(results)
  } else {
    throw new ErrorHandler(401, 'Unauthorized')
  }
}

const deletePet = async (req, res) => {
  const { user_id } = req.user
  const { pet_id } = req.params
  const user = await userService.getUserById(user_id)
  if (!user) {
    throw new ErrorHandler(404, 'User not found')
  }
  if (+user_id === req.user.user_id || req.user.roles.includes('admin')) {
    const pet = await petService.getPetById(pet_id)
    const result = await petService.deletePet(pet_id)
    if (!pet) {
      throw new ErrorHandler(404, 'Pet not found')
    }
    res.status(200).json(result)
  } else {
    throw new ErrorHandler(401, 'Unauthorized')
  }
}

const servicePet = async (req, res) => {
  const { user_id } = req.user
  const user = await userService.getUserById(user_id)
  if (!user) {
    throw new ErrorHandler(404, 'User not found')
  }
  if (req.user.roles.includes('admin') || req.user.roles.includes('staff')) {
    const { id } = req.body
    const pets = await petService.getServicePet({ id })
    res.status(200).json(pets)
  } else {
    if (+user_id === req.user.user_id) {
      const pets = await petService.getServicePetbyUser_ID({
        id: user_id,
      })
      res.status(200).json(pets)
    } else {
      throw new ErrorHandler(401, 'Unauthorized')
    }
  }
}

module.exports = {
  createPetByStaff,
  createPet,
  getPetList,
  allPet,
  getPetById,
  updatePet,
  deletePet,
  servicePet,
}
