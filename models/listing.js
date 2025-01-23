const mongoose = require("mongoose");
const schema = mongoose.Schema;
const review = require("./review.js");

const listingschema = new schema({
    title:{
        type:String,
        required:true
    },
    description:String,
        image: {
          url: { type: String, required: true },
          filename: String
        },
    price:Number,
    location:String,
    country:String,
    reviews:[
      {
        type:schema.Types.ObjectId,
        ref:"review"
      }
    ],
    owner:{
      type:mongoose.Schema.Types.ObjectId,
      ref:"user"
    },
    category:{
      type:String,
      enum:["Trending","Rooms","Iconic", "cities", "Mountains", "Castles", "Amazing pools", "Campaing",  "Farms Arctic" ]
    }
});

listingschema.post("findOneAndDelete", async(listing) => {
  if(listing){
    await review.deleteMany({ _id: {$in:listing.reviews}})
  }
});

const listing = mongoose.model("Listing",listingschema)
module.exports = listing;