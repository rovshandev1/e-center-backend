const express = require('express')
const {
	createTimeBoard,
	getTeacherTimeBoards,
	updateTimeBoard,
	deleteTimeBoard,
	getStudentTimeBoards,
} = require('../controllers/timeBoardController')
const auth = require('../middlewares/auth')
const router = express.Router()

// Dars jadvalini yaratish
router.post('/timeboard', auth, createTimeBoard)

// Dars jadvalini olish
router.get('/timeboard/teacher', auth, getTeacherTimeBoards)

router.get('/timeboard/student', auth, getStudentTimeBoards)

// Dars jadvalini yangilash
router.patch('/timeboard/:id', auth, updateTimeBoard)

// Dars jadvalini o'chirish
router.delete('/timeboard/:id', auth, deleteTimeBoard)

module.exports = router
