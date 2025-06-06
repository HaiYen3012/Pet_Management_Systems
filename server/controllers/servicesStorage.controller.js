const userService = require('../services/users.service')
const { ErrorHandler } = require('../helpers/error')
const serviceStorage = require('../services/serviceStorage.service')
const roomService = require('../services/room.service')
const { levelValSym } = require('pino/lib/symbols')

const createStorageService = async (req, res) => {
  try {
    const { room_id, date_start, date_end, note, pet_id, total } = req.body
    const { user_id } = req.user

    const user = await userService.getUserById(user_id)

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    if (
      +user_id === req.user.user_id ||
      req.user.roles.includes('admin') ||
      req.user.roles.includes('staff')
    ) {
      const room = await roomService.getRoombyID({ room_id })
      if (!room) {
        return res.status(404).json({ message: 'Room not found' })
      }

      const { max_slot, current_slot } = room
      if (current_slot < max_slot) {
        const storageService = await serviceStorage.createStorageService({
          status: 'created',
          room_id,
          date_start,
          date_end,
          note,
        })

        const storageOrder = await serviceStorage.createStorageOrder({
          service_id: storageService.id,
          user_id,
          pet_id,
          total,
        })

        const updatedRoom = await roomService.updateRoom({
          room_id,
          current_slot: current_slot + 1,
        })

        return res.status(201).json({
          status: 'success',
          storageService,
          storageOrder,
          updatedRoom,
        })
      } else {
        return res.status(400).json({ message: 'Maximum slot reached' })
      }
    } else {
      return res.status(401).json({ message: 'Unauthorized' })
    }
  } catch (error) {
    console.log('error>>>', error)
    return res.status(500).json({ message: error.message })
  }
}

const getAllStorageService = async (req, res) => {
  const { user_id } = req.user

  const user = await userService.getUserById(user_id)
  if (!user) {
    throw new ErrorHandler(404, 'User not found')
  }
  if (req.user.roles.includes('admin') || req.user.roles.includes('staff')) {
    const AllStorageService = await serviceStorage.getAllStorageService()
    res.status(201).json({
      status: 'success',
      AllStorageService,
    })
    console.log(user_id)
  } else {
    throw new ErrorHandler(401, 'No Permission')
  }
}

const getStorageServicebyID = async (req, res) => {
  const { user_id } = req.user

  const user = await userService.getUserById(user_id)
  if (!user) {
    throw new ErrorHandler(404, 'User not found')
  }
  if (req.user.roles.includes('admin') || req.user.roles.includes('staff')) {
    const { service_id } = req.query
    const StorageServicebyID = await serviceStorage.getStorageServicebyID(
      service_id,
    )
    res.status(200).json({
      status: 'success',
      StorageServicebyID,
    })
  } else {
    throw new ErrorHandler(401, 'Unauthorized')
  }
}

const getStorageServicebyUser_ID = async (req, res) => {
  const { user_id } = req.user
  const user = await userService.getUserById(user_id)
  if (!user) {
    throw new ErrorHandler(404, 'User not found')
  }
  const getStorageServicebyUser_ID =
    await serviceStorage.getStorageServicebyUser_ID({ user_id })
  res.status(200).json({
    status: 'success',
    getStorageServicebyUser_ID,
  })
}

const deleteStorageService = async (req, res) => {
  const { user_id } = req.user
  const { service_id } = req.body
  const user = await userService.getUserById(user_id)
  if (!user) {
    throw new ErrorHandler(404, 'User not found')
  }
  if (req.user.roles.includes('admin') || req.user.roles.includes('staff')) {
    const storage = await serviceStorage.getStorageServicebyID(service_id)
    if (!storage) {
      return res.status(404).json({
        status: 'error',
        message: 'Storage not found',
      })
    }
    const room_id = storage.room_id
    console.log(room_id)
    const room = await roomService.getRoombyID({ room_id })
    const { current_slot } = room
    const newRoom = await roomService.updateRoom({
      room_id,
      current_slot: current_slot - 1,
    })
    const deleteStorageService = await serviceStorage.deleteStorageService({
      service_id,
    })

    res.status(200).json({
      status: 'success',
      newRoom,
    })
  } else {
    throw new ErrorHandler(401, 'No permission')
  }
}

const updateStorageService = async (req, res) => {
  const { user_id } = req.user
  const { service_id, room_id, note, pet_id, date_start, date_end, status } =
    req.body
  const validStatuses = ['complete', 'canceled', 'processing']
  if (!validStatuses.includes(status)) {
    return res.status(400).json({
      status: 'error',
      message: 'Invalid status',
    })
  }
  const user = await userService.getUserById(user_id)
  if (!user) {
    throw new ErrorHandler(404, 'User not found')
  }
  if (req.user.roles.includes('admin') || req.user.roles.includes('staff')) {
    console.log(service_id)
    const storage = await serviceStorage.getStorageServicebyID(service_id)
    console.log(storage)
    const old_room_id = storage.room_id
    const old_room = await roomService.getRoombyID({ room_id: old_room_id })
    const old_slot = old_room.current_slot
    const update_Oldroom = await roomService.updateRoom({
      room_id: old_room_id,
      current_slot: old_slot + 1,
    })
    const update_storage = await serviceStorage.updateStorageService({
      id: service_id,
      room_id,
      note,
      pet_id,
      date_start,
      date_end,
    })
    const new_room = await roomService.getRoombyID({ room_id })

    const { current_slot } = new_room
    const update_Newroom = await roomService.updateRoom({
      room_id,
      current_slot: current_slot - 1,
    })
    const response = await serviceStorage.updateStorageServiceStatus({
      id: service_id,
      status,
    })
    if (response.message == 'storage not found') {
      return res.status(404).json({
        status: 'error',
        message: response.message,
      })
    }
    res.status(200).json({
      status: 'success',
      response,
    })
  } else if (req.user.roles.includes('customer')) {
    if (!status) {
      const storage = await serviceStorage.getStorageServicebyID(service_id)
      const old_room_id = storage.room_id
      const old_room = await roomService.getRoombyID({ room_id: old_room_id })
      const old_slot = old_room.current_slot
      const update_Oldroom = await roomService.updateRoom({
        room_id: old_room_id,
        current_slot: old_slot + 1,
      })
      const response = await serviceStorage.updateStorageService({
        id: service_id,
        room_id,
        note,
        pet_id,
        date_start,
        date_end,
      })
      const new_room = await roomService.getRoombyID({ room_id })
      const { current_slot } = new_room
      const update_Newroom = await roomService.updateRoom({
        room_id,
        current_slot: current_slot - 1,
      })
      return res.status(200).json({
        status: 'success',
        message: response.message,
      })
    }
    if (status !== 'canceled') {
      return res.status(401).json({
        status: 'error',
        message: 'Unauthorized action',
      })
    }
    if (!room_id || !note || !pet_id || !date_start || !date_end) {
      const response = serviceStorage.updateStorageServiceStatus({
        id: service_id,
        status,
      })
      return res.status(200).json({
        status: 'success',
        message: response.message,
      })
    }
    const storage = await serviceStorage.getStorageServicebyID(service_id)
    const old_room_id = storage.room_id
    const old_room = await roomService.getRoombyID({ room_id: old_room_id })
    const old_slot = old_room.current_slot
    const update_Oldroom = await roomService.updateRoom({
      room_id: old_room_id,
      current_slot: old_slot + 1,
    })
    const update_storage = await serviceStorage.updateStorageService({
      id: service_id,
      room_id,
      note,
      pet_id,
      date_start,
      date_end,
    })
    const new_room = await roomService.getRoombyID({ room_id })
    const { current_slot } = new_room
    const update_Newroom = await roomService.updateRoom({
      room_id,
      current_slot: current_slot - 1,
    })
    const response = await serviceStorage.updateStorageServiceStatus({
      id: service_id,
      status,
    })
    if (response.message === 'storage not found') {
      return res.status(404).json({
        status: 'error',
        message: response.message,
      })
    }
    res.status(200).json({
      status: 'success',
      // update_storage,
      // update_Oldroom,
      // update_Newroom,
      message: response.message,
    })
  } else {
    throw new ErrorHandler(401, 'Unauthorized')
  }
}

const getAllRoom = async (req, res) => {
  try {
    const rooms = await roomService.allRoom()
    return res.status(200).json({ status: 'success', rooms })
  } catch (error) {
    return res.status(500).json({ status: 'error', message: error.message })
  }
}

module.exports = {
  createStorageService,
  getAllStorageService,
  getStorageServicebyID,
  getStorageServicebyUser_ID,
  deleteStorageService,
  updateStorageService,
  getAllRoom,
}
