if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const ejs = require("ejs");
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const flash = require("connect-flash");
const ExpressError = require("./errorhandling/expressError");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const MongoDBStore = require("connect-mongo")(session);

const campgroundRoutes = require("./routes/campground");
const reviewRoutes = require("./routes/review");
const usersRoutes = require("./routes/users");

//mongoose connection
const dburl = process.env.DB_URL || "mongodb://localhost:27017/yelpCamp";
mongoose.connect(dburl);

mongoose.connect(dburl, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

const app = express();

app.engine("ejs", ejsMate);

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.static(path.join(__dirname, "public")));
app.use(mongoSanitize());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

const secret = process.env.SECRET || "thisisasecret";

const store = new MongoDBStore({
  url: dburl,
  secret,
  touchAfter: 24 * 60 * 60,
});

store.on("error", function (e) {
  console.log("section store error", e);
});

const sessionConfig = {
  store,
  name: "session",
  secret,
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    // secure: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};

app.use(session(sessionConfig));
app.use(flash());
//using helmet
app.use(helmet());

const scriptSrcUrls = [
  "https://api.tiles.mapbox.com/",
  "https://api.mapbox.com/",
  // "https://kit.fontawesome.com/",
  "https://cdn.jsdelivr.net",
];
const styleSrcUrls = [
  // "https://kit-free.fontawesome.com/",
  "https://api.mapbox.com/",
  "https://api.tiles.mapbox.com/",
  "https://fonts.googleapis.com",
  // "https://use.fontawesome.com/",
  "https://cdn.jsdelivr.net",
  "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/",
];
const connectSrcUrls = [
  "https://api.mapbox.com/",
  "https://a.tiles.mapbox.com/",
  "https://b.tiles.mapbox.com/",
  "https://events.mapbox.com/",
];
const fontSrcUrls = [
  "https://fonts.googleapis.com",
  "https://fonts.gstatic.com",
  "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/",
];
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: [],
      connectSrc: ["'self'", ...connectSrcUrls],
      scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
      styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
      workerSrc: ["'self'", "blob:"],
      objectSrc: [],
      imgSrc: [
        "'self'",
        "blob:",
        "data:",
        "https://res.cloudinary.com/dhkwyh24o/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT!
        "https://images.unsplash.com/",
        "https://img.freepik.com/free-vector/",
      ],
      fontSrc: ["'self'", ...fontSrcUrls],
    },
  })
);

// For Authentication we use passport
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//this is the middleware to display the flash message
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

//connecting to the home page
app.get("/", (req, res) => {
  res.render("home");
});

//this are the routers
app.use("/campground", campgroundRoutes);
app.use("/campground/:id/review", reviewRoutes);
app.use("/", usersRoutes);

//if the page is not defined
app.all("*", (req, res, next) => {
  next(new ExpressError("Page Not Found!", 404));
});

//basic error handler
app.use((err, req, res, next) => {
  const { status = 500 } = err;
  //this will work if there is no error message
  if (!err.message) err.message = "Oh no somthing went wrong";
  res.status(status).render("errorpage", { err });
});

const port = process.env.PORT || 8080;
//working on the port
app.listen(port, () => {
  console.log(`serving on port ${port}`);
});
