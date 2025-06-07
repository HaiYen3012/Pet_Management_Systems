const userService = require('../services/users.service')
const { ErrorHandler } = require('../helpers/error')
const serviceBeauty = require('../services/serviceBeauty.service')
const time_slotService = require('../services/time_slot.service')
const PetService = require('../services/pets.service')
const createBeauty = async (req, res) => {
  const { date, note, time_slot, pet_id, total } = req.body
  const { user_id } = req.user
  const user = await userService.getUserById(user_id)
  if (!user) {
    throw new ErrorHandler(404, 'User not found')
  }
  if (
    +user_id === req.user.user_id ||
    req.user.roles.include('admin') ||
    req.user.roles.include('staff')
  ) {
    const currentDate = new Date()
    console.log("curr: ", currentDate);
    const beautyDate = new Date(date)
    console.log("beautyDate: ", beautyDate);
    console.log("date: ", date);
    // Kiểm tra nếu date nhỏ hơn hôm nay
    if (beautyDate < currentDate.setHours(0, 0, 0, 0)) {
      throw new ErrorHandler(400, 'The beauty date cannot be in the past.')
    }
    // Kiểm tra time_slot trong bảng time_slot
    const timeSlot = await time_slotService.getTime_SlotbyID(time_slot)
    if (!timeSlot) {
      throw new ErrorHandler(404, 'Time slot not found')
    }

    const [hours, minutes] = timeSlot.time.split(':').map(Number)
    const beautyTime = new Date(date)
    beautyTime.setHours(hours, minutes, 0, 0)

    // Nếu ngày hẹn là hôm nay và thời gian hẹn nhỏ hơn thời gian hiện tại
    if (
      beautyDate.toDateString() === currentDate.toDateString() &&
      beautyTime < new Date()
    ) {
      throw new ErrorHandler(400, 'The appointment time cannot be in the past.')
    }

    const beauty = await serviceBeauty.createBeauty({
      status: 'created',
      date: beautyTime,
      note,
      time_slot,
    })
    let service_id = beauty.id
    let {user_id} = req.user;
    const beauty_order = await serviceBeauty.createBeautyOrder({
      service_id,
      user_id ,
      pet_id,
      total,
    })

    res.status(201).json({
      status: 'success',
      beauty,
      beauty_order,
    })
  } else {
    throw new ErrorHandler(401, 'Unauthorized')
  }
}

const allBeauty = async (req, res) => {
  const { user_id } = req.user

  const user = await userService.getUserById(user_id)
  if (!user) {
    throw new ErrorHandler(404, 'User not found')
  }
  if (req.user.roles.includes('admin') || req.user.roles.includes('staff')) {
    const AllBeauty = await serviceBeauty.getAllBeauty()
    res.status(201).json({
      status: 'success',
      AllBeauty,
    })
  } else {
    throw new ErrorHandler(401, 'No Permission')
  }
}


const getAllBeautybyUser_ID = async (req, res) => {
  const { user_id, roles } = req.user

  const user = await userService.getUserById(user_id)
  const isAdmin = roles.includes('admin') || roles.includes('staff')
  if (!user) {
    throw new ErrorHandler(404, 'User not found')
  }
  if (+user_id === req.user.user_id || isAdmin) {
    const allBeauty = await serviceBeauty.getAllBeautybyUser_ID(
      user_id,
      isAdmin,
    )
    res.status(201).json({
      status: 'success',
      allBeauty,
    })
    // console.log(user_id)
  } else {
    throw new ErrorHandler(401, 'Unauthorized')
  }
}

const getBeautybyPet_ID = async(req, res) => {
  const {user_id, roles} = req.user;
  const user = await userService.getUserById(user_id);
  const isAdmin = roles.includes('admin') || roles.includes('staff')
  const pet = await PetService.getServicePetbyUser_ID({user_id});
    if (!user) {
    throw new ErrorHandler(404, 'User not found')
  }
  console.log(pet);
  res.status(201).json({pet});
}

const getBeautybyID = async (req, res) => {
  const { user_id } = req.user

  const user = await userService.getUserById(user_id)
  if (!user) {
    throw new ErrorHandler(404, 'User not found')
  }
  if (
    +user_id === req.user.user_id ||
    req.user.roles.includes('admin') ||
    req.user.roles.includes('staff')
  ) {
    const { id } = req.body
    const beautyById = await serviceBeauty.getBeautybyID({ id })
    res.status(200).json({
      status: 'success',
      beautyById,
    })
  } else {
    throw new ErrorHandler(401, 'Unauthorized')
  }
}

const deleteBeauty = async (req, res) => {
  console.log("đã xóa");
  const { user_id } = req.user
  const { id } = req.body
  const user = await userService.getUserById(user_id)
  if (!user) {
    throw new ErrorHandler(404, 'User not found')
  }
  if (
    +user_id === req.user.user_id ||
    req.user.roles.includes('admin') ||
    req.user.roles.includes('staff')
  ) {
    const delete_beauty = await serviceBeauty.deleteBeauty(id)
    res.status(200).json({
      status: 'success',
      delete_beauty,
    })
  } else {
    throw new ErrorHandler(401, 'Unauthorized')
  }
}

const updateBeauty = async (req, res) => {
  const { user_id } = req.user
  const validStatuses = ['complete', 'canceled', 'processing']
  const user = await userService.getUserById(user_id)
  if (!user) {
    throw new ErrorHandler(404, 'User not found')
  }

  try {
      if (req.user.roles.includes('admin') || req.user.roles.includes('staff')) {
        const { id, date, note, time_slot, pet_id, status } = req.body
        if (!validStatuses.includes(status)) {
          return res.status(400).json({
            status: 'error',
            message: 'Invalid status',
          })
        }
        const response = await serviceBeauty.updateBeautyStatus({ id, status })
        const update_beauty = await serviceBeauty.updateBeauty({
          id,
          date,
          note,
          time_slot,
          pet_id,
        })
        if (response.message === 'Beauty not found') {
          return res.status(404).json({
            status: 'error',
            message: response.message,
          })
        }

        res.status(200).json({
          status: 'success',
          update_beauty,
        })
      } else if (req.user.roles.includes('customer')) {
        const { id, date, note, time_slot, pet_id, status } = req.body
        if (!status) {
        const response = await serviceBeauty.updateBeauty({
          id,
          date,
          note,
          time_slot,
          pet_id,
        })
          return res.status(200).json({
            status: 'success',
            message: response.message,
          })          
        }
        if (status != 'canceled') {
          return res.status(401).json({
            status: 'error',
            message: 'Unauthorized action',
          })
        }
        if (!date || !note || !time_slot || !pet_id || status) {
          const response = await serviceBeauty.updateBeautyStatus({ id, status })
          return res.status(200).json({
            status: 'success',
            message: response.message,
          })  
        }
        const response = await serviceBeauty.updateBeautyStatus({
          id,
          status,
        })
        if (response.message === 'Beauty not found') {
          return res.status(404).json({
            status: 'error',
            message: response.message,
          })
        }
        const update_beauty = await serviceBeauty.updateBeauty({
          id,
          date,
          note,
          time_slot,
          pet_id,
        })
        res.status(200).json({
          status: 'success',
          update_beauty,
        })
      } else {
        throw new ErrorHandler(401, 'Unauthorized')
      }
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message,
    })
  }
}

module.exports = {
  createBeauty,
  allBeauty,
  getAllBeautybyUser_ID,
  getBeautybyID,
  deleteBeauty,
  updateBeauty,
  getBeautybyPet_ID,
}
