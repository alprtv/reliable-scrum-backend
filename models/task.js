const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  idKbTool: {
    type: Number,
    required: [true, '_kanbantoolIsRequired'],
  },
  swimlaneId: {
    type: Number,
    required: [true, 'swimlaneIdIsRequired'],
  },
  name: {
    type: String,
    required: [true, 'nameIsRequired'],
  },
  description: {
    type: String,
    default: 'Description is empty'
  },
  createdAt: {
    type: Date,
    required: [true, 'createdAtIsRequired'],
  },
  updatedAt: {
    type: Date,
    required: [true, 'updatedAtIsRequired'],
  },
  value: {
    type: Number,
    required: [true, 'valueIsRequired']
  },
  sprintAdd: {
    type: Number,
    required: [true, 'sprintAddIsRequired']
  },
  sprintDone: {
    type: Number,
    required: [true, 'sprintDoneIsRequired']
  }
});

module.exports = TaskSchema;

