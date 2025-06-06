const {
  getTimeSlotbyID,
  getTimeSlotApointmentdb,
  getAllTime_Slot_appointmentdb,
  getAllTime_Slot_beautydb,
} = require('../db/timeSlot.db')
const { ErrorHandler } = require('../helpers/error')

class time_slotService {
  getTime_SlotbyID = async (id) => {
    try {
      return await getTimeSlotbyID(id)
    } catch (error) {
      console.log(error)
      throw new ErrorHandler(error.statusCode, 'getTimeSlotbyID False')
    }
  }
  getTimeSlotApointment = async (id) => {
    try {
      return await getTimeSlotApointmentdb(id)
    } catch (error) {
      console.log(error)
      throw new ErrorHandler(error.statusCode, 'getTimeSlotApointmentdb false')
    }
  }
  getAllTime_Slot_appointment = async () => {
    try {
      return await getAllTime_Slot_appointmentdb()
    } catch (error) {
      console.log(error)
      throw new ErrorHandler(
        error.statusCode,
        'getAllTime_Slot_appointment false',
      )
    }
  }
  getAllTime_Slot_beauty = async () => {
    try {
        return await getAllTime_Slot_beautydb();
    } catch (error) {
      console.log(error)
      throw new ErrorHandler(error.statusCode, 'getAllTime_Slot_beauty false')
    }
  }
}
module.exports = new time_slotService()
