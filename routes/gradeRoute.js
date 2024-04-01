const express = require('express')
const router = express.Router()
const auth = require('../middlewares/auth')
const {
	createGrade,
	getStudentGrades,
	updateGrade,
	deleteGrade,
	gradeHomework,
} = require('../controllers/gradeController')

router.post('/grades', auth, createGrade)
router.get('/grades/:id', auth, getStudentGrades)
router.put('/grades/:id', auth, updateGrade)
router.delete('/grades/:id', auth, deleteGrade)
router.post('/grades/homework', auth, gradeHomework)

module.exports = router
