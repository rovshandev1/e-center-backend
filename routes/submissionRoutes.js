// submissionRoutes.js

const express = require('express')
const router = express.Router()
const auth = require('../middlewares/auth')
const upload = require('../middlewares/upload')
const {
	submitHomework,
	getHomeworkSubmissions,
	updateSubmission,
	uploadSubmissionFile,
} = require('../controllers/submissionController')

router.post('/submissions', auth, upload.single('file'), submitHomework)

router.get('/submissions/:homeworkId', auth, getHomeworkSubmissions)

router.put('/submissions/:id', auth, updateSubmission)

router.post('/submissions/:id/upload', auth, upload.single('file'), uploadSubmissionFile)

module.exports = router
