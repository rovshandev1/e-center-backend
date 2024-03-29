const User = require('../models/user')
const Group = require('../models/group')
const Attendance = require('../models/attendance')

const getTeacherProfile = async (req, res) => {
	try {
		const userId = req.params.id
		const user = await User.findById(userId).populate('groups', 'name')
		if (!user || user.role !== 'teacher') {
			return res.status(404).json({ message: 'Teacher not found' })
		}
		res.status(200).json(user)
	} catch (err) {
		res.status(500).json({ message: 'Something went wrong', err })
	}
}

const getTeacherGroups = async (req, res) => {
	try {
		const userId = req.params.id
		const user = await User.findById(userId)
		if (!user || user.role !== 'teacher') {
			return res.status(404).json({ message: 'Teacher not found' })
		}
		const groups = await Group.find({ teacher: userId }, 'name')
		res.status(200).json(groups)
	} catch (err) {
		res.status(500).json({ message: 'Something went wrong', err })
	}
}

const markAttendance = async (req, res) => {
	try {
		const { groupId, students } = req.body
		const group = await Group.findById(groupId)
		if (!group) {
			return res.status(404).json({ message: 'Group not found' })
		}
		const attendance = await Promise.all(
			students.map(async student => {
				const newAttendance = new Attendance({
					student: student.id,
					group: groupId,
					date: new Date(),
					isPresent: student.isPresent,
				})
				return await newAttendance.save()
			})
		)
		res.status(201).json(attendance)
	} catch (err) {
		res.status(500).json({ message: 'Something went wrong' , err})
	}
}

const updateAttendance = async (req, res) => {
	try {
		const { groupId, students } = req.body
		const group = await Group.findById(groupId)
		if (!group) {
			return res.status(404).json({ message: 'Group not found' })
		}

		const todayDate = new Date().setHours(0, 0, 0, 0) // Set time to 00:00:00 (beginning of the day)

		// Loop through each student and update their attendance
		const updatedAttendance = await Promise.all(
			students.map(async student => {
				// Find the attendance record for the current student in the group for today
				const existingAttendance = await Attendance.findOne({
					student: student.id,
					group: groupId,
					date: { $gte: todayDate, $lt: todayDate + 86400000 }, // Filter by today's date range
				})

				// If attendance record exists, update it
				if (existingAttendance) {
					existingAttendance.isPresent = student.isPresent
					return await existingAttendance.save()
				} else {
					// If no attendance record found for today, create a new one
					const newAttendance = new Attendance({
						student: student.id,
						group: groupId,
						date: new Date(),
						isPresent: student.isPresent,
					})
					return await newAttendance.save()
				}
			})
		)

		res.status(200).json(updatedAttendance)
	} catch (err) {
		res.status(500).json({ message: 'Something went wrong', err })
	}
}

module.exports = {
	getTeacherProfile,
	getTeacherGroups,
	markAttendance,
	updateAttendance,
}
