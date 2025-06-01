const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const PricesSchema = new Schema({
    basic_price : {type: String, required: true},
    luxurious_price : {type: String, required: true},
    nocturne_tax : {type: String, required: true},
});

// Export model
module.exports = mongoose.model("Prices", PricesSchema);