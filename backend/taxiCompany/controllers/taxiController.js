const Taxi = require("../models/taxi");
const asyncHandler = require("express-async-handler");


exports.taxi_list = asyncHandler(async (req, res, next) => {
    const allTaxis = await Taxi.find()
      .lean()  // Convert the result to plain JavaScript objects
      .exec();
    res.json(allTaxis);
  });


  exports.taxi_create = asyncHandler(async (req, res, next) => {
    const { matricula, marca, modelo, ano_de_compra, nivel_de_conforto } = req.body;
  
    // Criar o objeto Taxi
    const taxi = new Taxi({
      matricula,
      marca,
      modelo,
      ano_de_compra,
      nivel_de_conforto
    });
  

    //aplicar aqui func que verifica todos os parametros
    //por agr serve

    // Salvar o táxi no banco de dados
    await taxi.save();
  
    // e) Buscar todos os táxis e ordená-los pela data de criação (mais recente primeiro)
    const todosTaxis = await Taxi.find().sort({ createdAt: -1 });
  
    // Enviar a resposta com o táxi recém-criado e a lista de táxis
    res.status(201).json({ taxi, taxis: todosTaxis });
  });

  exports.taxi_delete_post = asyncHandler(async (req, res, next) => {
    console.log("Estou aqui na função delete no backend");
    const taxi = await Taxi.findByIdAndDelete(req.params.id);
    if (!taxi) {
      const err = new Error("Taxi não encontrado");
      err.status = 404;
      return next(err); 
    }
    res.json({ message: "Taxi deletado com sucesso", taxi });

  });