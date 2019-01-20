//=====================Importing=========================//
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
        campgroundRoutes = require("./routes/campgrounds");
        commentRoutes = require("./routes/comments");
        indexRoutes = require("./routes/index"),

        seedDB                  = require("./seeds"),
        app                     = express();

//===============INITIALIZING/SETUP APPS=================//
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
      next();
    });

    //ROUTES
    app.use(campgroundRoutes);
    app.use("/index/:id/comments", commentRoutes);
    app.use("/", indexRoutes);


  //starting server
  app.listen(3000, function() {
    console.log("Yelpcamp server has started.");
  });
