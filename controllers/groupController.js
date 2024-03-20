const Group = require('../models/group');
const Student = require('../models/student');
const Teacher = require('../models/teacher');

const createGroup = async (req, res) => {
  try {
    const { name, description } = req.body;
    const teacherId = req.user.userId;
    const teacher = await Teacher.findOne({ user: req.user.userId });
    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }
    const group = new Group({ name, description, teacher: teacherId });
    await group.save();
    teacher.groups.push(group._id);
    await teacher.save();
    res.status(201).json(group);
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong' });
  }
};

const getAllGroups = async (req, res) => {
  try {
    const groups = await Group.find().populate('teacher', 'name').populate('students', 'name');
    res.status(200).json(groups);
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong' });
  }
};

const getGroupById = async (req, res) => {
  try {
    const groupId = req.params.id;
    const group = await Group.findById(groupId)
      .populate('teacher', 'name')
      .populate('students', 'name');
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }
    res.status(200).json(group);
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong' });
  }
};

const updateGroup = async (req, res) => {
  try {
    const groupId = req.params.id;
    const { name, description } = req.body;
    const group = await Group.findByIdAndUpdate(
      groupId,
      { name, description },
      { new: true, runValidators: true }
    );
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }
    res.status(200).json(group);
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong' });
  }
};

const deleteGroup = async (req, res) => {
  try {
    const groupId = req.params.id;
    const group = await Group.findByIdAndDelete(groupId);
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }
    await Teacher.updateMany(
      { groups: groupId },
      { $pull: { groups: groupId } }
    );
    await Student.updateMany(
      { groups: groupId },
      { $pull: { groups: groupId } }
    );
    res.status(200).json({ message: 'Group deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong' });
  }
};

const addStudentToGroup = async (req, res) => {
  try {
    const groupId = req.params.groupId;
    const studentId = req.params.studentId;
    const group = await Group.findById(groupId);
    const student = await Student.findById(studentId);
    if (!group || !student) {
      return res.status(404).json({ message: 'Group or student not found' });
    }
    group.students.push(studentId);
    student.groups.push(groupId);
    await group.save();
    await student.save();
    res.status(200).json({ message: 'Student added to group successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong' });
  }
};

const removeStudentFromGroup = async (req, res) => {
  try {
    const groupId = req.params.groupId;
    const studentId = req.params.studentId;
    const group = await Group.findById(groupId);
    const student = await Student.findById(studentId);
    if (!group || !student) {
      return res.status(404).json({ message: 'Group or student not found' });
    }
    group.students.pull(studentId);
    student.groups.pull(groupId);
    await group.save();
    await student.save();
    res.status(200).json({ message: 'Student removed from group successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong' });
  }
};

module.exports = {
  createGroup,
  getAllGroups,
  getGroupById,
  updateGroup,
  deleteGroup,
  addStudentToGroup,
  removeStudentFromGroup,
};