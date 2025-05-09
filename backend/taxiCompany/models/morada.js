// models/morada.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Schema de Morada como subdocumento (sem _id próprio)
const MoradaSchema = new Schema({
  rua: { type: String, required: true },
  numero_porta: { type: Number, required: true },
  codigo_postal: { type: String, required: true },
  localidade: { type: String, required: true },
}, { _id: false });

module.exports = MoradaSchema;
