const ApiError = require('../exceptions/api-error')
const messageModel = require('../models/message-model')
const roomModel = require('../models/room-model')

class RoomService{
  async getRooms() {
    const rooms = await roomModel.find()
    return rooms
  }
}

module.exports = new RoomService()