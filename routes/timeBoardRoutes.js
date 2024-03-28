const express = require('express')
const {
	createTimeBoard,
	updateTimeBoard,
	deleteTimeBoard,
	getTimeBoard,
} = require('../controllers/timeBoardController')
const auth = require('../middlewares/auth')
const router = express.Router()

// Dars jadvalini yaratish
router.post('/timeboard', auth, createTimeBoard)

// Dars jadvalini yangilash
router.put('/timeboard/:id', auth, updateTimeBoard)

// Dars jadvalini olish
router.get('/timeboard/:id', auth, getTimeBoard)

// Dars jadvalini o'chirish
router.delete('/timeboard/:id', auth, deleteTimeBoard)

module.exports = router
