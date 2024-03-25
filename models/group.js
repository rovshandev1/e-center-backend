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
		ref: 'User',
		required: true,
	},
	students: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
		},
	],
	timeBoards: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'TimeBoard',
		},
	],
	createdAt: {
		type: Date,
		default: Date.now,
	},
})

const Group = mongoose.model('Group', groupSchema)

module.exports = Group
