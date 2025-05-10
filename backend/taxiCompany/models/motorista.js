const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const MoradaSchema = require("./morada"); // importa o esquema da morada

const MotoristaSchema = new Schema({
  name: { type: String, required: true },
  ano_nascimento: { type: Number, required: true },
  carta_conducao: { type: Number, required: true },
  nif: { type: Number, required: true },
  genero: { type: String, enum: ['Masculino', 'Feminino'], required: true },
  morada: { type: MoradaSchema, required: true }, // usa o subdocumento
});

// Export model
module.exports = mongoose.model("Motorista", MotoristaSchema);
