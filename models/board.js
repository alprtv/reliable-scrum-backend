const mongoose = require('mongoose');
const TaskSchema = require('./task');
const BugSchema = require('./bug');

let boardSchema = new mongoose.Schema({
  idKbTool: {
    type: Number,
    required: [true, '_kanbantoolIsRequired'],
  },
  name: {
    type: String,
    minlength: [3, 'tooShort'],
    required: [true, 'nameIsRequired']
  },
  description: {
    type: String,
    maxlength: [2000, 'tooLong']
  },
  createdAt: {
    type: Date,
    required: [true, 'createdAtIsRequired'],
  },
  dateStart: {
    type: Date,
    required: [true, 'dateStartIsRequired']
  },
  dateFinish: {
    type: Date,
    required: [true, 'dateFinishIsRequired']
  },
  timeBuffer: {
    type: Date,
    required: [true, 'timeBufferIsRequired']
  },
  doneStagesIds: [{
    type: Number,
    required: [true, 'doneStagesIdsIsRequired']
  }],
  undoneStagesIds: [{
    type: Number,
    required: [true, 'undoneStagesIdsIsRequired']
  }],
  doneTasks: [TaskSchema],
  undoneTasks: [TaskSchema],
  bugsTimeLine: [BugSchema]
});

boardSchema.virtual('created').get( function () {
  return this['created'] = this._id.getTimestamp();
});

module.exports = mongoose.model('Board', boardSchema);

