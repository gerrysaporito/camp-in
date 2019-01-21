//========================MIDDLEWARE FUNCTIONS============================//
var Campground = require("../models/campground"),
    Comment = require("../models/comment"),
    middlewareObj = {};

middlewareObj.checkCampgroundOwnership = function checkCampgroundOwnership(req, res, next){
  if(req.isAuthenticated()){
    //finds campground to use id
    Campground.findById(req.params.id, function(err, foundCampground){
      if(err) {
        res.redirect("back");
      } else {
        //AUTHORIZATION: compares users id with campground authors id
        if(foundCampground.author.id.equals(req.user._id)){
          next();
        } else {
          res.redirect("back");
        }
      }
    });
  } else {
    res.redirect("back");
  }
}

middlewareObj.checkCommentOwnership = function checkCommentOwnership(req, res, next){
  if(req.isAuthenticated()){
    //finds campground to use id
    Comment.findById(req.params.comment_id, function(err, foundComment){
      if(err) {
        res.redirect("back");
      } else {
        //AUTHORIZATION: compares users id with comments authors id
        if(foundComment.author.id.equals(req.user._id)){
          next();
        } else {
          res.redirect("back");
        }
      }
    });
  } else {
    res.redirect("back");
  }
}

middlewareObj.isLoggedIn = function isLoggedIn(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect("/login");
}

module.exports = middlewareObj;
