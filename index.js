const express = require('express')
const mongoose = require('mongoose')
const authRouter = require('./authRouter')
const PORT = process.env.PORT || 3000

const app = express()

app.use(express.json())
app.use('/auth', authRouter)

const start = async () => {
	try {
		await mongoose.connect('mongodb+srv://preacher:JZjx4DAEwHJSNGIS@cluster0.dwci3ls.mongodb.net/?retryWrites=true&w=majority')
		app.listen(PORT, () => console.log(`Server started on port ${PORT}`))
	} catch (err) {
		console.error(err)
	}
}

start()