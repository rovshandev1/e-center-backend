const TimeBoard = require('../models/timeBoard')
const User = require('../models/user')
const Group = require('../models/group')

// Dars jadvalini yaratish
const createTimeBoard = async (req, res) => {
	try {
		const { teacher, weeks, startTime, endTime } = req.body;
		const groupId = req.body.group;
		const group = await Group.findById(groupId);
		if (!group) {
			return res.status(404).json({ message: 'Group not found' });
		}

		const timeBoard = new TimeBoard({
			group: groupId,
			teacher,
			weeks,
			startTime,
			endTime,
		});
		await timeBoard.save();

		// Barcha guruh a'zolariga dars jadvali qo'shish
		const students = await User.find({ _id: { $in: group.students } });
		students.forEach(async (student) => {
			student.timeBoards.push(timeBoard._id);
			await student.save();
		});

		res.status(201).json(timeBoard);
	} catch (err) {
		res.status(500).json({ message: 'Something went wrong', error: err.message });
	}
};

// Dars jadvalini yangilash
const updateTimeBoard = async (req, res) => {
	try {
		const timeBoardId = req.params.id
		const {  teacher } = req.body
		const groupId = req.body.group
		const group = await Group.findById(groupId)
		if (!group) {
			return res.status(404).json({ message: 'Group not found' })
		}

		const updatedTimeBoard = await TimeBoard.findByIdAndUpdate(
			timeBoardId,
			{ group: groupId, teacher },
			{ new: true, runValidators: true }
		)
		if (!updatedTimeBoard) {
			return res.status(404).json({ message: 'Time board not found' })
		}

		// Update students' time boards as well
		const students = await User.find({ _id: { $in: group.students } })
		students.forEach(async student => {
			const index = student.timeBoards.indexOf(timeBoardId)
			if (index !== -1) {
				student.timeBoards.splice(index, 1)
			}
			student.timeBoards.push(updatedTimeBoard._id)
			await student.save()
		})

		res.status(200).json(updatedTimeBoard)
	} catch (err) {
		res
			.status(500)
			.json({ message: 'Something went wrong', error: err.message })
	}
}

// Dars jadvalini o'chirish
const deleteTimeBoard = async (req, res) => {
	try {
		const timeBoardId = req.params.id
		const deletedTimeBoard = await TimeBoard.findByIdAndDelete(timeBoardId)
		if (!deletedTimeBoard) {
			return res.status(404).json({ message: 'Time board not found' })
		}

		// Remove time board from students
		const students = await User.find({ timeBoards: timeBoardId })
		students.forEach(async student => {
			const index = student.timeBoards.indexOf(timeBoardId)
			if (index !== -1) {
				student.timeBoards.splice(index, 1)
				await student.save()
			}
		})

		res.status(200).json({ message: 'Time board deleted successfully' })
	} catch (err) {
		res
			.status(500)
			.json({ message: 'Something went wrong', error: err.message })
	}
}

// Dars jadvalini olish
const getTimeBoard = async (req, res) => {
	try {
		const timeBoardId = req.params.id
		const timeBoard = await TimeBoard.findById(timeBoardId).populate(
			'group',
			'name'
		)
		if (!timeBoard) {
			return res.status(404).json({ message: 'Time board not found' })
		}

		const { group } = timeBoard
		const groupName = group.name

		res.status(200).json({ ...timeBoard._doc, groupName })
	} catch (err) {
		res
			.status(500)
			.json({ message: 'Something went wrong', error: err.message })
	}
}

const getAllTimeBoards = async (req, res) => {
	try {
		const allTimeBoards = await TimeBoard.find().populate('group', 'name')
		res.status(200).json(allTimeBoards)
	} catch (err) {
		res
			.status(500)
			.json({ message: 'Something went wrong', error: err.message })
	}
}

module.exports = {
	createTimeBoard,
	updateTimeBoard,
	deleteTimeBoard,
	getTimeBoard,
	getAllTimeBoards,
}
