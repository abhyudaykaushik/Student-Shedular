var express      = require("express"),
    app          = express(),
    bodyParser   = require("body-parser"),
    mongoose     = require("mongoose"),
    Staff        = require("./models/staff.js"),
    Student      = require("./models/student.js"),
    passport     = require("passport"),
    LocalStrategy= require("passport-local"),
    passportLocalMongoose = require("passport-local-mongoose")
   // seedDB       = require("./seeds.js");

//seedDB();


app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
mongoose.connect("mongodb://localhost/runtime_v5");
app.use(express.static(__dirname + "/public"));

// EXPRESS SESSION CONFIG.
app.use(require("express-session")({
    secret: "This can be any random text",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(Staff.authenticate()));   // comes with passport-local-mongoose
passport.use(new LocalStrategy(Staff.authenticate()));
passport.serializeUser(Staff.serializeUser());
passport.deserializeUser(Staff.deserializeUser());

passport.use(new LocalStrategy(Student.authenticate()));   // comes with passport-local-mongoose
passport.use(new LocalStrategy(Student.authenticate()));
passport.serializeUser(Student.serializeUser());
passport.deserializeUser(Student.deserializeUser());




// Staff.create({
//     username: "v.sridhar",
//     password: "1234",
//     position: "Dean"
// }, function(err, staff){
//     if(err){
//         console.log("ERROR!!!");
//     }else{
//         console.log("New staff added to DB!");
//         console.log(staff);
//     }
// });

// Student.create({
//     username: "Pratik",
//     password: "1234",
//     fullname: "Pratik Raj",
// }, function(err, student){
//     if(err){
//         console.log("ERROR!!!");
//     }else{
//         console.log("New student added to DB!");
//         console.log(student);
//     }
// });


app.get("/", function(req, res){
    res.render("landing")
});

// handling student registration
app.get("/register", function(req, res){
    res.render("register");
});

app.post("/register", function(req, res){
    req.body.username;
    req.body.password;
    req.body.fullname;
    Student.register(new Student({username: req.body.username, fullname: req.body.fullname}), req.body.password, function(err, newStudent){
       if(err){
           console.log(err);
           return res.render("register");
       } 
       passport.authenticate("local")(req, res, function(){
          res.redirect("/"); 
       });
    });
});


// handling student login
app.get("/studentLogin", function(req, res){
    res.render("studentLogin");
});

// handling student login using middleware
app.post("/studentLogin", passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/studentLogin",
}) ,function(req, res){
    
});


// handling staff login
app.get("/staffLogin", function(req, res){
    res.render("staffLogin");
});


app.post("/staffLogin", function(req, res){
   if(req.body.username==="hcnagraj" && req.body.password==="1234"){
       res.render("principal");
   }
   else if(req.body.username==="rohitpunja" && req.body.password==="1234"){
       res.render("admin");
   }
   else if(req.body.username==="dr.thippeswamy" && req.body.password==="1234"){
       res.render("cse-hod");
   }
   else if(req.body.username==="v.sridhar" && req.body.password==="1234"){
       res.render("dean");
   }
   else{
       res.redirect("/staffLogin");
   }
});

//==============//
//====LOGOUT====//
//==============//
app.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/");
});





app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server started!!")
});