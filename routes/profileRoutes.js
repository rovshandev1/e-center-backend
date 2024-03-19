const express = require('express')
const router = express.Router()
const auth = require('../middlewares/auth')
const upload = require('../middlewares/upload')
const {
	getProfile,
	updateProfile,
	updateProfileImage,
} = require('../controllers/profileController')

// Get user profile
router.get('/profile', auth, getProfile)

// Update user profile
router.put('/profile', auth, updateProfile)

// Update user profile image
router.put(
	'/profile/image',
	auth,
	upload.single('profileImage'),
	updateProfileImage
)

module.exports = router
