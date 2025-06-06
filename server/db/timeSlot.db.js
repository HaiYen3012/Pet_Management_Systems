const pool = require('../config')

const getTimeSlotbyID = async (id) => {
  const { rows: TimeSlot } = await pool.query(
    `SELECT * FROM "time_slot_beauty" WHERE id = $1`,
    [id],
  )
  return TimeSlot[0]
}
const getTimeSlotApointmentdb = async (id) => {
  const { rows: TimeSlot } = await pool.query(
    `SELECT * FROM "time_slot_appointment" WHERE id = $1`,
    [id],
  )
  return TimeSlot[0]
}

const getAllTime_Slot_beautydb = async () => {
  const { rows: beauty } = await pool.query(`SELECT * FROM "time_slot_beauty"`)
  return beauty
}
const getAllTime_Slot_appointmentdb = async () => {
  const { rows: appointment } = await pool.query(
    `SELECT * FROM "time_slot_appointment"`,
  )
  return appointment
}
module.exports = {
  getTimeSlotbyID,
  getTimeSlotApointmentdb,
  getAllTime_Slot_beautydb,
  getAllTime_Slot_appointmentdb,
}
