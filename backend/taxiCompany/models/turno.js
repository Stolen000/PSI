const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const TurnoSchema = new Schema({
    motorista_id: { type: String, required: true},
    taxi_id: { type: String, required: true},
    inicio_turno: { type: Date, required: true},
    fim_turno: { type: Date, required: true},
    viagens_realizadas: { type: Number}
});

// Export model
module.exports = mongoose.model("Turno", TurnoSchema);