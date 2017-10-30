const mongoose = require('mongoose');

let cardSchema = new mongoose.Schema({
  name : {
    type : String,
    required : [true, "nameRequired"],
    minlength : [3, "tooShort"]
  },
  value : {
    type : Number,
    required : [true, "valueRequired"]
  },
  sprintAdd : {
    type : Number,
    required : [true, "sprintAddRequired"]
  },
  sprintDone : {
    type : Number,
    required : [true, "sprintDoneRequired"]
  }
});

cardSchema.virtual('created').get( function () {
  if (this["_created"]) return this["_created"];
  return this["_created"] = this._id.getTimestamp();
});

module.exports = mongoose.model('Card', cardSchema);

