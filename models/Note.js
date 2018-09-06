var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var NoteSchema = new Schema({
  body:{
    type: String,
    required: true,
    unique: true
  },
  date: {
        type: Date,
        default: Date.now
  }
  
});

var Note = mongoose.model("Note", NoteSchema);
module.exports = Note;