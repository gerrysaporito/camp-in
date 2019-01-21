//=======================VARIABLE DECLARATIONS=======================//
    var express     = require("express");
        router      = express.Router(),
        middleware  = require("../middleware"),
        Campground  = require("../models/campground");

//=====================MAIN CAMPGROUND ROUTES=======================//
    //Campground Routes
    router.get("/index", function(req, res) {
      res.redirect("/campgrounds/index");
    });
    router.get("/campgrounds", function(req, res) {
      res.redirect("/campgrounds/index");
    });
    router.get("/campgrounds/index", function(req, res) {
      //get all campgrounds from db
      Campground.find({}, function(err, allCampgrounds){
        if(err) {
          console.log(err);
        } else {
          res.render("campgrounds/index", {campgrounds: allCampgrounds});
        }
      })
    });

//=========================SHOWPAGE ROUTES============================//
    //adding new campground to campground database
    router.post("/index", middleware.isLoggedIn, function(req, res){
      //grabbing  variables
      let name = req.body.name,
          image = req.body.image,
          desc = req.body.description,
          author = {
            id: req.user._id,
            username: req.user.username
          }
          newCampground = {name: name, image: image, description: desc, author: author},

      //create new campground and save to database
      Campground.create(newCampground, function(err, newlyCreated) {
        if(err) {
          console.log(err);
        } else {
          res.redirect("/index");
        }
      });
    });

//======================NEW CAMPGROUND ROUTES========================//
    //shows form to create new campground
    router.get("/index/new", middleware.isLoggedIn, function(req, res){
      res.render("campgrounds/new");
    });
    //shows more info about selected campground
    router.get("/index/:id", function(req, res) {
      var commArr = []
      //find campground with that id
      Campground.findById(req.params.id).populate("comment").exec(function(err, foundCampground){
        if(err) {
          console.log(err);
        } else {
          //render show template with that campground
          res.render("campgrounds/show", {campground: foundCampground, comments: commArr});
        }
      });
    });

//===================EDIT/UPDATE CAMPGROUND ROUTES=====================//
    //EDIT
    router.get("/index/:id/edit", middleware.checkCampgroundOwnership, function(req, res){
      //compares users id with campground authors id
      Campground.findById(req.params.id, function(err, foundCampground){
        res.render("campgrounds/edit", {campground: foundCampground});
      });
    });

    //UPDATE
    router.put("/index/:id", middleware.checkCampgroundOwnership, function(req, res){
      //find and update the correct campgrounds
      Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
        if(err){
          console.log(err);
          res.redirect("/index");
        } else {
          res.redirect("/index/" + req.params.id);
        }
      });
      //redirect somewhere
    });

    //DESTROY
    router.delete("/index/:id", middleware.checkCampgroundOwnership, function(req, res){
      Campground.findByIdAndRemove(req.params.id, function(err){
        if(err){
          console.log(err);
        }
        res.redirect("/index");
      });
    });

    module.exports = router;
