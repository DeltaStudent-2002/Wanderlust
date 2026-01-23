const Listing = require("../models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geoCodingClient = mbxGeocoding({ accessToken:mapToken});

// INDEX
module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
};

// NEW FORM
module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
};

// SHOW
module.exports.showListing = async (req, res) => {
  const { id } = req.params;

  const listing = await Listing.findById(id)
    .populate("reviews")
    .populate("owner");

  if (!listing) {
    req.flash("error", "Cannot find that listing!");
    return res.redirect("/listings");
  }

  res.render("listings/show.ejs", { listing });
};

// CREATE
module.exports.createListing = async (req, res, next) => {
 let response = await geoCodingClient.forwardGeocode({
  query: req.body.listing.location,
  limit: 2
})
  .send();



  let url = req.file.path;
  let filename = req.file.filename;

  console.log(url, "..", filename);
  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  newListing.image = { url, filename };
newListing.geometry = response.body.features[0].geometry;
  await newListing.save();
  req.flash("success", "New listing created!");
  res.redirect("/listings");
};

// EDIT FORM
module.exports.renderEditForm = async (req, res) => {
  const { id } = req.params;

  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Cannot find that listing!");
    return res.redirect("/listings");
  }

  res.render("listings/edit.ejs", { listing });
};

// UPDATE
module.exports.updateListing = async (req, res) => {
  const { id } = req.params;
  let listing = await Listing.findByIdAndUpdate(id, {
    ...req.body.listing,
  });
  if (typeof req.file !== 'undefined') {
  let url = req.file.path;
  let filename = req.file.filename;
  listing.image = { url, filename };
  await listing.save();
  }
  req.flash("success", "Listing updated!");
  res.redirect(`/listings/${id}`);
};

// DELETE
module.exports.deleteListing = async (req, res) => {
  const { id } = req.params;

  await Listing.findByIdAndDelete(id);

  req.flash("success", "Listing deleted!");
  res.redirect("/listings");
};
