const multer = require('multer')
const path = require('path');
const fs = require('fs');

// Faylni saqlaydigan jild
const uploadDir = path.join(__dirname, '..', 'uploads')

// Multer konfiguratsiyasi
const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, uploadDir) // Fayl saqlanadigan jild
	},
	filename: (req, file, cb) => {
		const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
		const fileExtension = path.extname(file.originalname)
		cb(null, file.fieldname + '-' + uniqueSuffix + fileExtension) // Fayl nomi
	},
})

// Ruxsat etilgan fayl turlari
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
	if (allowedTypes.includes(file.mimetype)) {
		cb(null, true) // Ruxsat etilgan fayl turi
	} else {
		cb(new Error('File type not allowed'), false) // Fayl turi ruxsat etilmagan
	}
}

// Multer sozlamalari
const fileUpload = multer({
	storage: storage,
	fileFilter: fileFilter,
})

module.exports = fileUpload
