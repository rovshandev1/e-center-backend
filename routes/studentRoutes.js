const express = require('express')
const router = express.Router()
const auth = require('../middlewares/auth')
const {
	getStudentProfile,
	getStudentAttendance,
	getStudentHomework,
} = require('../controllers/studentController')

// Get student profile
router.get('/students/:id/profile', auth, getStudentProfile)

// Get student attendance
router.get('/students/:id/attendance', auth, getStudentAttendance)

// Get student homework
router.get('/students/:id/homework', auth, getStudentHomework)

module.exports = router
