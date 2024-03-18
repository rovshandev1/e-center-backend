const mongoose = require('mongoose')

const studentSchema = new mongoose.Schema({
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true,
	},
	dateOfBirth: {
		type: Date,
		required: true,
	},
	profileImage: { type: String },
	groups: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Group',
		},
	],
})

const Student = mongoose.model('Student', studentSchema)

module.exports = Student
