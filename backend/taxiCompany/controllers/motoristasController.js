const Motorista = require("../models/motorista");
const asyncHandler = require("express-async-handler");


exports.motoristas_list = asyncHandler(async (req, res, next) => {
  const allMotoristas = await Motorista.find().sort({ updatedAt: -1 }).exec();
  res.json(allMotoristas);
});

exports.get_motorista_by_id = asyncHandler(async (req, res, next) => {
  console.log("ID recebido:", req.params.id);
  try {
    const motorista = await Motorista.findById(req.params.id).exec();
    if (!motorista) {
      return res.status(404).json({ message: 'Motorista não encontrado' });
    }
    res.json(motorista);
  } catch (err) {
    next(err);
  }
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


exports.motorista_delete_post = asyncHandler(async (req, res, next) => {
  console.log("Estou aqui na função delete no backend");
  const motorista = await Motorista.findByIdAndDelete(req.params.id);
  if (!motorista) {
    const err = new Error("Motorista não encontrado");
    err.status = 404;
    return next(err); // isto ativa o middleware de erro e renderiza a página de erro
  }
  res.json({ message: "Motorista deletado com sucesso", motorista });

});

exports.put_motorista_by_id = asyncHandler(async (req, res, next) => {
  const motoristaId = req.params.id;

  try {
    const updatedMotorista = await Motorista.findByIdAndUpdate(
      motoristaId,
      {
        name: req.body.name,
        ano_nascimento: req.body.ano_nascimento,
        carta_conducao: req.body.carta_conducao,
        nif: req.body.nif,
        genero: req.body.genero,
        morada: req.body.morada,
      },{ new: true }
    );

    if (!updatedMotorista) {
      return res.status(404).json({ message: 'Motorista não encontrado.' });
    }

    console.log(updatedMotorista);
    res.status(200).json({ message: 'Motorista atualizado com sucesso', motorista: updatedMotorista });
  } catch (error) {
    console.error('Erro ao fazer PUT no motorista:', error);
    res.status(500).json({ message: 'Erro no servidor ao atualizar o motorista.' });
  }
});



