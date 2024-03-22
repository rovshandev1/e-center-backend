const multer = require('multer')
const { CloudinaryStorage } = require('multer-storage-cloudinary')
const cloudinary = require('../config/cloudinary')

const storage = new CloudinaryStorage({
	cloudinary: cloudinary,
	params: {
		folder: 'uploads',
		format: async (req, file) => 'png',
	},
})

const fileFilter = (req, file, cb) => {
	const allowedTypes = [
		'image/jpeg',
		'image/png',
		'application/pdf',
		'application/msword',
		'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
		'application/vnd.ms-excel',
		'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
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
