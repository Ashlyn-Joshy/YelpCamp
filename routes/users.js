const express = require("express");
const router = express.Router();
const wrapAsync = require("../errorhandling/wrapAsync");
const passport = require("passport");
const { storeReturnTo } = require("../middleware");
const user = require("../controllers/users");

router
  .route("/register")
  .get(user.userRegisterForm)
  .post(wrapAsync(user.userRegister));

router
  .route("/login")
  .get(user.userLoginForm)
  .post(
    // use the storeReturnTo middleware to save the returnTo value from session to res.locals
    storeReturnTo,
    // passport.authenticate logs the user in and clears req.session
    passport.authenticate("local", {
      failureFlash: true,
      failureRedirect: "/login",
    }),
    user.userLogin
  );

router.get("/logout", user.userLogout);

module.exports = router;
