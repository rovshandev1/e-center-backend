const TimeBoard = require('../models/timeBoard')
const User = require('../models/user')
const Attendance = require('../models/attendance')

// Dars jadvalini yaratish
const createTimeBoard = async (req, res) => {
  try {
    const { lessonName, lessonDateTime, groupId } = req.body;
    const teacher = req.user._id;
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    const timeBoard = new TimeBoard({
      lessonName,
      lessonDateTime,
      group: groupId,
      teacher,
    });

    // Barcha guruh a'zolariga dars jadvali qo'shish
    const students = group.students;
    for (const studentId of students) {
      const student = await User.findById(studentId);
      student.timeBoards.push(timeBoard._id);
      await student.save();
    }

    await timeBoard.save();
    res.status(201).json(timeBoard);
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong', error: err.message });
  }
};

// Dars jadvalini yangilash
const updateTimeBoard = async (req, res) => {
  try {
    const timeBoardId = req.params.id;
    const { lessonName, lessonDateTime, groupId } = req.body;
    const teacher = req.user._id;
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    const updatedTimeBoard = await TimeBoard.findByIdAndUpdate(
      timeBoardId,
      { lessonName, lessonDateTime, group: groupId, teacher },
      { new: true }
    );

    if (!updatedTimeBoard) {
      return res.status(404).json({ message: 'Time board not found' });
    }

    // Update students' time boards as well
    const students = group.students;
    for (const studentId of students) {
      const student = await User.findById(studentId);
      if (student.timeBoards.includes(timeBoardId)) {
        const index = student.timeBoards.indexOf(timeBoardId);
        student.timeBoards.splice(index, 1);
      }
      student.timeBoards.push(updatedTimeBoard._id);
      await student.save();
    }

    res.status(200).json(updatedTimeBoard);
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong', error: err.message });
  }
};

// Dars jadvalini o'chirish
const deleteTimeBoard = async (req, res) => {
  try {
    const timeBoardId = req.params.id;
    const deletedTimeBoard = await TimeBoard.findByIdAndDelete(timeBoardId);
    if (!deletedTimeBoard) {
      return res.status(404).json({ message: 'Time board not found' });
    }

    // Remove time board from students
    const students = await User.find({ timeBoards: timeBoardId });
    for (const student of students) {
      const index = student.timeBoards.indexOf(timeBoardId);
      student.timeBoards.splice(index, 1);
      await student.save();
    }

    res.status(200).json({ message: 'Time board deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong', error: err.message });
  }
};

// O'qituvchi uchun navbatdagi darslar jadvali
const getTeacherTimeBoards = async (req, res) => {
  try {
    const teacher = req.user._id;
    const timeBoards = await TimeBoard.find({ teacher })
      .populate('group', 'name')
      .sort({ lessonDateTime: 1 });
    res.status(200).json(timeBoards);
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong', error: err.message });
  }
};

// Talaba uchun navbatdagi darslar jadvali
const getStudentTimeBoards = async (req, res) => {
  try {
    const student = req.user._id;
    const timeBoards = await TimeBoard.find({ students: student })
      .populate('group', 'name')
      .populate('teacher', 'name')
      .sort({ lessonDateTime: 1 });
    res.status(200).json(timeBoards);
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong', error: err.message });
  }
};

module.exports = {
  createTimeBoard,
  updateTimeBoard,
  deleteTimeBoard,
  getTeacherTimeBoards,
  getStudentTimeBoards,
};
