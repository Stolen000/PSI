const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const MotoristaSchema = new Schema({
    name: { type: String, required: true },
    morada: {
      rua: { type: String, required: true },
      numero_porta: { type: Number, required: true },
      codigo_postal: { type: String, required: true },
      localidade: { type: String, required: true },
    },
    ano_nascimento: { type: Number, required: true },
    carta_conducao: { type: Number, required: true },
  });
  



// Export model
module.exports = mongoose.model("Motorista", MotoristaSchema);
