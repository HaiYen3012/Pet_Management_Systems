const {
  createPetByStaff,
  createPet,
  getPetList,
  allPet,
  getPetById,
  deletePet,
  updatePet,
} = require('../controllers/pets.controller')

const {
  createPlan,
  getPlanList,
  getPlanByPet_id,
  updatePlan,
  deletePlan,
} = require('../controllers/plans.controller')

const {
  createFoodItem,
  getFoodItemList,
  getFoodItemById,
  updateFoodItem,
  deleteFoodItem,
} = require('../controllers/food_items.controller')

const router = require('express').Router()
const verifyStaff = require('../middleware/verifyStaff')
const verifyToken = require('../middleware/verifyToken')

router.use(verifyToken)
router.route('/add-pet').post(verifyStaff, createPetByStaff)
router.route('/:user_id/add-pet').post(createPet)
router.route('/pet-list').get(getPetList)
router.route('/all-pet').get(verifyStaff, allPet)
router.route('/:pet_id').get(getPetById).put(updatePet).delete(deletePet)

router.route('/:pet_id/add-plan').post(createPlan)
router.route('/user/plans').get(getPlanList)
router
  .route('/:pet_id/plan')
  .get(getPlanByPet_id)
  .put(updatePlan)
  .delete(deletePlan)

router.route('/:pet_id/plan/add-food-item').post(createFoodItem)
router.route('/:pet_id/plan/food-item').get(getFoodItemList)
router
  .route('/:pet_id/plan/food-item/:food_id')
  .put(updateFoodItem)
  .delete(deleteFoodItem)

module.exports = router
