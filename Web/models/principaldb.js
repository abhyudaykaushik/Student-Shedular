var mongoose = require("mongoose");

var principaldbSchema = new mongoose.Schema({
    status: String,
    comment: String
});

module.exports = mongoose.model("principaldb", principaldbSchema);