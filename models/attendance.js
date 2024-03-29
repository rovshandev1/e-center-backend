const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  timeBoard: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TimeBoard',
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true,
  },
  group: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Group',
    required: true,
  },
  date: {
    type: Date,
  },
  isPresent: {
    type: Boolean,
    required: true,
  },
});

const Attendance = mongoose.model('Attendance', attendanceSchema);

module.exports = Attendance;