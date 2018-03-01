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

var campgroundRoutes  = require("./routes/campgrounds"),
    commentRoutes     = require("./routes/comments"),
    indexRoutes       = require("./routes/index");

//<!-- Connect MongoDB and set some connection details -->
mongoose.Promise=global.Promise;
mongoose.connect(process.env.MONGO_DB_CONNECTION_STRING, {useMongoClient: true});

//after first application run, comment out the below code to avoid reseeding the DB every time you restart the application
//seedDB();

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

//pass our current user object to every route
app.use(function(req, res, next){
  res.locals.currentUser = req.user;
  next();
});

//<!--  ***********************  Routes *********************** -->

app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);
app.use(indexRoutes);

//<!-- **********  Final server startup *********** -->
app.listen(8000, function(){
  console.log("YelpCamp server has started on localhost:8000");
});
