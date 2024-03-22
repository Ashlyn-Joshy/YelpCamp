const express = require("express");
const router = express.Router();
const wrapAsync = require("../errorhandling/wrapAsync");
const { isLoggedIn, validateCampground, isAuthor } = require("../middleware");
const campground = require("../controllers/campground");
const multer = require("multer");
const { storage } = require("../cloudinary");
const upload = multer({ storage });
router
  .route("/")
  .get(wrapAsync(campground.index))
  .post(
    isLoggedIn,
    upload.array("image"),
    validateCampground,
    wrapAsync(campground.newCampground)
  );

router.get("/new", isLoggedIn, campground.newCampgroundForm);

router
  .route("/:id")
  .get(wrapAsync(campground.campgroundDetails))
  .put(
    isLoggedIn,
    isAuthor,
    upload.array("image"),
    validateCampground,
    wrapAsync(campground.editCampground)
  )
  .delete(isLoggedIn, isAuthor, wrapAsync(campground.deleteCampground));

router.get(
  "/:id/edit",
  isLoggedIn,
  isAuthor,
  wrapAsync(campground.editCampgroundForm)
);

module.exports = router;
