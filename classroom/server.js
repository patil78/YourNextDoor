const express = require("express");
const app = express();
const user = require("./routes/user");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const flash = require("connect-flash");
const path = require("path");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

const sessionoptions = {
    secret: 'secretcode',
    resave: false,
    saveUninitialized: true
};

app.use(session(sessionoptions));
app.use(flash("success", "user registered successfully"));

app.get("/register", (req,res) =>{
    let {name = "anonymous"} = req.query;
    req.session.name = name;   //using express we are storing the information
    // console.log(req.session.name);
    if(name === "anonymous"){
        req.flash("error", "user not registered successfully");
    }
    else{

        req.flash("success", "user registered successfully");
    }
    res.redirect("/hello");
});
app.get("/hello" , (req,res) =>{
    // res.send(`hello , ${req.session.name}`);   //and by using req.session we are using the information that is being stored.
    res.locals.messages = req.flash("success");
    res.locals.messages = req.flash("error");
    res.render("page.ejs", {name: req.session.name})
});

// app.get("/reqcount", (req,res)=>{
//     if(req.session.count){
//         req.session.count++;
//     }
//     else{
//         req.session.count =1;
//     }
//     res.send(`you sent a request to the server in the same session for ${req.session.count} time`);
// })

// app.get("/test", (req,res)=>{
//     res.send("test successfull");
// });

app.listen(3000, () =>{
    console.log("server is listening to 3000");
});