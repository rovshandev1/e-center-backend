const express = require('express')
const router = express.Router()
const auth = require('../middlewares/auth')
const {
	getStudentProfile,
	getStudentAttendance,
	getStudentHomework,
	getAllStudents,
	getStudentMaterials,
} = require('../controllers/studentController')

// Get student profile
router.get('/students/:id/profile', auth, getStudentProfile)

// Get student attendance
router.get('/students/:id/attendance', auth, getStudentAttendance)

// Get student homework
router.get('/students/:id/homework', auth, getStudentHomework)

// Get student materials
router.get('/students/:id/materials', auth, getStudentMaterials);

// Get all students
router.get('/students', auth, getAllStudents)

module.exports = router
