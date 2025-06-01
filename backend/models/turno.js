const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const PeriodoSchema = new Schema({
  inicio: { type: Date, required: true },
  fim: { type: Date, required: true }
});

const TurnoSchema = new Schema({
    motorista_id: { type: String, required: true},
    taxi_id: { type: String, required: true},
    periodo: { type: PeriodoSchema, required: true }, 
    viagens_realizadas: { type: Number}
});

// Export model
module.exports = mongoose.model("Turno", TurnoSchema);