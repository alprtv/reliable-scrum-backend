const mongoose = require('mongoose');

let boardSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: [3, "tooShort"],
    required: [true, "nameRequired"]
  },
  description: {
    type: String,
    maxlength: [2000, "tooLong"]
  },
  doneTasks: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task'
  }],
  undoneTasks: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task'
  }],
  dateStart: {
    type: Date,
    required: [true, "dateStartRequired"]
  },
  dateFinish: {
    type: Date,
    required: [true, "dateFinishRequired"]
  },
  timeBuffer: {
    type: Date,
    required: [true, "timeBufferRequired"]
  }
});

boardSchema.virtual('created').get( function () {
  return this["created"] = this._id.getTimestamp();
});

module.exports = mongoose.model('Board', boardSchema);

