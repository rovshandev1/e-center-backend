const mongoose = require('mongoose');

const teacherSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  dateOfBirth: {
    type: Date,
    required: true,
  },
  position: {
    type: String,
    required: true,
  },
  groups: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Group',
    },
  ],
});

const Teacher = mongoose.model('Teacher', teacherSchema);

module.exports = Teacher;