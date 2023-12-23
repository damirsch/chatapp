const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
	username: {type: String, unique: true, required: true},
	email: {type: String, unique: true, required: true},
	password: {type: String, required: true},
	userRooms: {type: Array, required: false},
	amount_of_sent_messages: [
		{
			time: {
				type: String,
				required: false
			},
			amount: {
				type: Number,
				required: false
			}
		}
	],
	amount_of_rooms: {type: Number, required: false, default: 0},
	access_to_create_much_rooms: {type: Boolean, required: false, default: false}
})

module.exports = mongoose.model('User', UserSchema)