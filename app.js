const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js"); // adjust if needed
const path = require("path");
const Mongo_Url = "mongodb://127.0.0.1:27017/wanderlust";
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("./models/user.js");

const session = require("express-session");
const flash = require("connect-flash");

const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

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

const sessionOptions = {
  secret: "mysupersecretcode",
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 1000 *  7 * 24 * 60 * 60 * 1000,
    httpOnly: true
  }
};

app.use(session(sessionOptions)); 
app.use(flash());


app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  console.log(res.locals.success);
  res.locals.error = req.flash("error");
  res.locals.currentUser = req.user;
  next();
});
//Home Route
app.get("/", (req, res) => {
  res.send("Hello World");
});

app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);

app.use((err, req, res, next) => {
   let { statusCode=400, message="Page Not Found"} = err;
  res.status(statusCode).render("listings/error.ejs",{message})
});


  app.use((err, req, res, next) => {
  let { statusCode=500, message="something went wrong"} = err;
  res.status(statusCode).render("listings/error.ejs",{message})
  // res.status(statusCode).send(message);
});

// app.get("/demoUser", async (req, res) => {
//   let fakeUser = new User({ 
//     email: "chris@gmailcom",
//     username: "chris"
//    });
//   let registeredUser = await User.register(fakeUser, "helloworld");
//   res.send(registeredUser);
// });


app.listen(3000, () => {
  console.log("🚀 Server running on port 3000");
});
