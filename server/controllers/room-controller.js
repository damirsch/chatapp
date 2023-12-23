const roomService = require("../service/room-service")
const messageService = require("../service/message-service")

class RoomController{
  async getRooms(req, res, next){
    try{
      const rooms = await roomService.getRooms()
      return res.json(rooms)
    }catch(e){
      next(e)
    }
  }

  async getMessages(req, res, next){
    try{
      const { roomId } = req.body
      const rooms = await messageService.getMessages(roomId)
      return res.json(rooms)
    }catch(e){
      next(e)
    }
  }
}

module.exports = new RoomController()