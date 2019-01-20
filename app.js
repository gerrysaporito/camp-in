//=====================Importing=========================
    //variables
var express                 = require("express"),
    mongoose                = require("mongoose"),
    passport                = require("passport"),
    expressSession          = require("express-session"),
    bodyParser              = require("body-parser"),
    localStrategy           = require("passport-local"),
    passportLocalMongoose   = require("passport-local-mongoose"),
    //schemas
    User                    = require("./models/user"),
    Comment                 = require("./models/comment"),
    Campground              = require("./models/campground"),
    //routes
    // commentRoutes = require("")

    seedDB                  = require("./seeds"),
    app                     = express();

//===============INITIALIZING/SETUP APPS=================
    //connecting to database
    mongoose.connect("mongodb://localhost/yelp_camp");
    //initializing body parser
    app.use(bodyParser.urlencoded({extended: true}));
    //including directories
    app.set("view engine", "ejs");
    app.use(express.static(__dirname + "/public"));
    //resets database and adds in samples
    seedDB();

    //PASSPORT CONFIGURATION
    app.use(expressSession({
      secret: "Samoyeds are the best breed of dogs",
      resave: false,
      saveUninitialized: false
    }));
    //starts up the session
    app.use(passport.initialize());
    app.use(passport.session());
    //deals with authenticating user
    passport.use(new localStrategy(User.authenticate()));
    //responsible for reading the session
    passport.serializeUser(User.serializeUser());
    passport.deserializeUser(User.deserializeUser());
    //pass user request to every page
    app.use(function(req, res, next){
      res.locals.currentUser = req.user;
      console.log(req.user);
      next();
    });

//=======================================================
//=======================ROUTES==========================
//=======================================================
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
      console.log(err);
    } else {
      res.render("campgrounds/index", {campgrounds: allCampgrounds});
    }
  })
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

//NEW ROUTE - shows form to create new campground
app.get("/index/new", function(req, res){
  res.render("campgrounds/new");
});

//Helper Function to find comment object
function find (name, query, cb) {
  mongoose.connection.db.collection(name, function (err, collection) {
    collection.find(query).toArray(cb);
  });
}
//SHOW ROUTE - shows more info about selected campground
app.get("/index/:id", function(req, res) {
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

//============================
//======COMMENTS ROUTES=======
//============================
app.get("/index/:id/comments/new", isLoggedIn, function(req, res){
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
app.post("/index/:id/comments", isLoggedIn, function(req, res) {
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

//===============
//  AUTH ROUTES
//===============
app.get("/register", function(req, res){
  res.render("register");
});
//Handling User Signup
app.post("/register", function(req, res){
  //grabs info from the form from the request and saves as variables
  let username = req.body.username,
      password = req.body.password;
  //register a new user
  User.register(new User({username: username}), password, function(err, user){
    if(err){
      console.log(err);
      return res.render("register");
    }
    //will log user in, store information about user, and handle sessions,
    passport.authenticate("local")(req, res, function(){
      res.redirect("/campgrounds/index");
    });
  });
});

//Show Login Form
app.get("/login", function(req, res) {
  res.render("login");
});
//Handling Login logic
app.post("/login", passport.authenticate("local", {
  successRedirect: "/campgrounds/index",
  failureRedirect: "/login"
}), function(req, res){

});

//LOGOUT ROUTES
app.get("/logout", function(req, res){
  //handles everything
  req.logout();
  res.redirect("/");
});

function isLoggedIn(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect("/login");
}

//starting server
app.listen(3000, function() {
  console.log("Yelpcamp server has started.");
})
