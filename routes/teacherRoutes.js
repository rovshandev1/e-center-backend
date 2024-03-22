const express = require('express')
const router = express.Router()
const auth = require('../middlewares/auth')
const {
	getTeacherProfile,
	getTeacherGroups,
	markAttendance,
	updateAttendance,
} = require('../controllers/teacherController')

// Get teacher profile
router.get('/teachers/:id/profile', auth, getTeacherProfile)

// Get teacher groups
router.get('/teachers/:id/groups', auth, getTeacherGroups)

// Mark attendance
router.post('/attendance', auth, markAttendance)

// Mark attendance update
router.put('/attendance', auth, updateAttendance)

module.exports = router
