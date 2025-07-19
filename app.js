const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const expresserror = require("./utils/expresserror.js");
const listingsRouter = require("./routes/listings.js");
const reviewsRouter = require("./routes/reviews.js");
const userRouter = require("./routes/user.js");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const flash = require("connect-flash");
const passport = require("passport");
const Localstrategy = require("passport-local");
const User = require("./models/user.js");



// setting up express-sessions
const sessionoptions = {
    secret : "mysupersecret",
    resave: false,
    saveUninitialized: true,
    cookie:{
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
    }
};

// home route
app.get("/", (req, res) => {
    res.send("Hi, i am root");
});


app.use(session(sessionoptions));
app.use(flash());




//use of passport for hashing algorithm
app.use(passport.initialize());
app.use(passport.session()); 


 //we use this so that the user did not need to login all the time and send request for authentication. So that each request know  about the corresponding session.
 passport.use(new Localstrategy(User.authenticate()));  //it is static authenticate method of model in local strategy
 
 passport.serializeUser(User.serializeUser());
 passport.deserializeUser(User.deserializeUser());


//using Flash-connect to flash the messages for success and errors
app.use((req,res,next) =>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});



// //creating demo user
// app.get("/demouser", async(req,res)=>{
//     let fakeUser = new User ({
//         email: "student@gmail.com",
//         username: "Delta-student"
//     });
//     let registeredUser = await User.register(fakeUser,"helloworld");
//     res.send(registeredUser);
// })


// mongo setup
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
main().then(() => {
    console.log("connected to DB");
}).catch((err) => {
    console.log(err);
});

async function main() {
    await mongoose.connect(MONGO_URL);
}


// setting up EJS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")));



//using express router for listings routes
app.use("/listings", listingsRouter);

//using express router for reviews routes
app.use("/listings/:id/reviews", reviewsRouter);

//using express router for signup for user routes
app.use("/", userRouter);


// 404 route handler
// app.all("*", (req, res, next) => {
//     next(new expresserror(404, "Page not found!"));
// });

// error handler middleware
app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Something went wrong!" } = err;
    res.render("error.ejs", { err });
    // res.status(statusCode).send(message);
    // res.send("something went wrong");
});



// start server
app.listen(8000, () => {
    console.log("server is listening to port 8000");
});
