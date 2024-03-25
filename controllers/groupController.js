const Group = require('../models/group')
const User = require('../models/user.js')

const createGroup = async (req, res) => {
	try {
		const { name, description } = req.body
		const userId = req.user.userId
		// Foydalanuvchi obyektini topish
		const user = await User.findById(userId)
		// Foydalanuvchi topilmayotgan yoki roli "teacher" emas bo'lsa, xato qaytarish
		if (!user || user.role !== 'teacher') {
			return res.status(404).json({ message: 'Teacher not found' })
		}
		// Guruh obyektini yaratish va saqlash
		const group = new Group({ name, description, teacher: user._id })
		// Muallifning guruhlari ro'yxatiga qo'shish
		if (!user.groups) {
			user.groups = []
		}
		user.groups.push(group._id)
		await user.save()
		await group.save()
		res.status(201).json(group)
	} catch (err) {
		console.error(err)
		res
			.status(500)
			.json({ message: 'Something went wrong', error: err.message })
	}
}

const getAllGroups = async (req, res) => {
	try {
		const groups = await Group.find()
			.populate('teacher', 'name profileImage position dob')
			.populate('students', 'name profileImage dob')
		res.status(200).json(groups)
	} catch (err) {
		res.status(500).json({ message: 'Something went wrong' })
	}
}

const getGroupById = async (req, res) => {
	try {
		const groupId = req.params.id
		const group = await Group.findById(groupId)
			.populate('teacher', 'name profileImage dob position')
			.populate('students', 'name profileImage dob')
		if (!group) {
			return res.status(404).json({ message: 'Group not found' })
		}
		res.status(200).json(group)
	} catch (err) {
		res.status(500).json({ message: 'Something went wrong' })
	}
}

const updateGroup = async (req, res) => {
	try {
		const groupId = req.params.id
		const { name, description } = req.body
		const group = await Group.findByIdAndUpdate(
			groupId,
			{ name, description },
			{ new: true, runValidators: true }
		)
		if (!group) {
			return res.status(404).json({ message: 'Group not found' })
		}
		res.status(200).json(group)
	} catch (err) {
		res.status(500).json({ message: 'Something went wrong' })
	}
}

const deleteGroup = async (req, res) => {
	try {
		const groupId = req.params.id
		const group = await Group.findByIdAndDelete(groupId)
		if (!group) {
			return res.status(404).json({ message: 'Group not found' })
		}

		// Ushbu guruhga tegishli bo'lgan barcha o'quvchilarni yangilash
		await User.updateMany(
			{ role: 'student', groups: groupId },
			{ $pull: { groups: groupId } }
		)

		// Ushbu guruhga tegishli bo'lgan barcha o'qituvchilarni yangilash
		await User.updateMany(
			{ role: 'teacher', groups: groupId },
			{ $pull: { groups: groupId } }
		)

		res.status(200).json({ message: 'Group deleted successfully' })
	} catch (err) {
		res.status(500).json({ message: 'Something went wrong', err })
	}
}

const addStudentsToGroup = async (req, res) => {
	try {
		const groupId = req.params.groupId
		const { studentIds } = req.body

		// Guruhni topish
		const group = await Group.findById(groupId)

		if (!group) {
			return res.status(404).json({ message: 'Group not found' })
		}

		// Talabalarni topish va tekshirish
		const students = await User.find({
			_id: { $in: studentIds },
			role: 'student',
		})

		if (students.length !== studentIds.length) {
			return res.status(404).json({ message: 'One or more students not found' })
		}

		// Talabalarni guruhga qo'shish
		for (const student of students) {
			if (!student.groups) {
				student.groups = []
			}

			if (!student.groups.includes(groupId)) {
				student.groups.push(groupId)
				group.students.push(student._id)
			}
		}

		// Guruh va talabalarni saqlash
		await group.save()
		await Promise.all(students.map(student => student.save()))

		res.status(200).json({ message: 'Students added to group successfully' })
	} catch (err) {
		res.status(500).json({ message: 'Something went wrong', err })
	}
}


const removeStudentFromGroup = async (req, res) => {
	try {
		const groupId = req.params.groupId
		const studentId = req.params.studentId
		const group = await Group.findById(groupId)
		const student = await User.findById(studentId)
		if (!group || !student) {
			return res.status(404).json({ message: 'Group or student not found' })
		}
		group.students.pull(studentId)
		student.groups.pull(groupId)
		await group.save()
		await student.save()

		res.status(200).json({ message: 'Student removed from group successfully' })
	} catch (err) {
		res.status(500).json({ message: 'Something went wrong', err })
	}
}

module.exports = {
	createGroup,
	getAllGroups,
	getGroupById,
	updateGroup,
	deleteGroup,
	addStudentsToGroup,
	removeStudentFromGroup,
}
