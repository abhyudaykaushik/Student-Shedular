var mongoose = require("mongoose");

var admindbSchema = new mongoose.Schema({
    status: String,
    comment: String
});

module.exports = mongoose.model("admindb", admindbSchema);