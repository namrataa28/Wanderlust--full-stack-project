const express = require("express");
const router = express.Router();
const listing = require("../models/listing.js");
const wrapAsync = require("../utils/WrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { isLogged ,isOwner} = require("../middleware.js");
const {validateListing} = require("../middleware.js");
const listingController = require("../controller/listing.js");
const multer  = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage });

router.route("/")
.get(wrapAsync(listingController.index))
.post(isLogged,
    upload.single('listings[image]'),
    validateListing,
    wrapAsync(listingController.createListing))
.post( (req,res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }
    res.send(req.file);
})


//New Route
router.get("/new",isLogged,wrapAsync(listingController.renderForm))

//show Route
router.get("/:id",wrapAsync(listingController.showListing))

//Edit Route
router.get("/:id/edit",isLogged,isOwner,wrapAsync(listingController.editListing))

//update Route
router.put("/:id",isLogged,upload.single('listings[image]'),validateListing, isOwner,wrapAsync(listingController.updateListing))

//delete Route
router.delete("/:id",isLogged,isOwner,wrapAsync(listingController.destroyListing))

module.exports = router;