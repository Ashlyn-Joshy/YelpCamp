const { string } = require("joi");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const imageSchema = new Schema({
  url: String,
  filename: String,
});
imageSchema.virtual("thumbnail").get(function () {
  return this.url.replace("/upload", "/upload/w_200");
});

const opts = { toJSON: { virtuals: true } };
//creating the schema
const campGroundSchema = new Schema(
  {
    title: String,
    price: Number,
    images: [imageSchema],
    geometry: {
      type: {
        type: String,
        enum: ["Point"],
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
    description: String,
    location: String,
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    review: [
      {
        type: Schema.Types.ObjectId,
        ref: "Review",
      },
    ],
  },
  opts
);

//this is for the mapbox
campGroundSchema.virtual("properties.popUpMarkUP").get(function () {
  return `<strong><a href='/campground/${this.id}'>${this.title}</a><strong>`;
});

//middleware to delete the campground reviews in the perticular campground
campGroundSchema.post("findOneAndDelete", async function (camp) {
  const Review = require("./review");
  if (camp.review.length) {
    await Review.deleteMany({ _id: { $in: camp.review } });
  }
});
//exporting campground model
module.exports = mongoose.model("Campground", campGroundSchema);
