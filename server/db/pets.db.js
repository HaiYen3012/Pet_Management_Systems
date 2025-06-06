const pool = require('../config')
const { ErrorHandler } = require('../helpers/error')

const createPetDb = async ({
  fullname,
  species,
  age,
  weight,
  sex,
  health,
  describe,
  avatar,
  user_id,
}) => {
  const { rows: pet } = await pool.query(
    `INSERT INTO pets(fullname, species, age, weight, sex, health, describe, avatar, user_id) 
          VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) 
          returning pet_id, fullname, species, age, weight, sex, health, describe, avatar, user_id`,
    [fullname, species, age, weight, sex, health, describe, avatar, user_id],
  )
  return pet[0]
}

const getPetListByUser_idDb = async (user_id) => {
  const { rows: pets } = await pool.query(
    'SELECT * FROM pets WHERE user_id = $1',
    [user_id],
  )
  return pets
}

const getAllPetdb = async () => {
  const { rows: pets } = await pool.query('SELECT * FROM pets')
  return pets
}

const getPetByIdDb = async (pet_id) => {
  const { rows: pet } = await pool.query(
    'SELECT pets.* FROM pets WHERE pets.pet_id = $1',
    [pet_id],
  )
  return pet[0]
}

const deletePetDb = async (pet_id) => {
  const { rows: pet } = await pool.query(
    'DELETE FROM pets WHERE pet_id = $1 returning *',
    [pet_id],
  )
  return pet[0]
}

const updatePetDb = async ({
  pet_id,
  fullname,
  species,
  age,
  weight,
  sex,
  health,
  describe,
  avatar,
}) => {
  const { rows: pet } = await pool.query(
    `UPDATE pets set fullname = $1, species = $2, age = $3, weight = $4, sex = $5, health = $6, describe = $7, avatar = $8
        WHERE pet_id = $9 returning fullname, species, age, weight, sex, health, describe, avatar, user_id`,
    [fullname, species, age, weight, sex, health, describe, avatar, pet_id],
  )
  return pet[0]
}

const getServicePet = async ({ id }) => {
  const petQuery = `      
      SELECT 
        p.pet_id, p.fullname, p.species, p.age, p.weight, p.sex, p.health, p.describe, 
        u.user_id, u.username, u.email, u.fullname AS owner_name
      FROM 
        pets p
      JOIN 
        users u ON p.user_id = u.user_id
      WHERE 
        p.pet_id = $1`
  const petResult = await pool.query(petQuery, [id])
  if (petResult.rows.length === 0) {
    return { message: 'Pet not found' }
  }
  const petDetails = petResult.rows[0]
  const serviceQuery = `
      SELECT 
        so.id AS order_id, 
        'storage' AS service_type, 
        s."status", 
        s.date_start AS service_date, 
        so.total
      FROM 
        storage_orders so
      JOIN 
        storage s ON so.service_id = s.id
      WHERE 
        so.pet_id = $1

      UNION

      SELECT 
        bo.id AS order_id, 
        'beauty' AS service_type, 
        b.status, 
        b.date AS service_date, 
        bo.total
      FROM 
        beauty_orders bo
      JOIN 
        beauty b ON bo.service_id = b.id
      WHERE 
        bo.pet_id = $1

      UNION

      SELECT 
        ao.id AS order_id, 
        'appointment' AS service_type, 
        a.status, 
        a.date AS service_date, 
        ao.total
      FROM 
        appointment_orders ao
      JOIN 
        appointments a ON ao.service_id = a.id
      WHERE 
        ao.pet_id = $1;
    `
  const serviceResult = await pool.query(serviceQuery, [id])
  const services = serviceResult.rows
  return {
    petDetails,
    services,
  }
}
const getServicePetbyUser_ID = async ({ id }) => {
  const petQuery = `
      SELECT 
        p.pet_id, p.fullname AS pet_name, p.species, p.age, p.weight, p.sex, p.health, p.describe
      FROM 
        pets p
      WHERE 
        p.user_id = $1
    `
  const petResult = await pool.query(petQuery, [id])

  if (petResult.rows.length === 0) {
    throw new Error('Pet not found or does not belong to the user')
  }

  const pets = petResult.rows
  const servicesQuery = `
      SELECT 
        s.id as id,
        so.pet_id, 
        so.id AS order_id, 
        'storage' AS service_type, 
        s."status", 
        s.date_start AS service_date, 
        so.total
      FROM 
        storage_orders so
      JOIN 
        storage s ON so.service_id = s.id
      WHERE 
        so.pet_id = ANY($1::int[])

      UNION

      SELECT 
        b.id as id,
        bo.pet_id, 
        bo.id AS order_id, 
        'beauty' AS service_type, 
        b.status, 
        b.date AS service_date, 
        bo.total
      FROM 
        beauty_orders bo
      JOIN 
        beauty b ON bo.service_id = b.id
      WHERE 
        bo.pet_id = ANY($1::int[])

      UNION

      SELECT 
        a.id as id, 
        ao.pet_id, 
        ao.id AS order_id, 
        'appointment' AS service_type, 
        a.status, 
        a.date AS service_date, 
        ao.total
      FROM 
        appointment_orders ao
      JOIN 
        appointments a ON ao.service_id = a.id
      WHERE 
        ao.pet_id = ANY($1::int[])
    `
  const petIds = pets.map((pet) => pet.pet_id)

  const serviceResult = await pool.query(servicesQuery, [petIds])
  const services = serviceResult.rows
  const petsWithServices = pets.map((pet) => ({
    ...pet,
    services: services.filter((service) => service.pet_id === pet.pet_id),
  }))
  return petsWithServices
}

module.exports = {
  createPetDb,
  getPetListByUser_idDb,
  getPetByIdDb,
  getAllPetdb,
  updatePetDb,
  deletePetDb,
  getServicePet,
  getServicePetbyUser_ID,
}
