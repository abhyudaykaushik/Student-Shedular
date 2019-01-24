var mongoose = require("mongoose");
var Campground = require("./models/campground");
var Comment   = require("./models/comment");
 
var data = [
    {
        name: "Nandi Hills", 
        image: "https://indiator.com/tourist-places/wp-content/uploads/2017/05/Nandi-Hills-1.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"
    },
    {
        name: "Ramnagara", 
        image: "http://www.onefivenine.com/images/districtimages/Karnataka/Ramanagara/4.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"
    },
    {
        name: "Kanakpura", 
        image: "https://adventurefanatic.files.wordpress.com/2015/05/resorts-in-kanakapura-india-road.jpg?w=412&h=309",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"
    }
]

function seedDB(){
   //Remove all campgrounds
   Campground.remove({}, function(err){
       
        if(err){
            console.log(err);
        }
        
        console.log("removed campgrounds!");
        
        // written in callback of Campground.remove cuz we want it to 
        //execute after removing campgrounds...
        Comment.remove({}, function(err) {
            
            if(err){
                console.log(err);
            }
            
            console.log("removed comments!");
            
            
             //add a few campgrounds
            // written in callback of Comment.remove cuz we want it to 
            //execute after removing campgrounds AND comments...             
            data.forEach(function(seed){
                
                // we shud pass an object in 'create' and seed is already an object from 'data' array...
                Campground.create(seed, function(err, campground){
                    if(err){
                        console.log(err)
                    } else {
                        console.log("added a campground");
                        
                        //create a comment
                        // written in callback of Campground.remove cuz we want it to 
                        //execute after removing campgrounds AND removing comments AND
                        // adding a campground...
                        Comment.create(
                            {
                                text: "This place is great, but I wish there was internet",
                                author: "Raj"
                            }, function(err, comment){
                                if(err){
                                    console.log(err);
                                } else {
                   
                        // associating comment with a particular campground calling this callback
                                    campground.comments.push(comment);
                                    campground.save();
                                    console.log("Created new comment");
                                }
                            });
                    }
                });
            });
        });
    }); 
    //add more comments
}
 
module.exports = seedDB;