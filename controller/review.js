const listing = require("../models/listing");
const review = require("../models/review");

module.exports.createReview = async(req,res) => {
    let listings = await listing.findById(req.params.id);
    let newReview = new review({
        comment:req.body.review.comment,
        rating:req.body.review.rating
    });
    newReview.author = req.user._id;
    console.log(newReview)
    await newReview.save();
    listings.reviews.push(newReview._id);

    
    await listings.save();

    req.flash("success","New review created!");

    res.redirect(`/listing/${listings._id}`);
}

module.exports.destroyReview = async(req,res) => {
    let {id,reviewId} = req.params;
    await listing.findByIdAndUpdate(id, {$pull: {reviews:reviewId}});
    await review.findByIdAndDelete(reviewId);
    req.flash("success"," Review Deleted!");
    res.redirect(`/listing/${id}`);
}