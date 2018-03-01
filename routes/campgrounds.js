var express = require('express');
var router = express.Router();
var Campground = require("../models/campground");



//root route - display campgrounds
router.get("/", function(req, res){
    //Get all campgrounds from DB
    Campground.find({}, function(err, campgrounds){
        if(err){
            console.log(err);
        } else {
            res.render("campgrounds/index", {campgrounds:campgrounds});
        }
    });
  });
  
//add new campground
router.post("/", isLoggedIn, function(req, res){
    //get data from form and add to campgrounds array
    var name = req.body.name;
    var image = req.body.image;
    var description = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newCampground = {name : name, image : image, description: description, author: author};
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

//form for adding new campground
router.get("/new", isLoggedIn, function(req,res){
    res.render("campgrounds/new");
});

//display specific campground details
router.get("/:id", function(req, res){
    //find the campground with provided ID
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
            console.log(err);
        } else {
            //render show template with that campground
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
});

//user auth logic
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

module.exports = router;