//======================VARIABLE DECLARATIONS=====================//
    var express     = require("express");
        router      = express.Router(),
        passport    = require("passport"),
        User        = require("../models/user");

//============================ROOT ROUTE==========================//
    router.get("/", function(req, res){
      res.render("campgrounds/landing");
    });

//==========================REGISTER ROUTES=======================//
    //routing to register form
    router.get("/register", function(req, res){
      res.render("register", {page: "register"});
    });
    //Handling User Signup
    router.post("/register", function(req, res){
      //grabs info from the form from the request and saves as variables
      let username = req.body.username,
      password = req.body.password;
      //register a new user
      User.register(new User({username: username}), password, function(err, user){
        if(err){
          console.log(err);
          return res.render("register", {error: err.message});
        }
        //will log user in, store information about user, and handle sessions,
        passport.authenticate("local")(req, res, function(){
          req.flash("Success", "Welcome to Yelpcamp" + user.username);
          res.redirect("/campgrounds/index");
        });
      });
    });

//=======================LOGIN ROUTES============================//
    //Show Login Form
    router.get("/login", function(req, res) {
      res.render("login", {page: "login"});
    });
    //Handling Login logic
    router.post("/login", passport.authenticate("local", {
      successRedirect: "/campgrounds/index",
      failureRedirect: "/login"
    }), function(req, res){

    });

//=======================LOGOUT ROUTE============================//
    router.get("/logout", function(req, res){
      //handles everything
      req.logout();
      req.flash("success", "Successfully logged you out.");
      res.redirect("/campgrounds/index");
    });

    module.exports = router;
