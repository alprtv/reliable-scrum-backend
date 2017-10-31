const mongoose = require('mongoose');
const TaskSchema = require('./task');
const BugSchema = require('./bug');

let boardSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: [3, 'tooShort'],
    required: [true, 'nameRequired']
  },
  description: {
    type: String,
    maxlength: [2000, 'tooLong']
  },
  doneTasks: [TaskSchema],
  undoneTasks: [TaskSchema],
  bugsTimeLine: [BugSchema],
  dateStart: {
    type: Date,
    required: [true, 'dateStartRequired']
  },
  dateFinish: {
    type: Date,
    required: [true, 'dateFinishRequired']
  },
  timeBuffer: {
    type: Date,
    required: [true, 'timeBufferRequired']
  }
});

boardSchema.virtual('created').get( function () {
  return this['created'] = this._id.getTimestamp();
});

module.exports = mongoose.model('Board', boardSchema);

