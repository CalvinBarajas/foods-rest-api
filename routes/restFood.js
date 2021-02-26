// dependencies
const router = require("express").Router();
const Food = require("../model/Food");
const User = require("../model/User");

// authentication middleware to check api key validity
const apiAuth = async (req, res, next) => {
  // authenticate user
  const isValid = await User.findOne({ _id: req.query.apikey });
  if (!isValid) {
    return res.status(401).send("Invalid API Key...");
  } else {
    next();
  }
};

// return only 1 food record/document.
// example: (GET) http://<domain name>/api/food?food=<food name>&apikey=<valid api key>
router.get("/", apiAuth, async (req, res) => {
  // extract food name from URL and search db
  const results = await Food.findOne({ food: req.query.food });
  // display results or error
  if (results) {
    return res.send(results);
  } else {
    return res.send("Unable To Find That Food...");
  }
});

// return all food records/documents in db.
// example: (GET) http://<domain name>/api/food/all?apikey=<valid api key>
router.get("/all", apiAuth, async (req, res) => {
  // display JSON list of all foods in DB
  const results = await Food.find();
  // display results or error
  if (results) {
    return res.send(results);
  } else {
    return res.send("Unable To Find Food List In DB...");
  }
});

// post a new FOOD and BENEFITS to db.
// **** NOTE: use application/x-www-form-urlencoded or JSON encoding.
// example: (POST) http://<domain name>/api/food?apikey=<valid api key>
router.post("/", apiAuth, async (req, res) => {
  // check that the food doesn't already exist
  const results = await Food.findOne({ food: req.body.food });
  if (results) return res.status(400).send("That Food Already Exists...");
  // create new food
  const food = new Food({
    food: req.body.food,
    benefits: req.body.benefits,
  });
  try {
    const savedFood = await food.save();
    res.send(savedFood);
  } catch (err) {
    return res.send(err);
  }
});

// finds existing record/document and updates all of it.
// **** NOTE: use application/x-www-form-urlencoded or JSON encoding.
// example: (PUT) http://<domain name>/api/food?food=<food name>&apikey=<valid api key>
router.put("/", apiAuth, async (req, res) => {
  // find and replace entire document with new document
  const replacedDoc = await Food.updateOne(
    { food: req.query.food },
    { food: req.body.food, benefits: req.body.benefits },
    null,
    (err, writeOpResult) => {
      if (err) {
        res.send(err);
      } else {
        res.send(writeOpResult);
      }
    }
  );
});

// finds existing record/document and updates part of it.
// **** NOTE: use application/x-www-form-urlencoded or JSON encoding.
// example: (PATCH) http://<domain name>/api/food?foodid=<id from db>&apikey=<valid api key>
router.patch("/", apiAuth, async (req, res) => {
  try {
    const id = req.query.foodid; // grab id from url
    const updates = req.body; // req body stores one or the other or both
    const result = await Food.findByIdAndUpdate(id, updates, {
      useFindAndModify: false,
    });
    res.send(result); // sends back document found before being modified
  } catch (err) {
    res.send(err);
  }
});

// finds and deletes entire record/document.
// **** NOTE: use application/x-www-form-urlencoded or JSON encoding.
// example: (DELETE) http://<domain name>/api/food?food=<food name>&apikey=<valid api key>
router.delete("/", apiAuth, async (req, res) => {
  // find the food in the database if it exists
  // query the url for food name
  const foodExists = await Food.findOne({ food: req.query.food });
  if (!foodExists) return res.status(400).send("That Food Does Not Exist...");
  
  // delete FOOD and BENEFIT from database
  const result = await Food.deleteOne({ food: req.query.food });
  if (result) return res.status(200).send("Food Deleted Successfully...");
});

module.exports = router;
