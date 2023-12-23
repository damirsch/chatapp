const messageModel = require('../models/message-model')

class MessageService{
  async getMessages(roomId) {
    const rooms = await messageModel.find({roomId: roomId})
    return rooms
  }
}

module.exports = new MessageService()