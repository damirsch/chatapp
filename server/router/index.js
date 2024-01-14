const Router = require('express').Router
const roomController = require('../controllers/room-controller')
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
router.delete('/delete-account', userController.deleteAccount)
router.get('/users', userController.getUsers)
router.get('/refresh', userController.refresh)
router.get('/rooms', roomController.getRooms)
router.post('/messages', roomController.getMessages)
router.post('/amount-of-sent-messages', userController.getAmountOfSentMessages)
router.post('/change-username',
  body('username').isLength({min: 4, max: 20}),
  userController.changeUsername)
router.post('/change-email',
  body('email').isEmail(),
  userController.changeEmail)

module.exports = router