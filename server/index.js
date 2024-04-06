require('dotenv').config()
const CLIENT_URL = process.env.CLIENT_URL
const express = require('express')
const app = express()
const cors = require('cors')
const cookieParser = require('cookie-parser')
const router = require('./router/index')
const mongoose = require('mongoose')
const middleware = require('./middlewares/error-middleware')
const roomModel = require('./models/room-model')
const messageModel = require('./models/message-model')
const http = require('http').createServer(app)
const { Server } = require('socket.io')
const userModel = require('./models/user-model')
const { Mutex } = require('async-mutex')
const { v4: uuidv4 } = require('uuid')

const io = new Server(http, {
	cors: {
		origin: CLIENT_URL,
		methods: ['GET', 'POST']
	}
})

const PORT = process.env.PORT || 5000

app.use(express.json())
app.use(cookieParser())
app.use(cors({
	credentials: false,
	origin: '*'
}))
app.use('/api', router)
app.use(middleware)

const start = async () => {
	try{
		// MongoDB
		await mongoose.set('strictQuery', false)
		await mongoose.connect(process.env.DB_URL, {
			useNewUrlParser: true,
			useUnifiedTopology: true
		})

		// server
		http.listen(PORT, () => console.log('Server started on port:', PORT))

		// sockets
		io.on('connection', (socket) => {
			let currentRoom = null
			socket.on('join', async (data) => {
				const roomId = data.roomId
				const room = await roomModel.findOne({roomId: roomId})
				if(!room){
					io.sockets.emit('error', 'invalid room')
				}
				if(currentRoom){
					socket.leave(roomId)
				}
				socket.join(roomId)
				currentRoom = room
				io.sockets.emit('joined_room', room)
			})
			
			const roomCreationMutex = new Mutex()
			socket.on('send_room', async (data) => {
				if(!data.name){
					socket.emit('error', 'invalid room')
					return
				}
				const release = await roomCreationMutex.acquire()
				const id = uuidv4()
				const user = await userModel.findById(data.userId)
				const amounOfRooms = user.amount_of_rooms
				async function createRoom(){
					newAmount = amounOfRooms + 1
					try{
						const candidateRoom = await roomModel.findOne({name: data.name})
						if(candidateRoom){
							socket.emit('error', 'there is room with the same name')
							return
						}
						const room = await roomModel.create(
							{
								roomId: id, 
								name: data.name, 
								creatorId: data.userId, 
								password: data.password || null
							}
						)
						await userModel.findByIdAndUpdate(
							data.userId,
							{$set: {"amount_of_rooms": newAmount}, $addToSet: {userRooms: room}}
						)
						io.sockets.emit('receive_room', room)
					}finally{
						release()
					}
				}
				if(amounOfRooms < 1 && !user.access_to_create_much_rooms){
					createRoom()
					return
				}else if(user.access_to_create_much_rooms){
					createRoom()
					return
				}
				socket.emit('error', 'much rooms: ' + amounOfRooms)
				return
			})
			
			socket.on('delete_room', async (data) => {
				if(!currentRoom){
					socket.emit('error', 'not connected to the room')
					return
				}
				const roomId = data.roomId
				const room = await roomModel.findOne({roomId})
				if(room.creatorId !== data.userId){
					socket.emit('error', 'access denied')
					return 
				}
				const user = await userModel.findById(data.userId)
				newAmount = user.amount_of_rooms - 1
				const deletedRoom = await roomModel.findOneAndDelete({roomId})
				await userModel.findByIdAndUpdate(
					data.userId, 
					{$pull: {userRooms: {roomId}}, $set: {amount_of_rooms: newAmount}}
				)
				await messageModel.deleteMany({roomId})
				io.sockets.emit('deleted_room', deletedRoom)
			})

			socket.on('send_message', async (data) => {
				let message = data.message
				if(!message){
					socket.emit('error', 'invalid message') // executed when the socket sent invalid message
					return
				}else if(!currentRoom){
					socket.emit('error', 'not connected to the room') // executed when the socket not connected to the room
					return
				}
				const createdMessage = await messageModel.create(
					{text: message, roomId: currentRoom.roomId, userId: data.userId, time: data.time}
				)
				const user = await userModel.findById(data.userId)
				incrementAmountOfSentMessages(user, data)
				io.to(currentRoom.roomId).emit('receive_message', createdMessage)
			})

			socket.on('delete_message', async (data) => {
				if(!currentRoom){
					socket.emit('error', 'not connected to the room')
					return
				}
				const userId = data.userId
				const messageId = data._id
				const message = await messageModel.findById(messageId)
				if(!message) return
				if(message.userId !== userId){
					socket.emit('access denied')
					return
				}
				const deletedMessage = await messageModel.findByIdAndRemove(messageId)
				io.to(currentRoom.roomId).emit('deleted_message', deletedMessage)
			})

			socket.on('change_message', async (data) => {
				if(!currentRoom) return socket.emit('error', 'not connected to the room')
				const userId = data.userId
				const messageId = data.messageId
				const message = await messageModel.findOne(messageId)
				if(!message) return
				if(message.userId !== userId) return socket.emit('error', 'access denied')
				if(message.text = data.text) return socket.emit('error', 'the same message')
				const newMessage = await messageModel.findByIdAndUpdate(messageId, {$set: {text: data.text}})
				io.to(currentRoom.roomId).emit('deleted_message', newMessage)
			})

			async function incrementAmountOfSentMessages(user, data){
				class CreateDate{
					constructor(year, month, day){
						this.year = year
						this.month = month
						this.day = day
					}
				}
				const date = new Date()
				const nowDate = new CreateDate(date.getFullYear(), date.getMonth(), date.getDate())
				let amountOfSentMessages = user.amount_of_sent_messages.filter(i => {
					const prevDate = new CreateDate(
						new Date(i.time).getFullYear(), 
						new Date(i.time).getMonth(), 
						new Date(i.time).getDate()
					)
					const condition = (
							prevDate.year === nowDate.year &&
							prevDate.month === nowDate.month &&
							prevDate.day === nowDate.day
						)
					return condition
				})
				
				if(amountOfSentMessages.length){
					const targetTime = amountOfSentMessages[0].time
					const newAmount = amountOfSentMessages[0].amount + 1
					await userModel.findByIdAndUpdate(
						data.userId,
						{$set: {"amount_of_sent_messages.$[elem].amount": newAmount}},
						{arrayFilters: [{"elem.time": targetTime}]}
					)
				}else{
					await userModel.findByIdAndUpdate(data.userId, {$addToSet: 
						{amount_of_sent_messages: {time: data.time, amount: 1}
					}})
				}
			}
		})
		// ...
	}catch(e){
		console.log(e)
	}
}

start()