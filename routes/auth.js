// dependencies
const router = require("express").Router();
const User = require("../model/User");
const passport = require("passport");
const registerValidation = require("../validation");

// convert username to lower-case (middleware)
const usernameToLowerCase = (req, res, next) => {
  req.body.username = req.body.username.toLowerCase();
  next();
};

/* ======= POST ROUTES ======= */

router.post("/register", usernameToLowerCase, (req, res) => {
  // validate data before using it
  const { error } = registerValidation(req.body);
  if (error)
    return res
      .status(400)
      .render("register", { msg: error.details[0].message });

  // register (PLM)
  // prettier-ignore
  User.register({ username: req.body.username }, req.body.password, (err, user) => {
      if (err) {
        // if user already exists, a message will be displayed
        return res.render("register", { msg: err.message });
      } else {
        // force user to login after registering successfully
        return res.render("login", {
          msg: "You registered successfully, please log in...",
        });
      }
    }
  );
});

router.post("/login", usernameToLowerCase, (req, res, next) => {
  // generate session for a user
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return next(err); // will generate a 500 error
    }
    if (!user) {
      return res.render("login", { msg: "authentication failed" });
    }
    req.login(user, (loginErr) => {
      if (loginErr) {
        return next(loginErr);
      }
      return res.render("apikey", {
        key: req.user._id,
        username: req.user.username,
      }); // display API key
    });
  })(req, res, next);
});

/* ======= GET/VIEW ROUTES ======= */

router.get("/register", (req, res) => {
  // check that user is not already logged in
  if (req.isAuthenticated()) {
    return res.render("register", {
      msg: "you are already logged in...",
    });
  } else {
    return res.render("register");
  }
});

router.get("/login", (req, res) => {
  // check that user is not already logged in
  if (req.isAuthenticated()) {
    return res.render("login", {
      msg: "you are already logged in...",
    });
  } else {
    return res.render("login");
  }
});

router.get("/apikey", (req, res) => {
  // restricted access granted only to those who have logged in
  if (req.isAuthenticated()) {
    return res.render("apikey", {
      // read id and username from cookie
      // was using req["user"]._id before
      key: req.user._id,
      username: req.user.username,
    }); // display key
  } else {
    return res.render("login", {
      msg: "please log in to access your API key...",
    });
  }
});

router.get("/logout", (req, res) => {
  req.logout();
  res.render("home");
});

router.get("/guide", (req, res) => {
  res.render("guide");
});

module.exports = router;
