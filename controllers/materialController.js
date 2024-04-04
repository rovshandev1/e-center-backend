const Material = require('../models/material')
const Group = require('../models/group')
const path = require('path');
const fs = require('fs');
const uploadDir = path.join(__dirname, '..', 'uploads')

const createMaterial = async (req, res) => {
	try {
		const { title, description } = req.body
		const groupId = req.body.group
		const group = await Group.findById(groupId)
		if (!group) {
			return res.status(404).json({ message: 'Group not found' })
		}
		const material = new Material({ title, description, group: groupId })
		await material.save()
		res.status(201).json(material)
	} catch (err) {
		res.status(500).json({ message: 'Something went wrong' })
	}
}

const getAllMaterials = async (req, res) => {
	try {
		const materials = await Material.find().populate('group', 'name')
		res.status(200).json(materials)
	} catch (err) {
		res.status(500).json({ message: 'Something went wrong' })
	}
}

const getMaterialById = async (req, res) => {
	try {
		const materialId = req.params.id
		const material = await Material.findById(materialId).populate(
			'group',
			'name'
		)
		if (!material) {
			return res.status(404).json({ message: 'Material not found' })
		}
		res.status(200).json(material)
	} catch (err) {
		res.status(500).json({ message: 'Something went wrong' })
	}
}

const updateMaterial = async (req, res) => {
	try {
		const materialId = req.params.id
		const { title, description } = req.body
		const groupId = req.body.group
		const group = await Group.findById(groupId)
		if (!group) {
			return res.status(404).json({ message: 'Group not found' })
		}
		const material = await Material.findByIdAndUpdate(
			materialId,
			{ title, description, group: groupId },
			{ new: true, runValidators: true }
		)
		if (!material) {
			return res.status(404).json({ message: 'Material not found' })
		}
		res.status(200).json(material)
	} catch (err) {
		res.status(500).json({ message: 'Something went wrong' })
	}
}

const deleteMaterial = async (req, res) => {
	try {
		const materialId = req.params.id
		const material = await Material.findByIdAndDelete(materialId)
		if (!material) {
			return res.status(404).json({ message: 'Material not found' })
		}
		if (material.file) {
			const publicId = material.file.split('/').pop().split('.')[0]
			await cloudinary.uploader.destroy(publicId)
		}
		res.status(200).json({ message: 'Material deleted successfully' })
	} catch (err) {
		res.status(500).json({ message: 'Something went wrong' })
	}
}

const uploadMaterialFile = async (req, res) => {
  try {
    const materialId = req.params.id;
    const material = await Material.findById(materialId);

    if (!material) {
      return res.status(404).json({ message: 'Material not found' });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const fileExtension = path.extname(req.file.originalname);
    const fileName = `${materialId}${fileExtension}`;
    const filePath = path.join(uploadDir, fileName);

    // Faylni serverga yuklash
    fs.copyFileSync(req.file.path, filePath);

    // Material ma'lumotlarini yangilash
    material.file = fileName;
   material.fileType = req.file.mimetype;
    await material.save();

    res.status(200).json(material);
		console.log(material);
  } catch (err) {
		console.log(err);
    res.status(500).json({ message: 'Something went wrong', err });
  }
};

module.exports = {
	createMaterial,
	getAllMaterials,
	getMaterialById,
	updateMaterial,
	deleteMaterial,
	uploadMaterialFile,
}
