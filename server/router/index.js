const Router = require('express').Router
const userController = require('../controllers/user-controller')
const {body} = require('express-validator')

const router = new Router()

router.post('/registration',
  body('username').isLength({min: 2, max: 40}),
  body('email').isEmail(),
  body('password').isLength({min: 3, max: 32}),
  userController.registration
)
router.post('/login', userController.login)
router.post('/logout', userController.logout)
router.get('/users', userController.getUsers)
router.get('/refresh', userController.refresh)

module.exports = router