const mongoose = require('mongoose');

const BugSchema = new mongoose.Schema({
  createdAt: {
    type: Date,
    required: [true, 'createdAtRequired'],
  },
  value: {
    type: Number,
    required: [true, 'valueRequired']
  }
});

module.exports = BugSchema;

