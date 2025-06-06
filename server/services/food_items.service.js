const {
    createFoodItemDb,
    getFoodItemListByPet_idDb,
    getFoodItemByIdDb,
    updateFoodItemDb,
    deleteFoodItemDb
  } = require("../db/food_items.db");
  const { ErrorHandler } = require("../helpers/error");
class Food_itemService {
    createFoodItem = async (fooditem) => {
      try {
        return await createFoodItemDb(fooditem);
      } catch (error) {
        throw new ErrorHandler(error.statusCode, error.message);
      }
    };
    getFoodItemListByPet_id = async (pet_id) => {
        try {
            const fooditemlist = await getFoodItemListByPet_idDb(pet_id);
            return fooditemlist;
        } catch (error) {
            throw new ErrorHandler(error.statusCode, error.message);
        }
    };
    getFoodItemById = async (food_id) => {
        try {
            const fooditem = await getFoodItemByIdDb(food_id);
            return fooditem;
        } catch (error) {
            throw new ErrorHandler(error.statusCode, error.message);
        }
    };
    updateFoodItem = async (foodItem) => {
        // const { name, description, date_start, date_end, pet_id } = plan;
        const errors = {};
        try {
            if (Object.keys(errors).length > 0) {
            throw new ErrorHandler(403, errors);
            }
            return await updateFoodItemDb(foodItem);
        } catch (error) {
            throw new ErrorHandler(error.statusCode, error.message);
        }
    };
    deleteFoodItem = async (food_id) => {
        try {
            return await deleteFoodItemDb(food_id);
        } catch (error) {
            throw new ErrorHandler(error.statusCode, error.message);
        }
    };

}


module.exports = new Food_itemService();