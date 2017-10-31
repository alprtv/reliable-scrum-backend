const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  _kanbantool: {
    type: Number,
    required: [true, '_kanbantool'],
  },
  name: {
    type: String,
    required: [true, 'nameRequired'],
  },
  description: {
    type: String,
  },
  createdAt: {
    type: Date,
    required: [true, 'createdAtRequired'],
  },
  updatedAt: {
    type: Date,
    required: [true, 'updatedAtRequired'],
  },
  value: {
    type: Number,
    required: [true, 'valueRequired']
  },
  sprintAdd: {
    type: Number,
    required: [true, 'sprintAddRequired']
  },
  sprintDone: {
    type: Number,
    required: [true, 'sprintDoneRequired']
  }
});

module.exports = TaskSchema;

