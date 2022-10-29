const jwt = require('jsonwebtoken')
const { secret } = require('../config')

module.exports = (roles) => (req, res, next) => {
	if (req.method === 'OPTIONS') next()

	try {
		const token = req.headers.authorization.split(' ')[1]
		if (!token) return res.status(401).json({ message: 'No token provided' })

		const { roles: userRoles } = jwt.verify(token, secret)
		let hasRole = false
		for (let i = 0; i < userRoles.length; i++) {
			if (roles.includes(userRoles[i])) {
				hasRole = true
				break
			}
		}
		if (!hasRole) return res.status(401).json({ message: 'Unauthorized' })
		next()

	} catch (err) {
		console.error(err)
		res.status(401).json({ message: 'Unauthorized' })
	}
}