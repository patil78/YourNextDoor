const Listing = require("./models/listing");

module.exports.isloggedin = (req,res,next)=>{
    // console.log(req.path, "..", req.originalUrl);
    if(!req.isAuthenticated()){
        //redirect url save
        req.session.redirectUrl = req.originalUrl;

        req.flash("error", "You must be logged in to create listing")
        return res.redirect("/login");
    }
    next();
};

module.exports.savedRedirectUrl = (req,res,next)=>{
    res.locals.redirectUrl = req.session.redirectUrl || "/listings";
    delete req.session.redirectUrl;
    next();
};
module.exports.isowner = async(req,res,next)=>{
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner.equals(req.user._id)){
        req.flash("error", "You don't have permission to edit.");
        return res.redirect(`/listings/${id}`);
    }
    next();
};