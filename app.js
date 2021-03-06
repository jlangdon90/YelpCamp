var newrelic      = require('newrelic');

require('dotenv').config();

var express       = require('express'),
    app           = express(),
    bodyParser    = require('body-parser'),
    mongoose      = require('mongoose'),
    Campground    = require('./models/campground'),
    Comment       = require('./models/comment'),
    seedDB        = require('./seeds'), 
    passport      = require('passport'),
    flash         = require('connect-flash'),
    User          = require('./models/user'),
    LocalStrategy = require('passport-local'),
    methodOverride= require('method-override');

var campgroundRoutes  = require("./routes/campgrounds"),
    commentRoutes     = require("./routes/comments"),
    indexRoutes       = require("./routes/index");

//<!-- Connect MongoDB and set some connection details -->
mongoose.Promise=global.Promise;
mongoose.connect(process.env.MONGO_DB_CONNECTION_STRING, {useMongoClient: true});

//after first application run, comment out the below code to avoid reseeding the DB every time you restart the application
//seedDB();

app.set('port', (process.env.PORT || 8000));
// Passport configuration
app.use(require("express-session")({
  secret: "this is a pretty basic Express app",
  resave: false,
  saveUninitialized: false
}));
app.use(flash());
app.locals.moment = require("moment");
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//<!-- define other environment settings -->
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname+"/public"));
app.use(methodOverride("_method"));


//pass our current user object to every route
app.use(function(req, res, next){
  res.locals.newrelic = newrelic;
  res.locals.currentUser = req.user;
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  next();
});

//<!--  ***********************  Routes *********************** -->

app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);
app.use(indexRoutes);

//<!-- **********  Final server startup *********** -->
app.listen(app.get('port'), function(){
  console.log("YelpCamp server has started on " + app.get('port'));;
});
