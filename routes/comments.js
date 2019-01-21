//======================VARIABLE DECLARATIONS======================//
    var express       = require("express");
        router        = express.Router({mergeParams: true}),
        middleware    = require("../middleware"),
        Campground    = require("../models/campground"),
        Comment       = require("../models/comment");

//====================CREATING A COMMENT FORM======================//
    router.get("/new", middleware.isLoggedIn, function(req, res){
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
    router.post("/", middleware.isLoggedIn, function(req, res) {
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
              //add username and id of logged in user to comment
              comment.author.id = req.user._id;
              comment.author.username = req.user.username;
              comment.save();
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

//==================EDIT/UPDATE COMMENTS ROUTES==================//
    //EDIT
    router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
      Comment.findById(req.params.comment_id, function(err, foundComment){
        if(err) {
          res.redirect("back");
        } else {
          res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
        }
      })
    });

    //UPDATE
    router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res){
      Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if(err){
          res.redirect("back");
        } else {
          res.redirect("/index/" + req.params.id);
        }
      })
    });

    //DELETE
    router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
      Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
          res.redirect("back");
        } else {
          res.redirect("/index/" + req.params.id);
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
