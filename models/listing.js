const mongoose = require("mongoose");
const { listingschema } = require("../schema");
const Schema = mongoose.Schema;
const Review = require("./reviews.js");

const listingSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: String,
    image: {
    filename: {
      type: String,
      default: "default_image"
    },
     
      url: {
        type: String,
      default:
        "https://media.istockphoto.com/id/1298863783/photo/floating-breakfast-on-infinity-pool-in-luxury-hotel.jpg?s=612x612&w=is&k=20&c=GQWeeBRoANXjQRs9d1f4LcbekzSrJrvrZvhDeGkc6f0=",
      set: (v) =>
        v === ""
          ? "https://media.istockphoto.com/id/1298863783/photo/floating-breakfast-on-infinity-pool-in-luxury-hotel.jpg?s=612x612&w=is&k=20&c=GQWeeBRoANXjQRs9d1f4LcbekzSrJrvrZvhDeGkc6f0="
          : v
    }
  },
    price: Number,
    location: String,
    country: String,
    reviews: [
      {
       type: Schema.Types.ObjectId,
       ref: "Review", 

      },
    ],
    owner:{
      type: Schema.Types.ObjectId,
      ref: "User",
    }
});

listingSchema.post("findOneAndDelete", async(listing) =>{
  if(listing){
    await Review.deleteMany({_id: { $in: listing.reviews}})
  }

})

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;



