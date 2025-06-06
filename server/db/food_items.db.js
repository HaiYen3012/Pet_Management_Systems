const pool = require('../config')

const createFoodItemDb = async ({
  name,
  amount,
  unit,
  description,
  time,
  plan_id,
}) => {
  const { rows: food_item } = await pool.query(
    `INSERT INTO "food_item" (name, amount, unit, description, time, plan_id) 
          VALUES($1, $2, $3, $4, $5, $6) 
          returning food_id, plan_id, name, amount, unit, description, time`,
    [name, amount, unit, description, time, plan_id],
  )
  return food_item[0]
}

const getFoodItemListByPet_idDb = async (pet_id) => {
  const { rows: food_itemlist } = await pool.query(
    `SELECT "food_item".*
    FROM "food_item"
    WHERE "food_item".plan_id IN (
        SELECT "diet_plans".plan_id
        FROM "diet_plans"
        JOIN "pets" ON "diet_plans".plan_id = "pets".plan_id
        WHERE "pets".pet_id = $1
    );
    `,
    [pet_id],
  )
  return food_itemlist
}

const getFoodItemByIdDb = async (food_id) => {
  const { rows: food_item } = await pool.query(
    `SELECT "food_item".* FROM "food_item" WHERE "food_item".food_id = $1`,
    [food_id],
  )
  return food_item[0]
}

const updateFoodItemDb = async ({
  food_id,
  name,
  amount,
  unit,
  description,
  time,
}) => {
  const { rows: food_item } = await pool.query(
    `UPDATE "food_item"
    SET name = $1, amount = $2, unit = $3, description = $4, time = $5
    WHERE food_id = $6
    RETURNING food_id, plan_id, name, amount, unit, description, time`,
    [name, amount, unit, description, time, food_id],
  )
  return food_item[0]
}

const deleteFoodItemDb = async (food_id) => {
  const { rows: food_item } = await pool.query(
    `DELETE FROM "food_item" WHERE food_id = $1 returning *`,
    [food_id],
  )
  return food_item[0]
}

module.exports = {
  createFoodItemDb,
  getFoodItemListByPet_idDb,
  getFoodItemByIdDb,
  updateFoodItemDb,
  deleteFoodItemDb,
}
