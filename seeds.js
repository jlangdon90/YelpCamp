var mongoose = require('mongoose');
var Campground = require('./models/campground');
var Comment = require('./models/comment');

var data = [
  {
    name: "Salmon Creek",
    image: "http://photosforclass.com/download/pixabay-2825197",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
  },
  {
    name: "Granite Hill",
    image: "http://photosforclass.com/download/pixabay-2512944",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
  }
]

function seedDB(){
  //remove all campgrounds
  Campground.remove({}, function(err){
    if(err){
      console.log(err)
    }
        console.log("Removed campgrounds");

        data.forEach(function(seed){
          Campground.create(seed, function(err, campground){
            if(err){
              console.log(err)
            } else {
              console.log("Added a campground");
              //create a comment
              Comment.create(
                {
                  text: "This place is great, but I wish there was internet",
                  author: "Homer"
                }, function(err, comment){
                  if(err){
                    console.log(err);
                  } else {
                    campground.comments.push(comment);
                    campground.save();
                    console.log("Created new comment");
                  }
                });
            }
          });
        });
  });

  //add a few campgrounds


}

module.exports = seedDB;
