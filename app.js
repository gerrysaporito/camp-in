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
app.get("/campgrounds", function(req, res) {
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
  //grabbing
  let name = req.body.name,
      image = req.body.image,
      desc = req.body.description,
      newCampground = {name: name, image: image, description: desc}
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
  //find campground by id
  Campground.findById(req.params.id, function(err, campground){
    if(err){
      console.log(err)
    } else {
      res.render("comments/new", {campground: campground});
    }
  });
});

//Posting new comment to respective campground page
app.post("/index/:id/comments", function(req, res) {
  //lookup campground using ID
  Campground.findById(req.params.id, function(err, campground){
    if(err){
      console.log(err);
      res.redirect("/campgrounds");
    } else {
      //create a new comment
      Comment.create(req.body.comment, function(err, comment){
        if(err){
          console.log(err);
        } else {
          //connect new comment to campground
          campground.comments.push(comment);
          campground.save;
          //redirect to campground show page
          res.redirect("/index/" + campground._id);
        }
      });
    }
  });
});


//starting server
app.listen(3000, function() {
  console.log("Yelpcamp server has started.");
})
