const Listing = require("../models/listing.js");
const Review = require("../models/review.js");

module.exports.createReview = async (req, res) => {
  console.log(req.params.id);
  let listing = await Listing.findById(req.params.id);
  let newReviews = new Review(req.body.review);

  listing.reviews.push(newReviews);
  await newReviews.save();
  await listing.save();
    req.flash("success", "New Review Created!");
  console.log("newReview saved");
  res.redirect(`/listings/${listing._id}`);
}

module.exports.deleteReview = async (req, res) => {
  let { id, reviewId } = req.params;
  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
      req.flash("success", " Review Deleted!");
  res.redirect(`/listings/${id}`);
}