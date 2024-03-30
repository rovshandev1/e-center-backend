// submissionController.js

const Submission = require('../models/submission')
const Homework = require('../models/homework')
const User = require('../models/user')

const submitHomework = async (req, res) => {
	try {
		const { homeworkId, title, description } = req.body
		const studentId = req.user.userId

		const homework = await Homework.findById(homeworkId)
		const student = await User.findById(studentId)

		if (!homework || !student) {
			return res.status(404).json({ message: 'Homework or student not found' })
		}

		const submission = new Submission({
			homework: homeworkId,
			student: studentId,
			title,
			description,
		})

		await submission.save()
		res.status(201).json(submission)
	} catch (err) {
		res.status(500).json({ message: 'Something went wrong', err })
	}
}

const getHomeworkSubmissions = async (req, res) => {
	try {
		const homeworkId = req.params.homeworkId
		const submissions = await Submission.find({ homework: homeworkId })
			.populate('student', 'name')
			.populate('homework', 'title')

		res.status(200).json(submissions)
	} catch (err) {
		res.status(500).json({ message: 'Something went wrong', err })
	}
}

const updateSubmission = async (req, res) => {
	try {
		const submissionId = req.params.id
		const { title, description } = req.body

		const submission = await Submission.findByIdAndUpdate(
			submissionId,
			{ title, description },
			{ new: true, runValidators: true }
		)

		if (!submission) {
			return res.status(404).json({ message: 'Submission not found' })
		}

		res.status(200).json(submission)
	} catch (err) {
		res.status(500).json({ message: 'Something went wrong', err })
	}
}

const uploadSubmissionFile = async (req, res) => {
  try {
    const submissionId = req.params.id;
    const submission = await Submission.findById(submissionId);

    if (!submission) {
      return res.status(404).json({ message: 'Submission not found' });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const fileUrl = req.file.path;

    submission.file = fileUrl;

    await submission.save();

    res.status(200).json({ message: 'File uploaded successfully', submission });
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong', err });
  }
};

module.exports = { submitHomework, getHomeworkSubmissions, updateSubmission, uploadSubmissionFile }
