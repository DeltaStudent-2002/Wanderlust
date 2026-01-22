const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapasync.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");
const {reviewSchema} = require("../schema.js");
const Review = require("../models/review.js"); 
const reviewController = require("../controllers/review.js");

// Validation middleware
const validateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

// Reviews
//Post Route
router.post("/",

  wrapAsync(reviewController.createReview)
);

//Delete Review Route
router.delete("/:reviewId",   

  wrapAsync(reviewController.deleteReview)
)
module.exports = router;