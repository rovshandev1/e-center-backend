const express = require('express')
const router = express.Router()
const auth = require('../middlewares/auth')
const {
	createGroup,
	getAllGroups,
	getGroupById,
	updateGroup,
	deleteGroup,
	addStudentsToGroup,
	removeStudentFromGroup,
} = require('../controllers/groupController')

// Create a new group
router.post('/groups', auth, createGroup)

// Get all groups
router.get('/groups', auth, getAllGroups)

// Get a group by ID
router.get('/groups/:id', auth, getGroupById)

// Update a group
router.put('/groups/:id', auth, updateGroup)

// Delete a group
router.delete('/groups/:id', auth, deleteGroup)

// Add a student to a group
router.post('/groups/:groupId/students', auth, addStudentsToGroup);

// Remove a student from a group
router.delete(
	'/groups/:groupId/students/:studentId',
	auth,
	removeStudentFromGroup
)

module.exports = router
