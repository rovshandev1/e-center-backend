const mongoose = require('mongoose')

const groupSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	description: {
		type: String,
	},
	teacher: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Teacher',
		required: true,
	},
	students: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Student',
		},
	],
	createdAt: {
		type: Date,
		default: Date.now,
	},
})

const Group = mongoose.model('Group', groupSchema)

module.exports = Group
