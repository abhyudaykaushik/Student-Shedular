var mongoose = require("mongoose");

var staffSchema = new mongoose.Schema({
   username: String,
   password: String
});


module.exports = mongoose.model("Staff", staffSchema);
