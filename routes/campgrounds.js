var express = require("express");
    router = express.Router(),
    Campground = require("../models/campground");

//=====================MAIN CAMPGROUND ROUTES=======================
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

//=========================SHOWPAGE ROUTES============================
//adding new campground to campground database
router.post("/index", function(req, res){
  //grabbing  variables
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

//======================NEW CAMPGROUND ROUTES========================
//shows form to create new campground
router.get("/index/new", function(req, res){
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
      // //finding each comment in campground
      // foundCampground.comments.forEach(function(comment) {
      //   find("comments", {_id:comment}, function(err, comm){
      //     if(err) {
      //       console.log(err);
      //     } else {
      //       //save comment as new object
      //       let newComm = {
      //         author: comm[0]['author'],
      //         text: comm[0]['text']
      //       }
      //       //adding object to array
      //       commArr.push(newComm);
      //     }
      //     foundCampground.comments.push(commArr);
      //     console.log(foundCampground.comments);
      //     foundCampground.save();
      //   });
    // });
    //render show template with that campground
    res.render("campgrounds/show", {campground: foundCampground, comments: commArr})
  }
});
});

//========================HELPER FUNCTIONS=============================
//find comment object
function find (name, query, cb) {
  mongoose.connection.db.collection(name, function (err, collection) {
    collection.find(query).toArray(cb);
  });
}

// //Helper Function to find comment object
// function find (name, query, cb) {
//   mongoose.connection.db.collection(name, function (err, collection) {
//     collection.find(query).toArray(cb);
//   });
// }

function isLoggedIn(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect("/login");
}

module.exports = router;
