const express = require('express')
const router = express.Router()
const auth = require('../middlewares/auth')
const {
	createHomework,
	getAllHomework,
	getHomeworkById,
	updateHomework,
	deleteHomework,
} = require('../controllers/homeworkController')

// Create a new homework
router.post('/homework', auth, createHomework)

// Get all homework
router.get('/homework', auth, getAllHomework)

// Get a homework by ID
router.get('/homework/:id', auth, getHomeworkById)

// Update a homework
router.put('/homework/:id', auth, updateHomework)

// Delete a homework
router.delete('/homework/:id', auth, deleteHomework)

module.exports = router
