//======================VARIABLE DECLARATIONS======================//
    var express       = require("express");
        router        = express.Router({mergeParams: true}),
        Campground    = require("../models/campground"),
        Comment       = require("../models/comment");

//====================CREATING A COMMENT FORM======================//
    router.get("/new", isLoggedIn, function(req, res){
      //find campground by id
      Campground.findById(req.params.id, function(err, campground){
        if(err){
          console.log(err)
        } else {
          res.render("comments/new", {campground: campground});
        }
      });
    });

//================POSTING A COMMENT TO THE FORM===================//
    router.post("/", isLoggedIn, function(req, res) {
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
              campground.save();
              //redirect to campground show page
              res.redirect("/index/" + campground._id);
            }
          });
        }
      });
    });

//=======================HELPER FUNCTIONS=======================//
    //authenticate user is logged in (helper function)
    function isLoggedIn(req, res, next){
      if(req.isAuthenticated()){
        return next();
      }
      res.redirect("/login");
    }

    module.exports = router;
