const listing = require("../models/listing");

module.exports.index = async(req,res) => {
    let all_listing = await listing.find({});
     res.render("./listing/index.ejs",{all_listing})
}

module.exports.renderForm = async(req,res) => {
    res.render("./listing/new.ejs");
}

module.exports.showListing = async(req,res) => {
    let{id} = req.params;
    let listings = await listing.findById(id).populate({path:"reviews",populate:{path:"author"}}).populate("owner");
    if(!listings){
        req.flash("error","Listing you requested for does not exist!");
        res.redirect("/listing");
    }
    console.log(listings);
     res.render("./listing/show.ejs",{listings});
}

module.exports.createListing = async(req,res,next) => {
    let url = req.file.path;
    let filename = req.file.filename;
    if (req.body.listings.image.url === "") {
        req.body.listings.image.url = 'https://unsplash.com/photos/a-hammock-hanging-from-a-palm-tree-on-a-beach-QoWDbXGnl3E';
      }
    const newlisting = new listing(req.body.listings);
    newlisting.owner = req.user._id;
    newlisting.image = {url,filename};
    await newlisting.save();
    req.flash("success","New listing created!");
    res.redirect("/listing");
}

module.exports.editListing = async(req,res) => {
    let{id} = req.params;
    let listings = await listing.findById(id);
    if(!listings){
        req.flash("error","Listing you requested for does not exist!");
        res.redirect("/listing");
    }
     res.render("./listing/edit.ejs",{listings});
}

module.exports.updateListing = async(req,res) => {
    let{id} = req.params;
     let listing = await listing.findByIdAndUpdate(id,{...req.body.listings});

    if(typeof req.file != "undefined"){
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = {url,filename};
    await listing.save();
    }
    req.flash("success"," Listing Updated!");
    return res.redirect(`/listing/${id}`);
}

module.exports.destroyListing = async(req,res) => {
    let{id} = req.params;
    let deletelist = await listing.findByIdAndDelete(id);
    req.flash("success"," Listing Deleted!");
     res.redirect("/listing");
}