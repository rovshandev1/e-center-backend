const Student = require('../models/student')
const Attendance = require('../models/attendance')
const Homework = require('../models/homework')

const getStudentProfile = async (req, res) => {
	try {
		const studentId = req.params.id
		const student = await Student.findById(studentId)
			.populate('user', 'name email')
			.populate('groups', 'name')
		if (!student) {
			return res.status(404).json({ message: 'Student not found' })
		}
		res.status(200).json(student)
	} catch (err) {
		res.status(500).json({ message: 'Something went wrong' })
	}
}

const getStudentAttendance = async (req, res) => {
	try {
		const studentId = req.params.id
		const attendance = await Attendance.find({ student: studentId }).populate(
			'group',
			'name'
		)
		res.status(200).json(attendance)
	} catch (err) {
		res.status(500).json({ message: 'Something went wrong' })
	}
}

const getStudentHomework = async (req, res) => {
	try {
		const studentId = req.params.id
		const student = await Student.findById(studentId).populate('groups')
		if (!student) {
			return res.status(404).json({ message: 'Student not found' })
		}
		const homework = await Homework.find({
			group: { $in: student.groups },
		}).populate('group', 'name')
		res.status(200).json(homework)
	} catch (err) {
		res.status(500).json({ message: 'Something went wrong' })
	}
}

module.exports = {
	getStudentProfile,
	getStudentAttendance,
	getStudentHomework,
}
