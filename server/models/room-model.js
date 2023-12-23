const mongoose = require('mongoose')

const RoomSchema = new mongoose.Schema({
  name: {type: String, required: true},
  roomId: {type: String, required: true},
  creatorId: {type: String, required: true},
  password: {type: String, required: false},
})

module.exports = mongoose.model('Room', RoomSchema)