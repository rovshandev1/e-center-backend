const User = require('../models/user')
const Attendance = require('../models/attendance')
const Homework = require('../models/homework')
const Material = require('../models/material')
const Grade = require('../models/grade')

const getStudent = async (req, res) => {
	try {
		const userId = req.params.id
		const student = await User.findOne({
			_id: userId,
			role: 'student',
		}).populate('groups', 'name dob profileImage')

		if (!student) {
			return res.status(404).json({ message: 'Student not found' })
		}

		// Populate attendance and grades for the student
		const attendance = await Attendance.find({ student: userId })
			.populate('group', 'name')
			.populate('timeBoard', 'weeks, startTime, endTime, group, student')
		const grades = await Grade.find({ student: userId }).populate(
			'group',
			'name'
		)

		// Combine student data with attendance and grades
		const studentWithDetails = {
			...student.toJSON(),
			attendance,
			grades,
		}

		res.status(200).json(studentWithDetails)
	} catch (err) {
		res.status(500).json({ message: 'Something went wrong', err })
	}
}

const getStudentAttendance = async (req, res) => {
	try {
		const studentId = req.params.id
		const attendance = await Attendance.find({ student: studentId })
			.populate('group', 'name')
			.populate('timeBoard', 'lessonName lessonDateTime')
		res.status(200).json(attendance)
	} catch (err) {
		res.status(500).json({ message: 'Something went wrong' })
	}
}

const getStudentHomework = async (req, res) => {
	try {
		const studentId = req.params.id
		const student = await User.findById(studentId).populate('groups')
		if (!student || student.role !== 'student') {
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

const getAllStudents = async (req, res) => {
	try {
		const students = await User.find({ role: 'student' })
			.select('-password')
			.populate('groups', 'name description')

		const studentsWithAttendanceAndGrades = await Promise.all(
			students.map(async student => {
				const attendance = await Attendance.find({ student: student._id })
					.populate('group', 'name')
					.populate('timeBoard', 'weeks')
				const grades = await Grade.find({ student: student._id }).populate(
					'group',
					'name'
				)
				return {
					...student.toJSON(),
					attendance,
					grades,
				}
			})
		)

		res.status(200).json(studentsWithAttendanceAndGrades)
	} catch (err) {
		res.status(500).json({ message: 'Something went wrong', err })
	}
}

const getStudentMaterials = async (req, res) => {
	try {
		const studentId = req.params.id
		const student = await User.findById(studentId).populate('groups')

		if (!student || student.role !== 'student') {
			return res.status(404).json({ message: 'Student not found' })
		}

		const materials = await Material.find({
			group: { $in: student.groups },
		}).populate('group', 'name')

		res.status(200).json(materials)
	} catch (err) {
		res.status(500).json({ message: 'Something went wrong' })
	}
}

module.exports = {
	getStudent,
	getStudentAttendance,
	getStudentHomework,
	getAllStudents,
	getStudentMaterials,
}
