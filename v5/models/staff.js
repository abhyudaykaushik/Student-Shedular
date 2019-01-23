var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var staffSchema = new mongoose.Schema({
   username: String,
   password: String,
   position: String,
   
   // Object reference ASSOCIATION
   // associtaing notices to a specific staff
   notice: [
         {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Notice"       // comments model
         }
      ]
});

staffSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("Staff", staffSchema);
