const express = require("express");
const router = express.Router();
const wrapasync = require("../utils/wrapasync.js");
const expresserror = require("../utils/expresserror.js");
const { listingschema } = require("../schema.js");
const Listing = require("../models/listing.js");
const {isloggedin, isowner} = require("../middleware.js");




//creating validation method for listing schema
const validationlisting = (req, res, next) => {
    let { error } = listingschema.validate(req.body);
    if (error) {
        let errmsg = error.details.map((el) => el.message).join(",");
        throw new expresserror(400, errmsg);
    } else {
        next();
    }
};



// index route
router.get("/", wrapasync(async (req, res) => {
    const allistings = await Listing.find({});
    // console.log("Fetched listings:", allistings);
    res.render("listings/index", { allistings });
}));

// new route
router.get("/new",isloggedin, (req, res) => {
    console.log(req.user);
    res.render("listings/new");
});

// show route
router.get("/:id", wrapasync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews").populate("owner");
    if(!listing){
       req.flash("error", "Listing you requested does not exist."); 
       return res.redirect("/listings");
    }
    // console.log(listing);
    res.render("listings/show", { listing });
}));

// create route
router.post("/",
    isloggedin,
    validationlisting,
    wrapasync(async (req, res, next) => {
        //  console.log("Incoming body:", req.body.listing);  //this can be ued to check if any of the key elements are not showing on the page
        const newListing = new Listing(req.body.listing);
        console.log(req.user);
        newListing.owner = req.user._id;
        await newListing.save();
        req.flash("success", "New Listing created!");
        res.redirect("/listings");
    })
);

// edit route
router.get("/:id/edit",isloggedin,isowner, wrapasync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
       req.flash("error", "Listing you requested does not exist."); 
       return res.redirect("/listings");
    }
    res.render("listings/edit", { listing });
}));

// update route
router.put("/:id",isloggedin, isowner,wrapasync(async (req, res) => {
    if (!req.body.listing) {
        throw new expresserror(400, "send valid data for listing");
    }
    let { id } = req.params;
    
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("success", "Listing Updated!");
    res.redirect("/listings");
}));

// delete route
router.delete("/:id",isloggedin,isowner, wrapasync(async (req, res) => {
    let { id } = req.params;
    let deletedlisting = await Listing.findByIdAndDelete(id);
    console.log(deletedlisting);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
}));

module.exports = router;