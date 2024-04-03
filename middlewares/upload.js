const multer = require('multer')
const { CloudinaryStorage } = require('multer-storage-cloudinary')
const cloudinary = require('../config/cloudinary')

const storage = new CloudinaryStorage({
	cloudinary: cloudinary,
	params: (req, file) => {
		const fileExtension = file.originalname.split('.').pop();
		let format;
		switch(file.mimetype) {
			case 'image/jpeg':
			case 'image/png':
				format = 'png'; // or 'jpg' depending on the desired format
				break;
			case 'application/pdf':
				format = 'pdf';
				break;
			case 'application/msword':
			case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
				format = 'docx'; // or 'doc' depending on the desired format
				break;
			case 'application/vnd.ms-excel':
			case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
				format = 'xlsx'; // or 'xls' depending on the desired format
				break;
			default:
				format = fileExtension; // Use the file extension as format for unknown types
		}
		return {
			folder: 'uploads',
			format: format
		};
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
