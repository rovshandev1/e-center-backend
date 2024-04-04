const express = require('express')
const router = express.Router()
const auth = require('../middlewares/auth')
const fileUpload = require('../middlewares/fileUpload')
const {
	createMaterial,
	getAllMaterials,
	getMaterialById,
	updateMaterial,
	deleteMaterial,
	uploadMaterialFile,
} = require('../controllers/materialController')

// Create a new material
router.post('/materials', auth, createMaterial)

// Get all materials
router.get('/materials', auth, getAllMaterials)

// Get a material by ID
router.get('/materials/:id', auth, getMaterialById)

// Update a material
router.put('/materials/:id', auth, updateMaterial)

// Delete a material
router.delete('/materials/:id', auth, deleteMaterial)

// Upload a material file
router.post(
	'/materials/:id/upload',
	auth,
	fileUpload.single('file'),
	uploadMaterialFile
)

module.exports = router
