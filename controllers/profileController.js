const User = require('../models/user')
const Student = require('../models/student')
const Teacher = require('../models/teacher')

const getProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await User.findById(userId)
      .select('-password')
      .populate('profileImage');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    let profile;
    if (user.role === 'student') {
      profile = await Student.findOne({ user: userId })
        .populate('groups')
        .populate('profileImage');
    } else {
      profile = await Teacher.findOne({ user: userId })
        .populate('groups')
        .populate('profileImage');
    }
    res.status(200).json({ user, profile });
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong' });
  }
};

const updateProfile = async (req, res) => {
	try {
		const userId = req.user.userId
		const { name, dateOfBirth, position } = req.body
		const user = await User.findByIdAndUpdate(
			userId,
			{ name },
			{ new: true, runValidators: true }
		).select('-password')
		if (!user) {
			return res.status(404).json({ message: 'User not found' })
		}
		let profile
		if (user.role === 'student') {
			profile = await Student.findOneAndUpdate(
				{ user: userId },
				{ dateOfBirth },
				{ new: true, runValidators: true }
			)
		} else {
			profile = await Teacher.findOneAndUpdate(
				{ user: userId },
				{ dateOfBirth, position },
				{ new: true, runValidators: true }
			)
		}
		res.status(200).json({ user, profile })
	} catch (err) {
		res.status(500).json({ message: 'Something went wrong' })
	}
}

const updateProfileImage = async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profileImage: req.file },
      { new: true, runValidators: true }
    );

    let profile;
    if (user.role === 'student') {
      profile = await Student.findOneAndUpdate(
        { user: userId },
        { profileImage: req.file },
        { new: true, runValidators: true }
      );
    } else {
      profile = await Teacher.findOneAndUpdate(
        { user: userId },
        { profileImage: req.file },
        { new: true, runValidators: true }
      );
    }

    res.status(200).json({ message: 'File uploaded successfully', profile, user: updatedUser });
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong' });
  }
};

module.exports = { getProfile, updateProfile, updateProfileImage }
