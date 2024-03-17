const User = require('../models/user')
const Student = require('../models/student')
const Teacher = require('../models/teacher')

const getProfile = async (req, res) => {
	try {
		const userId = req.user.userId
		const user = await User.findById(userId).select('-password')
		if (!user) {
			return res.status(404).json({ message: 'User not found' })
		}
		let profile
		if (user.role === 'student') {
			profile = await Student.findOne({ user: userId }).populate('groups')
		} else {
			profile = await Teacher.findOne({ user: userId }).populate('groups')
		}
		res.status(200).json({ user, profile })
	} catch (err) {
		res.status(500).json({ message: 'Something went wrong' })
	}
}

const updateProfile = async (req, res) => {
	try {
		const userId = req.user.userId
		const { name, dateOfBirth, position } = req.body
		const user = await User.findByIdAndUpdate(
			userId,
			{ name },
			{ new: true, runValidators: true }
		).select('-password')
		if (!user) {
			return res.status(404).json({ message: 'User not found' })
		}
		let profile
		if (user.role === 'student') {
			profile = await Student.findOneAndUpdate(
				{ user: userId },
				{ dateOfBirth },
				{ new: true, runValidators: true }
			)
		} else {
			profile = await Teacher.findOneAndUpdate(
				{ user: userId },
				{ dateOfBirth, position },
				{ new: true, runValidators: true }
			)
		}
		res.status(200).json({ user, profile })
	} catch (err) {
		res.status(500).json({ message: 'Something went wrong' })
	}
}

module.exports = { getProfile, updateProfile }
