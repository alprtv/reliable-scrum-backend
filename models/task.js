const mongoose = require('mongoose');

let taskSchema = new mongoose.Schema({
  _kanbantool: {
    type: Number,
    required: [true, "_kanbantool"],
  },
  name: {
    type: String,
    required: [true, "nameRequired"],
    minlength: [3, "tooShort"]
  },
  value: {
    type: Number,
    required: [true, "valueRequired"]
  },
  sprintAdd: {
    type: Number,
    required: [true, "sprintAddRequired"]
  },
  sprintDone: {
    type: Number,
    required: [true, "sprintDoneRequired"]
  },
  states: {
    type: [{
      _kanbantool: Number,
      name: String,
      value: Number,
      sprintAdd: Number,
      sprintDone: Number
    }]
  }
});

taskSchema.virtual('created').get( function () {
  if (this["_created"]) return this["_created"];
  return this["_created"] = this._id.getTimestamp();
});

module.exports = mongoose.model('Task', taskSchema);

