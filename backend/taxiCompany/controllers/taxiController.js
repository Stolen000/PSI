const Taxi = require("../models/taxi");
const asyncHandler = require("express-async-handler");


exports.taxi_list = asyncHandler(async (req, res, next) => {
    const allTaxis = await Taxi.find()
      .lean()  // Convert the result to plain JavaScript objects
      .exec();
    res.json(allTaxis);
  });

exports.taxi_create = asyncHandler(async (req, res, next) => {
    res.json("Bruh");
});