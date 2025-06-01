const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const TaxiSchema = new Schema({
    matricula: { type: String, required: true },
    marca: { type: String },
    modelo: { type: String },
    ano_de_compra: { type: String , required: true},
    nivel_de_conforto: { type: String, enum: ["basico", "luxuoso"], required: true },
});

// Virtual for author's URL
TaxiSchema.virtual("url").get(function () {
  // We don't use an arrow function as we'll need the this object
  return `/taxi/${this._id}`;
});

// Export model
module.exports = mongoose.model("Taxi", TaxiSchema);