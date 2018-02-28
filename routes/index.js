var express     = require('express');
var router      = express.Router();
var passport    = require('passport');
var User        = require("../models/user");

//<!-- **********  Other routes and auth routes  ********  -->

//<!-- Base route -->
router.get("/", function(req, res){
    //res.render("landing");
    //redirect to /campgrounds for now, it's a prettier page
    res.redirect("/campgrounds");
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
            console.log(err);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function(){
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
    res.redirect("/campgrounds");
});
  

//user authentication logic
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

module.exports = router;