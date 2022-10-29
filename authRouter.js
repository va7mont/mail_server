const Router = require('express')
const { check } = require('express-validator')
const router = new Router()
const controller = require('./authController')
const authMiddleware = require('./middleware/authMiddleware')
const roleMiddleware = require('./middleware/roleMiddleware')

router.post('/registration', [
	check('username', 'Username is required').notEmpty(),
	check('password', 'Password must be more then 4 and less then 10 symbols').isLength({ min: 4, max: 10 })
], controller.registration)

router.post('/login', controller.login)

router.get('/users', roleMiddleware(['admin']), controller.getUsers)

module.exports = router