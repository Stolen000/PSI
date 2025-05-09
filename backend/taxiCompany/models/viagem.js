// models/viagem.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const MoradaSchema = require("./morada");

const ViagemSchema = new Schema({
  turno_id: { type: String, required: true },
  sequencia: { type: Number, required: true },
  inicio_viagem: { type: Date, required: true },
  fim_viagem: { type: Date, required: true },
  num_pessoas: { type: Number, required: true },
  local_partida: { type: MoradaSchema, required: true },
  local_chegada: { type: MoradaSchema, required: true },
});

module.exports = mongoose.model("Viagem", ViagemSchema);
