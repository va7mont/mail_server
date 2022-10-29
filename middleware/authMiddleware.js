const jwt = require('jsonwebtoken')
const { secret } = require('../config')

module.exports = function (req, res, next) {
	if (req.method === 'OPTIONS') next()

	try {
		const token = req.headers.authorization.split(' ')[1]
		if (!token) return res.status(401).json({ message: 'No token provided' })

		const decoded = jwt.verify(token, secret)
		req.user = decoded
		next()

	} catch (err) {
		console.error(err)
		res.status(401).json({ message: 'Unauthorized' })
	}
}