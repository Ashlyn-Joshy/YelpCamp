const Campground = require("./models/campground");
const Review = require("./models/review");
const { campgroundSchema, reviewSchema } = require("./schemas");
const ExpressError = require("./errorhandling/expressError");

//checking the user is logedin
module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.returnTo = req.originalUrl;
    req.flash("error", "You must be signed in first!");
    return res.redirect("/login");
  }
  next();
};

//to store and return back to the url
module.exports.storeReturnTo = (req, res, next) => {
  if (req.session.returnTo) {
    res.locals.returnTo = req.session.returnTo;
  }
  next();
};

//middleware function to handle the error in the server side in campground
module.exports.validateCampground = (req, res, next) => {
  const { error } = campgroundSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(" ");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

//checking if campground owner is the same person to edit or to delete
module.exports.isAuthor = async (req, res, next) => {
  const { id } = req.params;
  const camp = await Campground.findById(id);
  if (!camp.author.equals(req.user._id)) {
    req.flash("error", "You have no permission to do that");
    return res.redirect(`/campground/${id}`);
  }
  next();
};

//checking if review owner is the same person to to delete
module.exports.isReviewAuthor = async (req, res, next) => {
  const { id, reviewId } = req.params;
  const review = await Review.findById(reviewId);
  if (!review.author.equals(req.user._id)) {
    req.flash("error", "You have no permission to do that");
    return res.redirect(`/campground/${id}`);
  }
  next();
};

//middleware function to handle the error in the server side in review
module.exports.validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(" ");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};
