const userService = require('../services/users.service')
const time_slotService = require('../services/time_slot.service')
const roomService = require('../services/room.service')
const { ErrorHandler } = require('../helpers/error')

const allPrice = async (req, res) => {
  res.json({
    storage: await roomService.allRoom(),
    beauty: await time_slotService.getAllTime_Slot_beauty(),
    appointment: await time_slotService.getAllTime_Slot_appointment(),
  })
}

const servicePrice = async (req, res) => {
  const { user_id } = req.user
  const user = await userService.getUserById(user_id)
  if (!user) {
    throw new ErrorHandler(404, 'User not found')
  }
  if (+user_id === req.user.user_id) {
    const { name, room_id, time_slot } = req.body
    if (!room_id) {
      if (name == 'Dịch vụ khám chữa bệnh') {
        const time_slot_price = await time_slotService.getTimeSlotApointment({
          id: time_slot,
        })
        console.log(time_slot_price)
        const { price, unit } = time_slot_price
        res.json({
          price: price,
          unit: unit,
        })
      }
      if (name == 'Dịch vụ vệ sinh') {
        const time_slot_price = await time_slotService.getTime_SlotbyID({
          id: time_slot,
        })
        const { price, unit } = time_slot_price
        res.json({ price: price, unit: unit })
      }
    } else {
      const room = await roomService.getRoombyID({ room_id })
      const { price, unit } = room
      res.json({
        price: price,
        unit: unit,
      })
    }
  } else {
    throw new ErrorHandler(401, 'Unauthorized')
  }
}

module.exports = {
  allPrice,
  servicePrice,
}
