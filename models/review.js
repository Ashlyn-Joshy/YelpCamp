const { string, number } = require("joi");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//creating reviewschema
const reviewSchema = new Schema({
  body: String,
  rating: Number,
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

//exporting the review model
module.exports = mongoose.model("Review", reviewSchema);
