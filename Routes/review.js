const express = require("express");
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utils/WrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const review = require("../models/review.js");
const listing = require("../models/listing.js");
const{validateReview, isLogged,isAuthor} = require("../middleware.js");
const reviewController = require("../controller/review.js");

//post review Route
router.post("/", validateReview, isLogged,wrapAsync(reviewController.createReview));

//delete review route
router.delete("/:reviewId", isLogged,isAuthor,wrapAsync(reviewController.destroyReview));

module.exports = router;