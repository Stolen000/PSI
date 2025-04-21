const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const MoradaSchema = new Schema({
  numero_porta: { type: Number, required: true },
  rua: { type: String, required: true },
  codigo_postal: { type: String, required: true },
  localidade: { type: String, required: true },
});

module.exports = mongoose.model("Morada", MoradaSchema);
