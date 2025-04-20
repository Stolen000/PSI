const Motorista = require("../models/motorista");
const asyncHandler = require("express-async-handler");


exports.motoristas_list = asyncHandler(async (req, res, next) => {
  const allMotoristas = await Motorista.find().exec();
  res.json(allMotoristas);
});


exports.motorista_create = asyncHandler(async (req, res, next) => {
  console.log('Motorista recebido:', req.body);
  const motorista = new Motorista({
    name: req.body.name,
    ano_nascimento: req.body.ano_nascimento,
    carta_conducao: req.body.carta_conducao,
    nif: req.body.nif,
    genero: req.body.genero,
    morada: req.body.morada,
  });

  motorista.save();
  res.status(201).json(motorista);

});




