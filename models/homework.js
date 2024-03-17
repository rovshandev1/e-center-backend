const mongoose = require('mongoose')

const homeworkSchema = new mongoose.Schema({
	title: {
		type: String,
		required: true,
	},
	description: {
		type: String,
	},
	dueDate: {
		type: Date,
		required: true,
	},
	group: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Group',
		required: true,
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
})

const Homework = mongoose.model('Homework', homeworkSchema)

module.exports = Homework
