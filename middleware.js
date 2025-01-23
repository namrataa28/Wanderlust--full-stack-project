const listings = require("./models/listing");
const {listingSchema,reviewSchema} = require("./schema.js");
const review = require("./models/review.js");
const ExpressError = require("./utils/ExpressError");


module.exports.isLogged = (req,res,next) => {
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error","User must be logged in!");
       return res.redirect("/login");
    }
    next();
}

module.exports.saveRedirectUrl = (req,res,next) => {
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next()
}

module.exports.isOwner = async(req,res,next) => {
    let {id} = req.params;
    let listing = await listings.findById(id);
    if(!listing.owner.equals(res.locals.currUser._id)){
        req.flash("error","You don't have permission to access");
        return res.redirect(`/listing/${id}`);
    }
    next();
}

module.exports.validateListing = (req,res,next) => {
    let {error} = listingSchema.validate(req.body);
    console.log(error);
    if(error){
        let errMsg = error.details.map((el) => el.message).join(",");
      throw new ExpressError(400, errMsg);
    }else{
        next();
    }
}

module.exports.validateReview = (req,res,next) => {
    let {error} = reviewSchema.validate(req.body);
    console.log(error);
    if(error){
        let errMsg = error.details.map((el) => el.message).join(",");
      throw new ExpressError(400, errMsg);
    }else{
        next();
    }
}

module.exports.isAuthor = async(req,res,next) => {
    let {id,reviewId} = req.params;
    let reviews = await review.findById(reviewId);
    if(!reviews.author.equals(res.locals.currUser._id)){
        req.flash("error","You don't have permission to delete review");
        return res.redirect(`/listing/${id}`);
    }
    next();
}