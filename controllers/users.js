const User = require("../models/user.js");

module.exports.renderSignupForm = (req, res) => {
  res.render("users/signup");
}

module.exports.renderLoginForm =  (req, res) => {
  res.render("users/login");
}

module.exports.login =  async (req, res) => {
    req.flash("success", "Welcome to Wanderlust! You are logged in.");
    res.redirect(res.locals.redirectUrl || "/listings");
  },

module.exports.signup =async (req, res) => {
    try {
      let { username, email, password } = req.body;
      const newUser = new User({ email, username });
      const registeredUser = await User.register(newUser, password);
      console.log(registeredUser);
      req.login(registeredUser, (err) => {
        if (err) {
          return next(err); ``
        }
        req.flash("success", "Welcome to Wanderlust!");
        res.redirect(req.session.redirectUrl);
      });
    } catch (e) {
      req.flash("error", e.message);
      res.redirect("signup");
    }
  };

  module.exports.logout =  (req, res) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "You have logged out!");
    res.redirect("/listings");
  });
}