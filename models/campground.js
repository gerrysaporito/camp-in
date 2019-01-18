var mongoose = require("mongoose");

//schema setup
var campgroundSchema = new mongoose.Schema({
  name: String,
  image: String,
  description: String,
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "comment"
    }
  ]
});

//setting campground schema to object variable
var Campground = mongoose.model("Campground", campgroundSchema);
module.exports = Campground;
