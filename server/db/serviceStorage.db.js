const pool = require('../config')
const { ErrorHandler } = require('../helpers/error')

const formatDateToISO = (dateString) => {
  const [day, month, year] = dateString.split('/')
  return new Date(`${year}-${month}-${day}`).toISOString()
}

const createStorageServicedb = async ({
  status,
  room_id,
  date_start,
  date_end,
  note,
}) => {
  // const formattedDateStart = formatDateToISO(date_start)
  // const formattedDateEnd = formatDateToISO(date_end)
  const { rows: StorageService } = await pool.query(
    `INSERT INTO "storage" ("status","room_id", "date_start", "date_end", "note") 
       VALUES ($1, $2, $3, $4, $5) 
       RETURNING "id", "status", "room_id", "date_start", "date_end", "note"`,
    [status, room_id, date_start, date_end, note],
  )
  return StorageService[0]
}

const createStorage_Orderdb = async ({
  service_id,
  user_id,
  pet_id,
  total,
}) => {
  const { rows: StorageOrder } = await pool.query(
    `INSERT INTO "storage_orders"("service_id","user_id","pet_id","total") 
          VALUES($1, $2, $3, $4) 
          returning "id", "service_id","user_id","pet_id","create_at","total"`,
    [service_id, user_id, pet_id, total],
  )
  return StorageOrder[0]
}

const getAllStorageServiceDB = async () => {
  const query = `
      SELECT 
        s.*, 
        r.type AS room_type,
        so.id AS order_id,
        so.service_id AS order_service_id,
        so.user_id AS order_user_id,
        so.pet_id AS order_pet_id,
        so.create_at AS order_created_at,
        so.total AS order_total
      FROM 
        storage s
      LEFT JOIN 
        room r ON s.room_id = r.id
      LEFT JOIN 
        storage_orders so ON s.id = so.service_id
    `
  const { rows: allStorageService } = await pool.query(query)
  return allStorageService
}

const getStorageServicebyIDdb = async (service_id) => {
  const { rows: StorageServicebyID } = await pool.query(
    `SELECT ss.*, so.user_id, so.pet_id, so.total, so.create_at, ro.*
       FROM "storage" ss
       JOIN "storage_orders" so ON ss.id = so.service_id
       JOIN "room" ro ON ss.room_id = ro.id
       WHERE ss.id = $1`,
    [service_id],
  )
  console.log(service_id);
  console.log(StorageServicebyID);
  return StorageServicebyID[0]
}

const getStorageServicebyUser_IDdb = async ({ user_id }) => {
  const { rows: StorageServicebyUser_ID } = await pool.query(
    `SELECT ss.*, so.user_id, so.pet_id, so.total, so.create_at, ro.*
       FROM "storage" ss
       JOIN "storage_orders" so ON ss.id = so.service_id
       JOIN "room" ro ON ss.room_id = ro.id
       WHERE so.user_id = $1`,
    [user_id],
  )
  console.log(StorageServicebyUser_ID)
  return StorageServicebyUser_ID
}

const deleteStorageServicedb = async ({ service_id }) => {
  try {
    await pool.query(`DELETE FROM "storage_orders" WHERE "id" = $1;`, [
      service_id,
    ])

    await pool.query(`DELETE FROM "storage" WHERE "id" = $1 RETURNING *;`, [
      service_id,
    ])
    return 'Success'
  } catch (error) {
    console.error('Error in deleteStorageServicedb:', error)
    throw error
  }
}

const updateStorageServicedb = async ({
  id,
  room_id,
  note,
  pet_id,
  date_start,
  date_end,
}) => {
  try {
    await pool.query(`BEGIN`)

    const { rows: existingStorage } = await pool.query(
      `SELECT * FROM storage where id = $1`,
      [id],
    )
    if (existingStorage.length == 0) {
      await pool.query(`ROLLBACK`)
      return { message: 'storage not found' }
    }

    const { rows: existingStorageOrder } = await pool.query(
      `SELECT * FROM storage_orders where service_id = $1`,
      [id],
    )

    if (existingStorageOrder.length == 0) {
      await pool.query(`ROLLBACK`)
      return { message: 'storage order not found' }
    }

    // Update storage
    const storageQuery = `
      UPDATE storage 
      set room_id = $1, date_start=$2, date_end=$3, note=$4
      where id = $5`
    await pool.query(storageQuery, [room_id, date_start, date_end, note, id])

    const storage_ordersQuery = `
      UPDATE storage_orders
      set pet_id=$1
      where service_id=$2`
    await pool.query(storage_ordersQuery, [pet_id, id])

    await pool.query('COMMIT')

    return { message: 'storage successfully updated' }
  } catch (error) {
    await pool.query('ROLLBACK')
    console.log(error)
    throw new ErrorHandler(500, 'Internal server error')
  }
}

const updateStorageServiceStatusdb = async ({ id, status }) => {
  try {
    await pool.query(`BEGIN`)

    const { rows: existingStorage } = await pool.query(
      `SELECT * FROM storage where id = $1`,
      [id],
    )
    if (existingStorage.length == 0) {
      await pool.query(`ROLLBACK`)
      return { message: 'storage not found' }
    }

    const updateStatusQuery = `
      UPDATE storage
      SET "status" = $1
      WHERE id = $2
    `
    await pool.query(updateStatusQuery, [status, id])

    await pool.query('COMMIT')

    return { message: 'storage status successfully updated' }
  } catch (error) {
    await pool.query('ROLLBACK')
    console.error('Error in updateStorageServiceStatusdb:', error)
    throw new ErrorHandler(500, 'Internal server error')
  }
}

module.exports = {
  createStorageServicedb,
  createStorage_Orderdb,
  getAllStorageServiceDB,
  getStorageServicebyIDdb,
  getStorageServicebyUser_IDdb,
  deleteStorageServicedb,
  updateStorageServicedb,
  updateStorageServiceStatusdb,
}
