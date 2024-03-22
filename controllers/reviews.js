const Campground = require("../models/campground");
const Review = require("../models/review");

module.exports.addReview = async (req, res) => {
  const campground = await Campground.findById(req.params.id);
  const review = new Review(req.body.Review);
  review.author = req.user._id;
  campground.review.push(review);
  await campground.save();
  await review.save();
  req.flash("success", "Successfully made a new review!");
  res.redirect(`/campground/${campground.id}`);
};

module.exports.deleteReview = async (req, res) => {
  const { id, reviewId } = req.params;
  const camp = await Campground.findByIdAndUpdate(id, {
    $pull: { review: reviewId },
  });
  await Review.findByIdAndDelete(reviewId);
  req.flash("success", "Successfully deleted a review");
  res.redirect(`/campground/${camp.id}`);
};
