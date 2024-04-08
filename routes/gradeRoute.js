const express = require('express')
const router = express.Router()
const auth = require('../middlewares/auth')
const {
	createGrade,
	getGradeById,
	updateGrade,
	deleteGrade,
	getAllGrades,
} = require('../controllers/gradeController')

router.post('/grades', auth, createGrade)
router.get('/grades/:id', auth, getGradeById)
router.get('/grades', auth, getAllGrades)
router.put('/grades/:id', auth, updateGrade)
router.delete('/grades/:id', auth, deleteGrade)

module.exports = router
