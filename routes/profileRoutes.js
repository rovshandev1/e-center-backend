const express = require('express')
const router = express.Router()
const auth = require('../middlewares/auth')
const {
	getProfile,
	updateProfile,
} = require('../controllers/profileController')

// Get user profile
router.get('/profile', auth, getProfile)

// Update user profile
router.put('/profile', auth, updateProfile)

module.exports = router
