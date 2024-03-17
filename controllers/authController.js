const User = require('../models/user')
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')

dotenv.config()

const register = async (req, res) => {
	try {
		const { name, email, password, role } = req.body
		const existingUser = await User.findOne({ email })
		if (existingUser) {
			return res.status(400).json({ message: 'Email already exists' })
		}
		const user = new User({ name, email, password, role })
		await user.save()
		res.status(201).json({ message: 'User registered successfully' })
	} catch (err) {
		res.status(500).json({ message: 'Something went wrong' })
	}
}

const login = async (req, res) => {
	try {
		const { email, password } = req.body
		const user = await User.findOne({ email })
		if (!user) {
			return res.status(400).json({ message: 'Invalid credentials' })
		}
		const isMatch = await user.comparePassword(password)
		if (!isMatch) {
			return res.status(400).json({ message: 'Invalid credentials' })
		}
		const token = jwt.sign(
			{ userId: user._id, role: user.role },
			process.env.JWT_SECRET,
			{ expiresIn: '1d' }
		)
		res.status(200).json({ token, role: user.role })
	} catch (err) {
		res.status(500).json({ message: 'Something went wrong' })
	}
}

module.exports = { register, login }
