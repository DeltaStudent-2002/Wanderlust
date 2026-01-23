const express = require("express");
const router = express.Router();
const { listingSchema } = require("../schema");
const wrapAsync = require("../utils/wrapasync");
const ExpressError = require("../utils/ExpressError");
const { isLoggedIn, isOwner } = require("../middleware");

const listingController = require("../controllers/listing");

const multer = require("multer");
const { storage } = require("../cloudconfig.js");
const upload = multer({ storage });

// Validation middleware
const validateListing = (req, res, next) => {
  const { error } = listingSchema.validate(req.body);
  if (error) {
    const errMsg = error.details.map(el => el.message).join(",");
    throw new ExpressError(400, errMsg);
  }
  next();
};

// NEW
router.get("/new", isLoggedIn, listingController.renderNewForm);

// INDEX + CREATE
router.route("/")
  .get(wrapAsync(listingController.index))
  .post(
    isLoggedIn,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.createListing)
  );

// SHOW
router.get("/:id", wrapAsync(listingController.showListing));

// EDIT
router.get("/:id/edit", isLoggedIn, wrapAsync(listingController.renderEditForm));

// UPDATE
router.put(
  "/:id",
  isLoggedIn,
  upload.single("listing[image]"),
  validateListing,
  wrapAsync(listingController.updateListing)
);

// DELETE  ✅ FIXED
router.delete(
  "/:id",
  isLoggedIn,
  wrapAsync(listingController.deleteListing)
);

module.exports = router;
