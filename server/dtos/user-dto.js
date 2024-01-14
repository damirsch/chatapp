module.exports = class UserDto{
	username
	email
	id
	userRooms
	access_to_create_much_rooms
	amount_of_sent_messages
	amount_of_rooms

	constructor(model){
		this.username = model.username
		this.email = model.email
		this.userRooms = model.userRooms
		this.access_to_create_much_rooms = model.access_to_create_much_rooms
		this.amount_of_sent_messages = model.amount_of_sent_messages
		this.amount_of_rooms = model.amount_of_rooms
		this.id = model.id
	}
}