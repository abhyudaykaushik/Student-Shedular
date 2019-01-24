var express      = require("express"),
    app          = express(),
    bodyParser   = require("body-parser"),
    mongoose     = require("mongoose"),
    Staff        = require("./models/staff.js"),
    Student      = require("./models/student.js"),
    passport     = require("passport"),
    LocalStrategy= require("passport-local"),
    passportLocalMongoose = require("passport-local-mongoose"),
    flash        = require("connect-flash"),
    Principal    = require("./models/principaldb.js"),
    Admin        = require("./models/admindb.js")
   // priAppointment = require("./models/priappointment.js");
    //seedDB       = require("./seeds.js");

//seedDB();

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
mongoose.connect("mongodb://localhost/runtime_v1");
app.use(express.static(__dirname + "/public"));
app.use(flash());


// EXPRESS SESSION CONFIG.
app.use(require("express-session")({
    secret: "This can be any random text",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(Student.authenticate()));
passport.use(new LocalStrategy(Student.authenticate()));
passport.serializeUser(Student.serializeUser());
passport.deserializeUser(Student.deserializeUser());



// Campground.create({
//     name: "Ramnagara",
//     image: "http://www.onefivenine.com/images/districtimages/Karnataka/Ramanagara/4.jpg",
//     description:    "Ramanagara has mostly known for the highly exciting trekking paths that it has but it is also a great camping destination for team outings.\
//                     /You can combine trekking and immersing yourself into nature with highly entertaining activities like rock climbing.\
//                     /If you are up for a relaxing experience that is not too difficult, you should trek on the main hill and if you want to have a highly adventurous camping experience,\
//                     /take the more difficult trek paths while arranging a longer outing. Ramanagara is a perfect destination for team outings in the vicinity of Bangalore."

// }, function(err, campground){
//     if(err){
//         console.log("ERROR!!!");
//     }else{
//         console.log("New campground added to DB!");
//         console.log(campground);
//     }
// });


// var campgrounds = [
//         {name: "", image:" "},
//         {name: "", image: ""},
//         {name: "Ramnagara", image: "http://www.onefivenine.com/images/districtimages/Karnataka/Ramanagara/4.jpg"},
//         {name: "Kanakpura", image:"https://adventurefanatic.files.wordpress.com/2015/05/resorts-in-kanakapura-india-road.jpg?w=412&h=309 "}
//     ];


app.get("/", function(req, res){
    res.render("landing", {currentUser: req.user})
});

app.post("/data", function(req, res){
    if(req.body.pswitch || Principal.count()){
        var pstatus = "Available";
        var pcomment = req.body.pcomment;
        var newPrincipal = {status: pstatus, comment: pcomment};
        Principal.create(newPrincipal, function(err,newPrincipal){
          if(err){
              console.log("ERROR!!");
          }else{
             newPrincipal = Principal.findOne({}, {fields: {_id: 1}, sort: {_id: -1}});
             //redirect back to campground page
              res.render("landing", {newPrincipal: newPrincipal});      
          }
        });
    }
    else{
        var pstatus = "Not Available";
        var pcomment = req.body.pcomment;
        var newPrincipal = {status: pstatus, comment: pcomment};
        Principal.create(newPrincipal, function(err,newPrincipal){
          if(err){
              console.log("ERROR!!");
          }else{
             //redirect back to campground page
             newPrincipal = Principal.findOne({}, { sort: {_id: -1}});
              res.render("landing", {newPrincipal: newPrincipal});      
          }
        });
    }
    
    // if(req.body.aswitch || Admin.find){
    //     var astatus = "Available";
    //     var acomment = req.body.acomment;
    //     var newAdmin = {status: astatus, comment: acomment};
    //     Admin.create(newAdmin, function(err,newAdmin){
    //       if(err){
    //           console.log("ERROR!!");
    //       }else{
    //          //redirect back to campground page
    //           res.render("landing", {newAdmin: newAdmin});      
    //       }
    //     });
    // }
    
    //     else{
    //     var astatus = "Not Available";
    //     var acomment = req.body.acomment;
    //     var newAdmin = {status: astatus, comment: acomment};
    //     Admin.create(newAdmin, function(err,newAdmin){
    //       if(err){
    //           console.log("ERROR!!");
    //       }else{
    //          //redirect back to campground page
    //           res.render("landing", {newAdmin: newAdmin});      
    //       }
    //     });
    // }

});



// show register form
app.get("/register", function(req, res){
    res.render("register");
});


// CREATE - add a new student to database
app.post("/register", function(req, res){
    var newUser = new Student({username: req.body.username});
    
    Student.register(newUser, req.body.password, function(err, user){
       if(err){
           req.flash("error", err.message);
           return res.redirect("/register");
       }
       
       // first register and then we are logging the user in...
       passport.authenticate("local")(req, res, function(){
           req.flash("success", "Welcome to NMIT Runtime " + user.username);
           res.redirect("/");
       });
    });
});

// =========STUDENT LOGIN ROUTE=========//
// show login form
app.get("/studentLogin", function(req, res){
    res.render("studentLogin");
});
// handle login logic
// use MIDDLEWARE to authenticate login before calling callback..
app.post("/studentLogin", passport.authenticate("local", 
    {
    successRedirect: "/",
    failureRedirect: "/studentLogin"
    }), function(req, res){
        
});


// =========STAFF LOGIN ROUTE=========//
// show login form
app.get("/staffLogin", function(req, res){
    res.render("staffLogin");
});

app.post("/staffLogin", function(req, res){
   if(req.body.username==="hcnagraj" && req.body.password==="1234"){
       res.redirect("/principal");
   }
   else if(req.body.username==="rohitpunja" && req.body.password==="1234"){
       res.redirect("/admin");
   }
   else if(req.body.username==="dr.thippeswamy" && req.body.password==="1234"){
       res.redirect("/cse-hod");
   }
   else if(req.body.username==="v.sridhar" && req.body.password==="1234"){
       res.redirect("/dean");
   }
   else{
       res.redirect("/staffLogin");
   }
});


//*************************
// Staff redirection page//
//*************************
app.get("/principal", function(req, res) {
   res.render("principal")
});

// app.post("/principal/", function(req, res) {
//     var status = req.body.switch;
//     var comment = req.body.comment;
//     var principalData = {status: status, comment:comment};
    
//     priAppointment.create(principalData, function(err, newlyCreated){
//       if(err){
//           console.log(err);
//       }else{
//          //redirect back to campground page
//           res.redirect("/post");      
//       }
//     });
    
// });


app.get("/dean", function(req, res) {
   res.render("dean"); 
});

app.get("/admin", function(req, res) {
   res.render("admin"); 
});

app.get("/cse-hod", function(req, res) {
   res.render("cse-hod"); 
});


//===============LOGOUT=============//
app.get("/logout", function(req, res) {
   req.logout(); 
   req.flash("success", "Logged you out!");
   res.redirect("/");
});


// // SHOW - show detailed info of A PARTICULAR campground
// // It shud be below /campgrounds/new otherwise it will catch that route also
// app.get("/campgrounds/:id", function(req, res){
//     // find campground with provided id
    
//     //populating cuz one campground will have many comments
//     // see rough notes just befor MODULE.EXPORTS
    
//     Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
       
//         if(err){
//             console.log(err);
//         }else{
                
//               //render show template with that campground
//               res.render("show", {campground: foundCampground})  
//         }
        
//     });
// });


app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server started!!")
});