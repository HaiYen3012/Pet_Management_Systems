const pool = require('../config')

const getRoombyIDdb = async ({ room_id }) => {
  const { rows: rooms } = await pool.query(
    `SELECT * FROM "room" WHERE id = $1`,
    [room_id],
  )
  return rooms[0]
}

const updateRoomdb = async ({ room_id, current_slot }) => {
  const { rows: rooms } = await pool.query(
    `UPDATE "room"
        SET current_slot = $1
        WHERE id = $2
        RETURNING id, type, max_slot, current_slot, price, unit`,
    [current_slot, room_id],
  )
  return rooms[0]
}
const getAll_Roomdb = async () => {
  const { rows: rooms } = await pool.query(`SELECT * FROM "room"`)
  return rooms
}
module.exports = { getRoombyIDdb, updateRoomdb, getAll_Roomdb }
