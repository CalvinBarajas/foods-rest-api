// dependencies
const mongoose = require("mongoose");

// create schema
const foodSchema = new mongoose.Schema({
  food: String,
  benefits: String,
});

// create model
const Food = mongoose.model("Food", foodSchema);

module.exports = Food;
