const mongoose = require('mongoose')

const MessageSchema = new mongoose.Schema({
  text: {type: String, required: true},
  roomId: {type: String, required: true},
  userId: {type: String, required: true},
  time: {type: Date, required: true},
})

module.exports = mongoose.model('Message', MessageSchema)