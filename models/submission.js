const mongoose = require('mongoose')

const submissionSchema = new mongoose.Schema({
	homework: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Homework',
		required: true,
	},
	student: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true,
	},
	grades: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Grade',
		},
	],
	file: {
		type: String,
	},
	fileType: {
		type: String,
	},
	submittedAt: {
		type: Date,
		default: Date.now,
	},
})

const Submission = mongoose.model('Submission', submissionSchema)

module.exports = Submission
