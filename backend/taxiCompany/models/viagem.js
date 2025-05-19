// models/viagem.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const MoradaSchema = require("./morada");

const ViagemSchema = new Schema({
  turno_id: { type: String, required: true },
  motorista_id: {type: String, required: true},
  sequencia: { type: Number, required: true },
  inicio_viagem: { type: Date},
  fim_viagem: { type: Date  },
  num_pessoas: { type: Number, required: true },
  coordenadas_origem: {
    lat: { type: Number, required: true },
    lon: { type: Number, required: true },
  },
  coordenadas_destino: {
    lat: { type: Number, required: true },
    lon: { type: Number, required: true },
  },
  pedido_id: {type: String}
});

module.exports = mongoose.model("Viagem", ViagemSchema);
