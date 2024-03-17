const multer = require('multer')
const path = require('path')

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, 'uploads/')
	},
	filename: function (req, file, cb) {
		cb(null, `${Date.now()}-${file.originalname}`)
	},
})

const fileFilter = (req, file, cb) => {
	const allowedTypes = [
		'image/jpeg',
		'image/png',
		'application/pdf',
		'application/msword',
		'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
	]
	if (!allowedTypes.includes(file.mimetype)) {
		return cb(new Error('File type not allowed'), false)
	}
	cb(null, true)
}

const upload = multer({
	storage: storage,
	fileFilter: fileFilter,
})

module.exports = upload
