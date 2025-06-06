const pool = require('../config')

const createPlanDb = async ({
  name,
  description,
  date_start,
  date_end,
  pet_id,
}) => {
  const { rows: planOfaPet } = await pool.query(
    `INSERT INTO "diet_plans" (name, description, date_start, date_end) 
          VALUES($1, $2, $3, $4) 
          returning plan_id, name, description, date_start, date_end, created_at`,
    [name, description, date_start, date_end],
  )
  console.log(planOfaPet[0])
  const plan_id = planOfaPet[0].plan_id
  await pool.query(
    `UPDATE "pets"
      SET plan_id = $1
      WHERE pet_id = $2`,
    [plan_id, pet_id],
  )
  return planOfaPet[0]
}
const getPlansByUser_idDb = async (user_id) => {
  const { rows: plans } = await pool.query(
    `SELECT "diet_plans".*
       FROM "diet_plans"
       JOIN pets ON "diet_plans".plan_id = pets.plan_id
       WHERE pets.user_id = $1`,
    [user_id],
  )
  return plans
}

const getPlanByPet_idDb = async (pet_id) => {
  const { rows: plan } = await pool.query(
    `SELECT "diet_plans".* FROM "diet_plans" JOIN pets ON "diet_plans".plan_id = pets.plan_id WHERE pets.pet_id = $1`,
    [pet_id],
  )
  return plan
}

const deletePlanDb = async (pet_id) => {
  const { rows: pet } = await pool.query(
    `SELECT plan_id FROM pets WHERE pet_id = $1`,
    [pet_id],
  )
  const plan_id = pet[0].plan_id

  await pool.query(
    `UPDATE pets
     SET plan_id = NULL 
     WHERE pet_id = $1`,
    [pet_id],
  )

  const { rows: deletedPlan } = await pool.query(
    `DELETE FROM "diet_plans"
     WHERE plan_id = $1
     RETURNING *`,
    [plan_id],
  )

  return deletedPlan[0]
}

const updatePlanDb = async ({
  name,
  description,
  date_start,
  date_end,
  pet_id,
}) => {
  const { rows: plan } = await pool.query(
    `UPDATE "diet_plans" AS dp
    SET name = $1, description = $2, date_start = $3, date_end = $4
    FROM pets AS p
    WHERE dp.plan_id = p.plan_id AND p.pet_id = $5
    RETURNING p.pet_id, dp.plan_id, dp.name, dp.description, dp.date_start, dp.date_end`,
    [name, description, date_start, date_end, pet_id],
  )
  return plan[0]
}

module.exports = {
  createPlanDb,
  getPlansByUser_idDb,
  getPlanByPet_idDb,
  updatePlanDb,
  deletePlanDb,
}
