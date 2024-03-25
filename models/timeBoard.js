const mongoose = require('mongoose')

const timeBoardSchema = new mongoose.Schema({
	student: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
	},
	teacher: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true,
	},
	lessonName: {
		type: String,
		required: true,
	},
	lessonDateTime: {
		type: String,
		required: true,
	},
	group: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Group',
		required: true,
	},
})

const TimeBoard = mongoose.model('TimeBoard', timeBoardSchema)

module.exports = TimeBoard
