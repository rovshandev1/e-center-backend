const express = require('express')
const router = express.Router()
const auth = require('../middlewares/auth')
const upload = require('../middlewares/upload')
const {
	getProfile,
	updateProfile,
} = require('../controllers/profileController')

// Get user profile
router.get('/profile', auth, getProfile)

// Update user profile
router.put('/profile', auth, upload.single('profileImage'), updateProfile)

module.exports = router
