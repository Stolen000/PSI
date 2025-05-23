const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const PedidoViagemSchema = new Schema({
    cliente_nome: { type: String, required: true },
    cliente_nif: { type: Number, required: true },
    cliente_genero: { type: String, enum: ["Masculino", "Feminino"], required: true },
    morada_origem: {
      rua: { type: String, required: true },
      numero_porta: { type: Number, required: true },
      codigo_postal: { type: String, required: true },
      localidade: { type: String, required: true },
    },
    coordenadas_origem: {
      lat: { type: Number, required: true },
      lon: { type: Number, required: true },
    },
    morada_destino: {
      rua: { type: String, required: true },
      numero_porta: { type: Number, required: true },
      codigo_postal: { type: String, required: true },
      localidade: { type: String, required: true },
    },
    coordenadas_destino: {
      lat: { type: Number, required: true },
      lon: { type: Number, required: true },
    },
    nivel_conforto: { type: String, enum: ["basico", "luxuoso"], required: true },
    numero_pessoas: { type: Number, required: true },
    estado: { type: String, enum: ["pendente", "aceite", "aguardar motorista", "em curso", "terminada"], required: true },
    taxi: { type: String, default: null },
    distancia_motorista: { type: Number, default: null },
    tempo_estimado: { type: Number, default: null },
    custo_estimado: { type: Number, default: null },
    motorista: { type: String, default: null },
    turno_id: { type: String, default: null },
    custo_final: {type: Number, default: null},
    motoristas_rejeitados: { type: [String], default: [] },


});
// Virtual for author's URL
PedidoViagemSchema.virtual("url").get(function () {
  // We don't use an arrow function as we'll need the this object
  return `/pedidos/${this._id}`;
}); 
// Export model
module.exports = mongoose.model("PedidoViagem", PedidoViagemSchema);