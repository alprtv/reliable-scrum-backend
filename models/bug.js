const mongoose = require('mongoose');

const BugSchema = new mongoose.Schema({
  sprintNum: {
    type: Date,
    required: [true, 'createdAtIsRequired'],
  },
  value: {
    type: Number,
    required: [true, 'valueIsRequired']
  }
});

module.exports = BugSchema;

