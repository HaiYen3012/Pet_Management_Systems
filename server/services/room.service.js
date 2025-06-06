const { ErrorHandler } = require('../helpers/error')
const { getRoombyIDdb, updateRoomdb, getAll_Roomdb } = require('../db/room.db')
class RoomService {
  getRoombyID = async(room_id) => {
    try {
      const c = await getRoombyIDdb(room_id)
      return c;
    } catch (error) {
      console.log(error)
      throw new ErrorHandler(error.statusCode, 'Get Room by Id false')
    }
  }
  updateRoom = async(Rooms) => {
    try {
        return await updateRoomdb(Rooms);
    } catch (error) {
      console.log(error)
      throw new ErrorHandler(error.statusCode, 'Update room false')
    }
  }
  allRoom = async() => {
    try {
      return await getAll_Roomdb();
    } catch (error) {
            console.log(error)
            throw new ErrorHandler(error.statusCode, 'allRoom')
    }
  }
}
module.exports = new RoomService()