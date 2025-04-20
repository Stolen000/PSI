const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const MotoristaSchema = new Schema({
    name : {type: String, required: true},
    morada: { type: Schema.Types.ObjectId, ref: "Morada" },
    ano_nascimento : {type: Number, required: true},
    carta_conducao : {type: Number, required: true},
});



// Export model
module.exports = mongoose.model("Motorista", MotoristaSchema);
