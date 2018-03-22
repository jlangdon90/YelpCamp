var express     = require('express');
var router      = express.Router();
var passport    = require('passport');
var User        = require("../models/user");

//<!-- **********  Other routes and auth routes  ********  -->

//<!-- Base route -->
router.get("/", function(req, res){
    res.render("landing");
});

//show register form
router.get("/register", function(req, res){
    res.render("register");
});

//handle signup logic
router.post("/register", function(req, res){
    var newUser = new User({username: req.body.username});

    User.register(newUser, req.body.password, function(err, user){
        if(err){
            req.flash("error", err.message);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function(){
            req.flash("success", "Welcome to YelpCamp, " + user.username + "!");
            res.redirect("/campgrounds");
        });
    });
});

//show login form
router.get("/login", function(req, res){
    res.render("login");
});

//handle login logic
router.post("/login", passport.authenticate("local", 
    { 
        successRedirect: "/campgrounds", 
        failureRedirect: "/login"
    }), 
    function(req, res){
        //nothing needed here, our redirect logic is above
});

//logout logic
router.get("/logout", function(req, res){
    req.logout();
    req.flash("error", "Logged you out");
    res.redirect("/campgrounds");
});

module.exports = router;