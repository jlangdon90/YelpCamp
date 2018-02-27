require('newrelic');
require('dotenv').config();
var express       = require('express'),
    app           = express(),
    bodyParser    = require('body-parser'),
    mongoose      = require('mongoose'),
    Campground    = require('./models/campground'),
    Comment       = require('./models/comment'),
    seedDB        = require('./seeds'), 
    passport      = require('passport'),
    User          = require('./models/user'),
    LocalStrategy = require('passport-local');


//<!-- Connect MongoDB and set some connection details -->
mongoose.Promise=global.Promise;
mongoose.connect(process.env.MONGO_DB_CONNECTION_STRING, {useMongoClient: true});
seedDB();

// Passport configuration
app.use(require("express-session")({
  secret: "this is a pretty basic Express app",
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//<!-- define other environment settings -->
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname+"/public"));

//<!--  ***********************  Routes *********************** -->
//<!-- Base route -->
app.get("/", function(req, res){
  res.render("landing");
});

//<!-- Campground routes -->
app.get("/campgrounds", function(req, res){
  //Get all campgrounds from DB
  Campground.find({}, function(err, campgrounds){
    if(err){
      console.log(err);
    } else {
      res.render("campgrounds/index", {campgrounds:campgrounds});
    }
  });
});

app.post("/campgrounds", function(req, res){
  //get data from form and add to campgrounds array
  var name = req.body.name;
  var image = req.body.image;
  var description = req.body.description;
  var newCampground = {name : name, image : image, description: description};
  //Create a new campground and save to DB
  Campground.create(newCampground, function(err, newlyCreated){
    if(err){
      console.log(err);
    }else{
      //if no errors, redirect back to campgrounds page
      res.redirect("/campgrounds");
    }
  });
});

app.get("/campgrounds/new", function(req,res){
  res.render("campgrounds/new");
});

app.get("/campgrounds/:id", function(req, res){
  //find the campground with provided ID
  Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
      if(err){
        console.log(err);
      } else {
        res.render("campgrounds/show", {campground: foundCampground});
      }
  });
  //render show template with that campground
});

//<!-- Comments routes -->

app.get("/campgrounds/:id/comments/new", function(req, res){
  //find campground by id
  Campground.findById(req.params.id, function(err, campground){
    if(err){
      console.log(err);
    } else {
      res.render("comments/new", {campground: campground});
    }
  });
});

app.post("/campgrounds/:id/comments", function(req, res){
  //lookup campground using ID
  Campground.findById(req.params.id, function(err, campground){
    if(err){
      console.log(err);
      res.redirect("/campgrounds");
    } else {
      //create new comments
      Comment.create(req.body.comment, function(err, comment){
          if(err){
            console.log(err);
          } else {
            //connect new comment to campground
            campground.comments.push(comment);
            campground.save();
            //redirect to campground show page
            res.redirect('/campgrounds/'+ campground._id);
          }
      });
    }
  });
});

//<!-- **********  Authentication routes  ********  -->
//show register form
app.get("/register", function(req, res){
  res.render("register");
});

//handle signup logic
app.post("/register", function(req, res){
  var newUser = new User({username: req.body.username});
  User.register(newUser, req.body.password, function(err, user){
    if(err){
      console.log(err);
      return res.render("register");
    }
    passport.authenticate("local")(req, res, function(){
      res.redirect("/campgrounds");
    });
  });
});

//<!-- **********  Final server startup *********** -->
app.listen(8000, function(){
  console.log("YelpCamp server has started on localhost:8000");
});
