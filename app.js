var express = require("express");
var app = express();
var bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

//temporary campgrounds array
var campgrounds = [
  {name: "Salmon Creek", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcREqeGgygmTTYSMdxdxFqONtU-WIa2AdY3jXjYfAMJdUteshnZi"},
  {name: "Bear Cove", image: "https://www.yosemite.com/wp-content/uploads/2016/04/westlake-campground.png"},
  {name: "Deer Glade", image: "https://www.pc.gc.ca/en/pn-np/ab/banff/activ/camping/~/media/802FD4AF791F4C6886E18CBF4A2B81B2.ashx?w=595&h=396&as=1"}
]

//setting homepage
app.get("/", function(req, res){
  res.render("landing");
});

//campgrounds page
app.get("/campgrounds", function(req, res) {
  res.render("campgrounds", {campgrounds: campgrounds});
});

//to add a new campground page
app.get("/campgrounds/new", function(req, res){
  res.render("new.ejs");
});

//adding new campground to campground page and database
app.post("/campgrounds", function(req, res){
  let name = req.body.name;
  let image = req.body.image;
  let newCampground = {name: name, image: image}
  campgrounds.push(newCampground);
  res.redirect("/campgrounds");
});

//starting server
app.listen(3000, function() {
  console.log("Yelpcamp server has started.");
})
