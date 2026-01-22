const Listing = require("../models/listing");

module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
}

module.exports.renderNewForm =  (req, res) => {
  res.render("listings/new.ejs");
}

module.exports.showListing = (async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id).populate("reviews").populate("owner");
 if(!listing){
  req.flash("error", "Cannot find that listing!");
  return res.redirect("/listings");
 }
 console.log(listing);
  res.render("listings/show.ejs", { listing });
})

module.exports.createListing = async (req, res) => {
    let result = listingSchema.validate(req.body);
    console.log(result);
    if(result.error){
      throw new ExpressError(400, result.error);
    }
    const listing = new Listing(req.body.listing);
    listing.owner = req.user._id;
    consolelog(user)
    await listing.save();
    
    res.redirect("/listings");
}

module.exports.renderEditForm = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
   if(!listing){
  req.flash("error", "Cannot find that listing!");
  return res.redirect("/listings");
 }
  res.render("listings/edit.ejs", { listing });
}

module.exports.updateListing = async(req,res)=>{
  let {id} = req.params;
  await Listing.findByIdAndUpdate(id,{...req.body.listing});
     req.flash("success", "Listing Updated!");
  res.redirect(`/listings/${id}`);
}

module.exports.deleteListing = async (req, res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
  req.flash("success", " Deleted a listing!");
  res.redirect("/listings");
}