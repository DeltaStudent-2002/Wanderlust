const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js"); // adjust if needed
const path = require("path");
const Mongo_Url = "mongodb://127.0.0.1:27017/wanderlust2";
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");

mongoose
  .connect(Mongo_Url)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.log("❌ MongoDB error:", err));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));
//Home Route
app.get("/", (req, res) => {
  res.send("Hello World");
});

app.use("/listings", listings);
app.use("/listings/:id/reviews", reviews);

app.use((err, req, res, next) => {
   let { statusCode=400, message="Page Not Found"} = err;
  res.status(statusCode).render("listings/error.ejs",{message})
});


  app.use((err, req, res, next) => {
  let { statusCode=500, message="something went wrong"} = err;
  res.status(statusCode).render("listings/error.ejs",{message})
  // res.status(statusCode).send(message);
});

app.listen(3000, () => {
  console.log("🚀 Server running on port 3000");
});
