const Homework = require('../models/homework')
const Group = require('../models/group')

const createHomework = async (req, res) => {
	try {
		const { title, description, dueDate, groupId } = req.body
		const group = await Group.findById(groupId)
		if (!group) {
			return res.status(404).json({ message: 'Group not found' })
		}
		const homework = new Homework({
			title,
			description,
			dueDate,
			group: groupId,
		})
		await homework.save()
		res.status(201).json(homework)
	} catch (err) {
		res.status(500).json({ message: 'Something went wrong' })
	}
}

const getAllHomework = async (req, res) => {
	try {
		const homework = await Homework.find().populate('group', 'name')
		res.status(200).json(homework)
	} catch (err) {
		res.status(500).json({ message: 'Something went wrong' })
	}
}

const getHomeworkById = async (req, res) => {
	try {
		const homeworkId = req.params.id
		const homework = await Homework.findById(homeworkId).populate(
			'group',
			'name'
		)
		if (!homework) {
			return res.status(404).json({ message: 'Homework not found' })
		}
		res.status(200).json(homework)
	} catch (err) {
		res.status(500).json({ message: 'Something went wrong' })
	}
}

const updateHomework = async (req, res) => {
	try {
		const homeworkId = req.params.id
		const { title, description, dueDate, groupId } = req.body
		const group = await Group.findById(groupId)
		if (!group) {
			return res.status(404).json({ message: 'Group not found' })
		}
		const homework = await Homework.findByIdAndUpdate(
			homeworkId,
			{ title, description, dueDate, group: groupId },
			{ new: true, runValidators: true }
		)
		if (!homework) {
			return res.status(404).json({ message: 'Homework not found' })
		}
		res.status(200).json(homework)
	} catch (err) {
		res.status(500).json({ message: 'Something went wrong' })
	}
}

const deleteHomework = async (req, res) => {
	try {
		const homeworkId = req.params.id
		const homework = await Homework.findByIdAndDelete(homeworkId)
		if (!homework) {
			return res.status(404).json({ message: 'Homework not found' })
		}
		res.status(200).json({ message: 'Homework deleted successfully' })
	} catch (err) {
		res.status(500).json({ message: 'Something went wrong', err })
	}
}

module.exports = {
	createHomework,
	getAllHomework,
	getHomeworkById,
	updateHomework,
	deleteHomework,
}
