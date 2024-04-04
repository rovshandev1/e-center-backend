const multer = require('multer')
const { CloudinaryStorage } = require('multer-storage-cloudinary')
const cloudinary = require('../config/cloudinary')

const storage = new CloudinaryStorage({
	cloudinary: cloudinary,
	params: {
		folder: 'uploads',
		format: async (req, file) => {
      // Faylning kengaytmasini aniqlash
      const fileExtension = file.originalname.split('.').pop().toLowerCase();
      return fileExtension;
		},
	},
})

const fileFilter = (req, file, cb) => {
  // Faylning kengaytmasini tekshirish
  const fileExtension = file.originalname.split('.').pop().toLowerCase();
  const allowedExtensions = [
    'jpg',
    'jpeg',
    'png',
    'gif',
    'pdf', // pdf qo'shildi
    'doc',
    'docx',
    'xls',
    'xlsx',
    'ppt',
    'pptx',
    'txt',
    'zip',
    'rar',
];


  if (allowedExtensions.includes(fileExtension)) {
    cb(null, true); // Fayl qabul qilinadi
  } else {
    cb(new Error('File type not allowed'), false); // Fayl rad etiladi
  }
};

const upload = multer({
	storage: storage,
	fileFilter: fileFilter,
})

module.exports = upload
