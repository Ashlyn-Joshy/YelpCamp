const Campground = require("../models/campground");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });
const { cloudinary } = require("../cloudinary");

module.exports.index = async (req, res) => {
  const camp = await Campground.find({});
  res.render("campground", { camp });
};

module.exports.newCampgroundForm = (req, res) => {
  res.render("campground/new");
};
module.exports.newCampground = async (req, res) => {
  //if (!req.body.Campground)  throw new ExpressError("Invalid Campground Data", 400); if all the data is not enter
  const geoData = await geocoder
    .forwardGeocode({
      query: req.body.Campground.location,
      limit: 1,
    })
    .send();
  const camp = new Campground(req.body.Campground);
  camp.geometry = geoData.body.features[0].geometry;
  camp.images = req.files.map((f) => ({ url: f.path, filename: f.filename }));
  camp.author = req.user.id;
  await camp.save();
  console.log(camp);
  req.flash("success", "Successfully made a new campground!");
  res.redirect(`campground/${camp.id}`);
};

module.exports.campgroundDetails = async (req, res) => {
  const camp = await Campground.findById(req.params.id)
    .populate({
      path: "review",
      populate: {
        path: "author",
      },
    })
    .populate("author");
  if (!camp) {
    req.flash("error", "Cannot find that campground!");
    return res.redirect("/campground");
  }
  res.render("campground/show", { camp });
};

module.exports.editCampgroundForm = async (req, res) => {
  const { id } = req.params;
  const camp = await Campground.findById(id);
  if (!camp) {
    req.flash("error", "Cannot find that campground!");
    return res.redirect("/campground");
  }
  res.render("campground/edit", { camp });
};
module.exports.editCampground = async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findByIdAndUpdate(
    id,
    req.body.Campground
  );
  const img = req.files.map((f) => ({
    url: f.path,
    filename: f.filename,
  }));
  campground.images.push(...img);
  //deleting the image from the database and cloudinary
  if (req.body.deleteImages) {
    for (let filename of req.body.deleteImages) {
      await cloudinary.uploader.destroy(filename);
    }
    await campground.updateOne({
      $pull: { images: { filename: { $in: req.body.deleteImages } } },
    });
  }
  await campground.save();
  req.flash("success", "Successfully updated campground!");
  res.redirect(`/campground/${campground.id}`);
};

module.exports.deleteCampground = async (req, res) => {
  await Campground.findByIdAndDelete(req.params.id);
  req.flash("success", "Successfully deleted the campground!");
  res.redirect(`/campground`);
};
