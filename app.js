var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose");
    Campground   = require("./models/campground"),
    seedDB      = require("./seeds"),
    Comment     = require("./models/comment");

mongoose.connect("mongodb://localhost/yelp_camp");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
seedDB();

//setting homepage
app.get("/", function(req, res){
  res.render("campgrounds/landing");
});

app.get("/index", function(req, res) {
  res.redirect("/campgrounds/index");
});

//INDEX ROUTE - campgrounds page
app.get("/campgrounds/index", function(req, res) {
  //get all campgrounds from db
  Campground.find({}, function(err, allCampgrounds){
    if(err) {
      console.log(err)
    } else {
      res.render("campgrounds/index", {campgrounds: allCampgrounds});
    }
  })
});

//NEW ROUTE - shows form to create new campground
app.get("/index/new", function(req, res){
  res.render("campgrounds/new");
});

//CREATE ROUTE - adding new campground to campground database
app.post("/index", function(req, res){
  let name = req.body.name;
  let image = req.body.image;
  let desc = req.body.description;
  let newCampground = {name: name, image: image, description: desc}
  //create new campground and save to database
  Campground.create(newCampground), function(err, newlyCreated) {
    if(err) {
      console.log(err);
    } else {
      res.redirect("/index");
    }
  }
  res.redirect("/index");
});

//SHOW ROUTE - shows more info about selected campground
app.get("/index/:id", function(req, res) {
  //find campground with that id
  Campground.findById(req.params.id).populate("comment").exec(function(err, foundCampground){
    console.log(foundCampground);
    if(err) {
      console.log(err);
    } else {
      //render show template with that campground
      res.render("campgrounds/show", {campground: foundCampground})
    }
  });
});

//============================
//======COMMENTS ROUTES=======
//============================
app.get("/index/:id/comments/new", function(req, res){
  res.render("comments/new");
})



//starting server
app.listen(3000, function() {
  console.log("Yelpcamp server has started.");
})
