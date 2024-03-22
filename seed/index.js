const mongoose = require("mongoose");
const city = require("./city");
const { places, descriptors, user, img } = require("./seedHelpers");
const Campground = require("../models/campground");

const dburl = process.env.DB_URL || "mongodb://localhost:27017/yelpCamp";
mongoose.connect(dburl);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

const selectingElement = (array) =>
  array[Math.floor(Math.random() * array.length)];

//creating a new seed data function
const seedDB = async () => {
  //this will delete all the database in the db
  await Campground.deleteMany({});
  //here we are creating new seed database for 300 city
  for (let i = 0; i < 300; i++) {
    //selecting random city from the city array
    const randomCity = i; //Math.floor(Math.random() * 400);
    const randomPrice = Math.floor(Math.random() * 3000) + 1000;
    const camp = new Campground({
      author: `${selectingElement(user)}`,
      title: `${selectingElement(descriptors)} ${selectingElement(places)}`,
      location: `${city[randomCity].city} , ${city[randomCity].admin_name} , ${city[randomCity].country}`,
      price: randomPrice,
      geometry: {
        type: "Point",
        coordinates: [city[randomCity].lng, city[randomCity].lat],
      },
      images: selectingElement(img),
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Impedit natus, perferendis sunt nesciunt aliquid deserunt laborum ratione, magnam fugiat excepturi repudiandae officia minima eaque officiis ullam soluta iste, sint quisquam.",
    });
    await camp.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});
