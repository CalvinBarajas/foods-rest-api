///////////////////////////////////
// Calvin Barajas Foods REST API
// MongoDB, ExpressJS, NodeJS
// Sacramento, CA
///////////////////////////////////

//jshint esversion:6
// general dependencies
const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

// passport dependencies (1st)
const passport = require("passport");
const session = require("express-session");

// instantiate new express app
const app = express();

// middleware
app.set("view engine", "ejs"); // view engine (e.g., Handlebars)
app.use(express.static("public")); // for accessing css and img files
app.use(express.json()); // parses json data
app.use(express.urlencoded({ extended: false })); // parses application/x-www-form-urlencoded data

// express-session middleware (2nd)
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

// passport middleware (initialize & session) (3rd)
app.use(passport.initialize());
app.use(passport.session());

// remote db connection (mongodb atlas)
const username = process.env.MONGO_API_USERNAME;
const pwd = process.env.MONGO_API_PWD;
const db = process.env.DB_NAME;
mongoose.connect(
  `mongodb+srv://${username}:${pwd}@cluster0.sxgvv.mongodb.net/${db}?retryWrites=true&w=majority`,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => {
    console.log("successfully connected to remote db...");
  }
);

// import routes
const authRoute = require("./routes/auth");
const restFoodRoute = require("./routes/restFood");

// view routes
app.get("/", (req, res) => {
  res.render("home");
});

// route middlewares
app.use("/api/user", authRoute);
app.use("/api/food", restFoodRoute);

// Begin listening on port
// code source: https://devcenter.heroku.com/articles/preparing-a-codebase-for-heroku-deployment
let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

// start server
app.listen(port, () => {
  console.log(`server started on port ${port}...`);
});
