const User = require("../models/user");

module.exports.userRegisterForm = (req, res) => {
  res.render("user/register");
};
module.exports.userRegister = async (req, res, next) => {
  try {
    const { email, username, password } = req.body;
    const user = new User({ email, username });
    const registeredUser = await User.register(user, password);
    req.login(registeredUser, (err) => {
      if (err) return next(err);
      req.flash("success", "Welcome to Yelp Camp!");
      res.redirect(`/campground`);
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect(`/register`);
  }
};

module.exports.userLoginForm = (req, res) => {
  res.render("user/login");
};
module.exports.userLogin = (req, res) => {
  req.flash("success", "Welcome back!");
  const redirectUrl = res.locals.returnTo || "/campground";
  res.redirect(redirectUrl);
};

module.exports.userLogout = (req, res) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    req.flash("success", "Goodbye!");
    res.redirect(`/`);
  });
};
