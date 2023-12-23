const userModel = require('../models/user-model')
const bcrypt = require('bcrypt')
const tokenService = require('./token-service')
const UserDto = require('../dtos/user-dto')
const ApiError = require('../exceptions/api-error')

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
			throw ApiError.BadRequest(`Пользователь с таким именем уже существует`)
		}
		if(candidateEmail){
			throw ApiError.BadRequest(`Пользователь с таким почтовым адресом уже существует`)
		}

		const hashPassword = await bcrypt.hash(password, 3)
		
		const user = await userModel.create({username, email, password: hashPassword})
		return generateTokenAndSaveUser(user)
	}

	async login(username, password){
		const user = await userModel.findOne({username})
		if(!user){
			throw ApiError.BadRequest('Пользователь с таким именем не найден')
		}
		const isPassEquals = await bcrypt.compare(password, user.password)
		if(!isPassEquals){
			throw ApiError.BadRequest('Неверный пароль')
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
}

module.exports = new UserService()