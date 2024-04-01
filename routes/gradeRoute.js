const express = require('express')
const router = express.Router()
const auth = require('../middlewares/auth')
const {
	createGrade,
	getStudentGrades,
	updateGrade,
	deleteGrade,
} = require('../controllers/gradeController')

router.post('/grades', auth, createGrade)
router.get('/grades/:id', auth, getStudentGrades)
router.put('/grades/:id', auth, updateGrade)
router.delete('/grades/:id', auth, deleteGrade)

module.exports = router
