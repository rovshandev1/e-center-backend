const Grade = require('../models/grade')
const Group = require('../models/group')
const Submission = require('../models/submission')
const User = require('../models/user')

// Create a new grade
const createGrade = async (req, res) => {
	try {
		const { studentId, groupId, subject, grade, submissionId } = req.body

		// Check if student, group, and submission exist
		const [student, group, submission] = await Promise.all([
			User.findById(studentId),
			Group.findById(groupId),
			Submission.findById(submissionId).populate('homework'),
		])

		if (!student || !group || !submission) {
			return res
				.status(404)
				.json({ message: 'Student, group, or submission not found' })
		}

		// Check if the student is part of the group
		const isStudentInGroup = group.students.includes(studentId)
		if (!isStudentInGroup) {
			return res
				.status(400)
				.json({ message: 'Student is not part of the group' })
		}

		// Check if a grade entry already exists for today
		const today = new Date()
		today.setHours(0, 0, 0, 0)
		const existingGrade = await Grade.findOne({
			student: studentId,
			createdAt: { $gte: today },
		})

		if (existingGrade) {
			return res
				.status(400)
				.json({ message: 'A grade entry already exists for today' })
		}

		// Create a new grade
		const newGrade = new Grade({
			student: studentId,
			group: groupId,
			homework: submission.homework._id,
			subject,
			grade,
		})

		await newGrade.save()

		res.status(201).json(newGrade)
	} catch (err) {
		res.status(500).json({ message: 'Something went wrong', err })
	}
}

// Get grades for a student
const getStudentGrades = async (req, res) => {
	try {
		const studentId = req.params.id
		console.log(req.params)

		// Find the student and populate their grades
		const student = await User.findById(studentId).populate({
			path: 'grades',
			populate: {
				path: 'group',
				select: 'name',
			},
		})

		if (!student) {
			return res.status(404).json({ message: 'Student not found' })
		}

		res.status(200).json(student.grades)
	} catch (err) {
		res.status(500).json({ message: 'Something went wrong', err })
	}
}

// Update a grade
const updateGrade = async (req, res) => {
	try {
		const { grade } = req.body
		const gradeId = req.params.id

		// Find the grade by ID and update it
		const updatedGrade = await Grade.findByIdAndUpdate(
			gradeId,
			{ grade },
			{ new: true }
		)

		if (!updatedGrade) {
			return res.status(404).json({ message: 'Grade not found' })
		}

		res.status(200).json(updatedGrade)
	} catch (err) {
		res.status(500).json({ message: 'Something went wrong', err })
	}
}

// Delete a grade
const deleteGrade = async (req, res) => {
	try {
		const gradeId = req.params.id

		// Find the grade by ID and delete it
		const deletedGrade = await Grade.findByIdAndDelete(gradeId)

		if (!deletedGrade) {
			return res.status(404).json({ message: 'Grade not found' })
		}

		res.status(200).json({ message: 'Grade deleted successfully' })
	} catch (err) {
		res.status(500).json({ message: 'Something went wrong', err })
	}
}

module.exports = { createGrade, getStudentGrades, updateGrade, deleteGrade }
