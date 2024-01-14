const userModel = require('../models/user-model')
const tokenModel = require('../models/token-model')
const messageModel = require('../models/message-model')
const roomModel = require('../models/room-model')
const bcrypt = require('bcrypt')
const tokenService = require('./token-service')
const UserDto = require('../dtos/user-dto')
const ApiError = require('../exceptions/api-error')
const { default: mongoose } = require('mongoose')

async function generateTokenAndSaveUser(user){
	const userDto = new UserDto(user)
	const tokens = tokenService.generateTokens({...userDto})
	await tokenService.saveToken(userDto.id, tokens.refreshToken)
	return {...tokens, user: userDto}
}

class UserService{
	async registration(username, email, password){
		const candidateUsername = await userModel.findOne({username})
		const candidateEmail = await userModel.findOne({email})
		if(candidateUsername){
			throw ApiError.BadRequest(`User with the same name already exists`)
		}
		if(candidateEmail){
			throw ApiError.BadRequest(`User with the same email address already exists`)
		}

		const hashPassword = await bcrypt.hash(password, 3)
		
		const user = await userModel.create({username, email, password: hashPassword})
		return generateTokenAndSaveUser(user)
	}

	async login(username, password){
		const user = await userModel.findOne({username})
		if(!user){
			throw ApiError.BadRequest('User with this name not found')
		}
		const isPassEquals = await bcrypt.compare(password, user.password)
		if(!isPassEquals){
			throw ApiError.BadRequest('Incorrect password')
		}
		return generateTokenAndSaveUser(user)
	}

	async logout(refreshToken){
		const token = await tokenService.removeToken(refreshToken)
		return token
	}

	async refresh(refreshToken){
		if(!refreshToken){
			throw ApiError.UnauthorizedError()
		}
		const userData = tokenService.validateRefreshToken(refreshToken)
		const tokenFromDb = await tokenService.findToken(refreshToken)
		if(!userData || !tokenFromDb){
			throw ApiError.UnauthorizedError()
		}
		const user = await userModel.findById(userData.id)
		return generateTokenAndSaveUser(user)
	}

	async getAllUsers(){
		const users = await userModel.find()
		return users
	}

	async getAmountOfSentMessages(userId){
		const amountOfSentMessages = await userModel.findById(userId)
		return amountOfSentMessages.amount_of_sent_messages
	}

	async changeUsername(userId, username){
		await userModel.findByIdAndUpdate(userId, {$set: {username: username}})
		const user = await userModel.findById(userId)
		if(!user){
			throw ApiError.BadRequest('User with this name not found')
		}
		return generateTokenAndSaveUser(user)
	}

	async changeEmail(userId, email){
		await userModel.findByIdAndUpdate(userId, {$set: {email: email}})
		const user = await userModel.findById(userId)
		if(!user){
			throw ApiError.BadRequest('User with this email was not found')
		}
		return generateTokenAndSaveUser(user)
	}

	async deleteAccount(userId){
		await userModel.findByIdAndDelete(userId)
		await tokenModel.findOneAndDelete({user: mongoose.Types.ObjectId.createFromHexString(userId)})
		await roomModel.deleteMany({creatorId: userId})
		const user = await userModel.findById(userId)
		if(!user){
			return 'Account successfully deleted!'
		}
		throw ApiError.BadRequest('Incorrect ID')
	}
}

module.exports = new UserService()