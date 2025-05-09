const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const PedidoViagemSchema = new Schema({
    cliente_nome: { type: String, required: true },
    cliente_nif: { type: String, required: true },
    cliente_genero: { type: String, enum: ["masculino", "feminino"], required: true },
    morada_origem: { type: String, required: true },
    morada_destino: { type: String, required: true },
    nivel_conforto: { type: String, enum: ["basico", "luxuoso"], required: true },
    numero_pessoas: { type: String, required: true },
    estado: { type: String, enum: ["pendente", "aceite", "recusada"], required: true },
    taxi: { type: Schema.Types.ObjectId, ref: "Taxi" , default: null },
    distancia_motorista: { type: Number, default: null },
    tempo_estimado: { type: Number, default: null },
    custo_estimado: { type: Number, default: null },
    motorista: { type: Schema.Types.ObjectId, ref: "Motorista" , default: null },

});
// Virtual for author's URL
PedidoViagemSchema.virtual("url").get(function () {
  // We don't use an arrow function as we'll need the this object
  return `/pedidos/${this._id}`;
}); 
// Export model
module.exports = mongoose.model("PedidoViagem", PedidoViagemSchema);