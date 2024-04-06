const userService = require("../service/user-service")
const {validationResult} = require('express-validator')
const ApiError = require("../exceptions/api-error")
const tokenService = require("../service/token-service")

class UserController{
	async registration(req, res, next){
		try{
			const errors = validationResult(req)
			if(!errors.isEmpty()){
				return next(ApiError.BadRequest('Validation Error', errors.array()))
			}
			const {username, email, password} = req.body
			const userData = await userService.registration(username, email, password)
			res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 1000, path: '/', httpOnly: true})
			return res.json(userData)
		}catch(e){
			next(e)
		}
	}

	async login(req, res, next){
		try{
			const {username, password} = req.body
			const userData = await userService.login(username, password)
			res.cookie('refreshToken', userData.refreshToken, {httpOnly: true,
				maxAge: 60 * 60 * 24 * 1000,
				path: '/api/',
				sameSite: 'strict',
				secure: true,
				signed: true})
			return res.json(userData)
		}catch(e){
			next(e)
		}
	}

	async logout(req, res, next){
		try{
			const {refreshToken} = req.cookies
			const token = await userService.logout(refreshToken)
			res.clearCookie('refreshToken')
			return res.json(token)
		}catch(e){
			next(e)
		}
	}

	async refresh(req, res, next){
		try{
			const {refreshToken} = req.cookies
			const userData = await userService.refresh(refreshToken)
			res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 1000, httpOnly: true})
			return res.json(userData)
		}catch(e){
			next(e)
		}
	}

	async getUsers(_, res, next){
		try{
			const users = await userService.getAllUsers()
			return res.json(users)
		}catch(e){
			next(e)
		}
	}

	async getAmountOfSentMessages(req, res, next){
		try{
			const {userId} = req.body
			const amountOfSentMessages = await userService.getAmountOfSentMessages(userId)
			return res.json(amountOfSentMessages)
		}catch(e){
			next(e)
		}
	}

	async changeUsername(req, res, next){
		try{
			const {refreshToken} = req.cookies
			tokenService.validateRefreshToken(refreshToken)
			const errors = validationResult(req)
			if(!errors.isEmpty()){
				return next(ApiError.BadRequest('Validation error', errors.array()))
			}
			const {userId, username} = req.body
			const userData = await userService.changeUsername(userId, username, refreshToken)
			res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 1000, httpOnly: true})
			return res.json(userData)
		}catch(e){
			next(e)
		}
	}

	async changeEmail(req, res, next){
		try{
			const {refreshToken} = req.cookies
			tokenService.validateRefreshToken(refreshToken)
			const errors = validationResult(req)
			if(!errors.isEmpty()){
				return next(ApiError.BadRequest('Validation error', errors.array()))
			}
			const {userId, email} = req.body
			const userData = await userService.changeEmail(userId, email, refreshToken)
			res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 1000, httpOnly: true})
			return res.json(userData)
		}catch(e){
			next(e)
		}
	}

	async deleteAccount(req, res, next){
		try{
			const {refreshToken} = req.cookies
			tokenService.validateRefreshToken(refreshToken)
			const {userId} = req.query
			const userData = await userService.deleteAccount(userId)
			res.clearCookie('refreshToken')
			return res.json(userData)
		}catch(e){
			next(e)
		}
	}
}

module.exports = new UserController()