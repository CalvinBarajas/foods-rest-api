// dependencies
const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");
const passport = require("passport");

// create schema
const userSchema = new mongoose.Schema({
  username: {
    type: String,    
    max: 255,
    min: 6
  },
  password: {
    type: String,    
    max: 1024,
    min: 6
  },
  date: {
    type: Date,
    default: Date.now
  }
});

// add passport plugin to schema (4th)
userSchema.plugin(passportLocalMongoose);

// create model
const User = mongoose.model("User", userSchema);

// using model, create strategy and transform cookie (PLM) (5th)
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
// make req.user._id and req.user.password available to all pages
passport.deserializeUser(User.deserializeUser());

module.exports = User;
