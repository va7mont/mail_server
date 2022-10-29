const bcrypt = require('bcryptjs')
const { validationResult } = require('express-validator')
const jwt = require('jsonwebtoken')
const User = require('./models/User')
const Role = require('./models/Role')
const { secret } = require('./config')

const generateAccessToken = (id, roles) => {
	const payload = {
		id,
		roles
	}
	return jwt.sign(payload, secret, { expiresIn: '24h' })
}

class authController {
	async registration(req, res) {
		try {
			const errors = validationResult(req)
			if (!errors.isEmpty()) return res.status(400).json({ message: 'Registration error', errors: errors.array() })

			const { username, password } = req.body
			const candidate = await User.findOne({ username })

			if (candidate) return res.status(400).json({ message: 'User already exists' })

			const hashPassword = bcrypt.hashSync(password, 7)
			const userRole = await Role.findOne({ value: 'user' })
			const user = new User({ username, password: hashPassword, roles: [userRole.value] })
			await user.save()
			return res.json({ message: 'User successfully created' })

		} catch (err) {
			console.error(err)
			res.status(400).json({ message: 'Registation Error' })
		}
	}

	async login(req, res) {
		try {
			const { username, password } = req.body
			const user = await User.findOne({ username })
			if (!user) return res.status(400).json({ message: `User ${username} not found` })

			const validPassword = bcrypt.compareSync(password, user.password)
			if (!validPassword) return res.status(400).json({ message: 'Invalid password' })

			const token = generateAccessToken(user._id, user.roles)
			return res.json({ token })

		} catch (err) {
			console.error(err)
			res.status(400).json({ message: 'Login Error' })
		}
	}

	async getUsers(req, res) {
		try {
			const users = await User.find({})
			res.json(users)
		} catch (err) {
			console.error(err)
			res.status(400).json({ message: 'Getting Users Error' })
		}
	}
}

module.exports = new authController()