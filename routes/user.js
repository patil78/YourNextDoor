const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapasync.js");
const passport = require("passport");
const { savedRedirectUrl } = require("../middleware.js");

router.get("/signup", (req,res)=>{
res.render("users/signup.ejs");
});
router.post("/signup", wrapAsync(async(req,res)=>{
    try{

        let {username, email, password} = req.body;
        const newuser = new User({email, username});
        const registeredUser = await User.register(newuser, password);
        console.log(registeredUser);
        req.login(registeredUser,(err) =>{
            if(err){
                return next(err);
            }
            req.flash("success", "welcome to Wanderlust");
            res.redirect("/listings");
        });
    }
    catch(err){
        req.flash("error", err.message);
        res.redirect("/signup"); 
    }
}));

router.get("/login", (req,res)=>{
    res.render("users/login.ejs");
});

router.post("/login",
    savedRedirectUrl,
     passport.authenticate("local", {
    failureRedirect: "/login", 
    failureFlash: true
 }),
 (req,res)=>{
    req.flash("success", "Welcome to Wanderlust! You have logged in!");
    res.redirect(res.locals.redirectUrl);

});


router.get("/logout", (req,res)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success", "You are logged out!");
        res.redirect("/listings");
    });
});

module.exports = router;