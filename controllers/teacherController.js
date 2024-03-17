const Teacher = require('../models/teacher');
const Group = require('../models/group');
const Attendance = require('../models/attendance');

const getTeacherProfile = async (req, res) => {
  try {
    const teacherId = req.params.id;
    const teacher = await Teacher.findById(teacherId)
      .populate('user', 'name email')
      .populate('groups', 'name');
    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }
    res.status(200).json(teacher);
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong' });
  }
};

const getTeacherGroups = async (req, res) => {
  try {
    const teacherId = req.params.id;
    const teacher = await Teacher.findById(teacherId).populate('groups', 'name');
    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }
    res.status(200).json(teacher.groups);
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong' });
  }
};

const markAttendance = async (req, res) => {
  try {
    const { groupId, students } = req.body;
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }
    const attendance = await Promise.all(
      students.map(async (student) => {
        const newAttendance = new Attendance({
          student: student.id,
          group: groupId,
          date: new Date(),
          isPresent: student.isPresent,
        });
        return await newAttendance.save();
      })
    );
    res.status(201).json(attendance);
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong' });
  }
};

module.exports = {
  getTeacherProfile,
  getTeacherGroups,
  markAttendance,
};