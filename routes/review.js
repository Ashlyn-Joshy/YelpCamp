const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../errorhandling/wrapAsync");
const { isLoggedIn, validateReview, isReviewAuthor } = require("../middleware");
const review = require("../controllers/reviews");

//adding  the new reviews in the campground
//checking the user is signed in to the page using middleware
router.post("/", isLoggedIn, validateReview, wrapAsync(review.addReview));

//deleting a perticular review in the campground
//checking the user is signed in to the page using middleware
router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  wrapAsync(review.deleteReview)
);

module.exports = router;
