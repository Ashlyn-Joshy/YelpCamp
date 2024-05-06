# Yelp Camp
Yelp Camp is an online tool that lets campers assess and compare different campgrounds while also encouraging experience sharing.The platform allows users to create and upload new campground listings that include a title, description, pricing, and photo.  Furthermore, users can alter or delete their own submissions, while also enabling other users to review their contributions. Additionally, users may modify or remove reviews they have left on campgrounds they have created, and may also post new reviews that feature star ratings and descriptive content. These features not only enable users to share their experiences and inspire others to explore new outdoor activities

## Demo
[https://yelpcamp-ftd4.onrender.com/](https://yelpcamp-ftd4.onrender.com/)

## Deployment
To deploy this project run
```
git clone https://github.com/Ashlyn-Joshy/YelpCamp.git
```
Enter into the project folder.

Create .env file inside the folder
```
CLOUDINARY_CLOUD_NAME = "your_cloudinary_name"
CLOUDINARY_KEY = "your_cloudinary_key"
CLOUDINARY_SECRET = "your_cloudinary_secret"
MAPBOX_TOKEN = "#your_mapbox_token"
DB_URL = "#your_db_url"
SECRET = "#your_secret"
```
Install dependencies using
```
npm i
```
Run the project
```
npm start
```

To open the app in your browser go to
```
localhost:8080
```

### Features
- **User Authentication:** User authentication allows users to safely register, log in, and log out.
- **Create Campgrounds:** Users who have verified their identity may add new campgrounds and provide them with a title, a description, price, and a picture.
- **View Campgrounds:**  All of the campgrounds that other users have made are visible to users.
- **Edit and Delete Campgrounds:** Campgrounds created by users are modifiable and deleteable.
- **Add Reviews:** Users can add reviews to the camping area that include a star rating and a description.
- **Delete Reviews:** Users can remove their reviews from campgrounds they've built.

## Built with

**Front-end :** ejs,Bootstrap

**Back-end :** node, express, mongoose

**Database :** MongoDB

**Authenticatio :** Passport

**Validation :** joi

**Media Management :** Cloudinary

**Mapping and Geolocation Services:** Mapbox
