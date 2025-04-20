const Motorista = require("../models/motorista");
const asyncHandler = require("express-async-handler");


exports.motoristas_list = asyncHandler(async (req, res, next) => {
  res.json("Bruh1");
});


exports.motorista_create = asyncHandler(async (req, res, next) => {
  console.log('Motorista recebido:', req.body);
  const motorista = new Motorista({
    name: req.body.name,
    ano_nascimento: req.body.ano_nascimento,
    carta_conducao: req.body.carta_conducao,
    morada: req.body.morada
  });

  motorista.save();
  res.status(201).json({ message: 'Motorista recebido com sucesso!' });
});

