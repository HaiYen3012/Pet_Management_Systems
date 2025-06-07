const userService = require('../services/users.service')
const petService = require('../services/pets.service')
const planService = require('../services/plans.service')
const food_itemService = require('../services/food_items.service')
const { ErrorHandler } = require('../helpers/error')

const createFoodItem = async (req, res) => {
  const { name, amount, unit, description, time } = req.body

  const { pet_id } = req.params
  const pet = await petService.getPetById(pet_id)
  if (!pet) {
    throw new ErrorHandler(404, 'Pet not found')
  }
  // console.log("pet id:", pet_id)
  const plan = await planService.getPlanByPet_id(pet_id)
  if (!plan) {
    throw new ErrorHandler(404, 'Plan not found')
  }
  let plan_id = plan[0].plan_id
  if (+pet_id === pet.pet_id || req.user.roles.includes('admin')) {
    const fooditem = await food_itemService.createFoodItem({
      name,
      amount,
      unit,
      description,
      time,
      plan_id,
    })

    res.status(201).json({
      status: 'success',
      fooditem,
    })
  } else {
    throw new ErrorHandler(401, 'Unauthorized')
  }
}

const getFoodItemList = async (req, res) => {
  const { pet_id } = req.params
  const pet = await petService.getPetById(pet_id)
  if (!pet) {
    throw new ErrorHandler(404, 'Pet not found')
  }
  if (+pet_id === pet.pet_id || req.user.roles.includes('admin')) {
    const fooditemlist = await food_itemService.getFoodItemListByPet_id(pet_id)
    return res.status(200).json(fooditemlist)
  } else {
    throw new ErrorHandler(401, 'Unauthorized')
  }
}

const getFoodItemById = async (req, res) => {
  const { user_id } = req.user
  const { pet_id } = req.params
  const user = await userService.getUserById(user_id)
  const pet = await petService.getPetById(pet_id)
  if (!user) {
    throw new ErrorHandler(404, 'User not found')
  }
  if (!pet) {
    throw new ErrorHandler(404, 'Pet not found')
  }
  if (+user_id === req.user.user_id || req.user.roles.includes('admin')) {
    try {
      const food_id = req.body.food_id // Lấy foodItemId từ req.body
      const foodItem = await food_itemService.getFoodItemById(food_id)
      return res.status(200).json(foodItem)
    } catch (error) {
      throw new ErrorHandler(404, 'FoodItem not found')
    }
  } else {
    throw new ErrorHandler(401, 'Unauthorized')
  }
}

const updateFoodItem = async (req, res) => {
  const { pet_id } = req.params
  const { food_id } = req.params
  // console.log(req);
  const pet = await petService.getPetById(pet_id)
  const { name, amount, unit, description, time } = req.body
  if (!pet) {
    throw new ErrorHandler(404, 'Pet not found')
  }
  if (+pet_id === pet.pet_id || req.user.roles.includes('admin')) {
    const results = await food_itemService.updateFoodItem({
      food_id,
      name,
      amount,
      unit,
      description,
      time,
    })
    if (!results) {
      throw new ErrorHandler(404, 'Food Item not found')
    }

    return res.status(201).json(results)
  } else {
    throw new ErrorHandler(401, 'Unauthorized')
  }
}

const deleteFoodItem = async (req, res) => {
  const { pet_id } = req.params
  const { food_id } = req.params
  const pet = await petService.getPetById(pet_id)
  if (!pet) {
    throw new ErrorHandler(404, 'Pet not found')
  }
  if (+pet_id === pet.pet_id || req.user.roles.includes('admin')) {
    const result = await food_itemService.deleteFoodItem(food_id)
    if (!result) {
      throw new ErrorHandler(404, 'Food item not found')
    }
    res.status(200).json(result)
  } else {
    throw new ErrorHandler(401, 'Unauthorized')
  }
}

module.exports = {
  createFoodItem,
  getFoodItemList,
  getFoodItemById,
  updateFoodItem,
  deleteFoodItem,
}
