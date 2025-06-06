const pool = require('../config')
const { ErrorHandler } = require('../helpers/error')

const createBeautydb = async ({ status, date, time_slot, note }) => {
  console.log(date)
  const { rows: beauty } = await pool.query(
    `INSERT INTO beauty(status, date, note, time_slot) 
        VALUES($1, $2, $3, $4) 
        returning id, status, date, note, time_slot`,
    [status, date, note, time_slot],
  )
  return beauty[0]
}

const createBeautyOrderdb = async ({ service_id, user_id, pet_id, total }) => {
  const { rows: beauty_order } = await pool.query(
    `INSERT INTO "beauty_orders"("service_id", "user_id","pet_id","total") 
        VALUES($1, $2, $3, $4) 
        returning "id", "service_id", "user_id", "pet_id", "total", "create_at"`,
    [service_id, user_id, pet_id, total],
  )
  return beauty_order[0]
}

const getAllBeautyDB = async () => {
  const query = `
      SELECT 
        s.*, 
        t.time AS time,
        t.price AS price,
        t.unit AS unit,
        bo.id AS order_id,
        bo.service_id AS order_service_id,
        bo.user_id AS order_user_id,
        bo.pet_id AS order_pet_id,
        bo.create_at AS order_created_at,
        bo.total AS order_total
      FROM 
        beauty s
      LEFT JOIN 
        time_slot_beauty t ON s.time_slot = t.id
      LEFT JOIN 
        beauty_orders bo ON bo.service_id = s.id
    `
  const { rows: allbeauty } = await pool.query(query)
  return allbeauty
}

const getBeautysByDateAndTimeSlotdb = async (date, time_slot) => {
  const { rows: beautys } = await pool.query(
    `SELECT * FROM beauty 
       WHERE date::date = $1::date AND time_slot = $2`,
    [date, time_slot],
  )
  return beautys
}

const getAllBeautybyUser_IDdb = async (user_id, isAdmin) => {
  let queryString = `
    SELECT beauty.*, beauty_orders.*, time_slot_beauty.time
    FROM beauty
    INNER JOIN beauty_orders ON beauty.id = beauty_orders.service_id
    INNER JOIN time_slot_beauty ON beauty.time_slot = time_slot_beauty.id
  `
  const queryParams = []

  if (!isAdmin) {
    queryString += ' WHERE beauty_orders.user_id = $1'
    queryParams.push(user_id)
  }

  try {
    const { rows: allAppointments } = await pool.query(queryString, queryParams)
    console.log(allAppointments)
    return allAppointments
  } catch (error) {
    console.error('Error fetching beautys:', error)
    throw error
  }
}

const getBeautybyIDdb = async ({ id }) => {
  const { rows: beautyById } = await pool.query(
    `SELECT beauty.*, beauty_orders.*, time_slot_beauty.time
    FROM beauty
    INNER JOIN beauty_orders ON beauty.id = beauty_orders.service_id
    INNER JOIN time_slot_beauty ON beauty.time_slot = time_slot_beauty.id
    WHERE beauty.id = $1`,
    [id],
  )
  if (beautyById.length === 0) {
    return { message: 'No appointment found with the specified ID' }
  }
  return beautyById[0]
}

const getBeautybyPetIDdb = async (pet_id) => {
  const { rows: beauty } = await pool.query(
    `SELECT beauty.*, beauty_orders.*
    FROM beauty
    WHERE beauty.pet_id = $1`,
    [pet_id],
  )
  if (beauty.length == 0) {
    return { message: 'No beauty found with that pet' }
  }
}

const deleteBeautydb = async (id) => {
  try {
    await pool.query('BEGIN')

    await pool.query('DELETE FROM beauty_orders WHERE service_id = $1', [id])

    const { rowCount } = await pool.query('DELETE FROM beauty WHERE id = $1', [
      id,
    ])

    if (rowCount === 0) {
      await pool.query('ROLLBACK')
      return { message: 'No beauty found with the specified ID' }
    }

    await pool.query('COMMIT')
    console.log('Xóa thành công')
    return { message: 'beauty successfully deleted' }
  } catch (error) {
    await pool.query('ROLLBACK')
    console.error('Error in deleteBeautydb:', error)
    throw error
  }
}

const updateBeautydb = async ({ id, date, note, time_slot, pet_id }) => {
  try {
    await pool.query('BEGIN')

    const { rows: existingBeauty } = await pool.query(
      'SELECT * FROM beauty WHERE id = $1',
      [id],
    )

    if (existingBeauty.length === 0) {
      await pool.query('ROLLBACK')
      return { message: 'Beauty not found' }
    }

    const { rows: existingBeautyOrder } = await pool.query(
      'SELECT * FROM beauty_orders WHERE service_id = $1',
      [id],
    )

    if (existingBeautyOrder.length === 0) {
      await pool.query('ROLLBACK')
      return { message: 'Beauty order not found' }
    }

    const updateBeautyQuery = `
      UPDATE beauty
      SET date = $1, note = $2, time_slot = $3
      WHERE id = $4
    `
    await pool.query(updateBeautyQuery, [date, note, time_slot, id])

    const updateAppointmentOrdersQuery = `
      UPDATE beauty_orders
      SET pet_id = $1
      WHERE service_id = $2
    `
    await pool.query(updateAppointmentOrdersQuery, [pet_id, id])

    await pool.query('COMMIT')

    return { message: 'Beauty successfully updated' }
  } catch (error) {
    await pool.query('ROLLBACK')
    console.error('Error in updateBeautydb:', error)
    throw new ErrorHandler(500, 'Internal server error')
  }
}

const updateBeautyStatusdb = async ({ id, status }) => {
  try {
    await pool.query('BEGIN')

    const { rows: existingBeauty } = await pool.query(
      'SELECT * FROM beauty WHERE id = $1',
      [id],
    )

    if (existingBeauty.length === 0) {
      await pool.query('ROLLBACK')
      return { message: 'Beauty not found' }
    }

    const updateStatusQuery = `
      UPDATE beauty
      SET status = $1
      WHERE id = $2
    `
    await pool.query(updateStatusQuery, [status, id])

    await pool.query('COMMIT')

    return { message: 'Beauty status successfully updated' }
  } catch (error) {
    await pool.query('ROLLBACK')
    console.error('Error in updateBeautyStatusdb:', error)
    throw new ErrorHandler(500, 'Internal server error')
  }
}

module.exports = {
  createBeautydb,
  createBeautyOrderdb,
  getAllBeautyDB,
  getBeautysByDateAndTimeSlotdb,
  getBeautybyIDdb,
  getBeautybyPetIDdb,
  getAllBeautybyUser_IDdb,
  deleteBeautydb,
  updateBeautydb,
  updateBeautyStatusdb,
}
