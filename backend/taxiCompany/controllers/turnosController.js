const Turno = require("../models/turno");
const Motorista = require("../models/motorista");
const asyncHandler = require("express-async-handler");


exports.get_turnos_list = asyncHandler(async (req, res, next) => {
  const allTurno = await Turno.find()
    .exec();
  res.json(allTurno);
});

exports.get_turnos_by_motorista = asyncHandler(async (req, res, next) => {
  console.log("ID recebido:", req.params.motorista_id);
  try {
      const motoristaId = req.params.motorista_id;
      const motorista = await Motorista.findById(motoristaId).exec();
      if (!motorista) {
      return res.status(404).json({ message: 'Motorista não encontrado' });
      }
      // Query the Turno model directly by motorista_id
      const turnos = await Turno.find({ motorista_id: motoristaId }).exec();
      
      if (!turnos || turnos.length === 0) {
      return res.status(404).json({ message: 'Nenhum turno encontrado para este motorista' });
      }
      res.json(turnos); // Return the list of turnos
  } catch (err) {
      next(err); // Pass errors to the error handler middleware
  }
});


exports.turno_create = asyncHandler(async (req, res, next) => {
    const { motorista_id, taxi_id, inicio, fim } = req.body;
  
    // Criar o objeto Taxi
    const turno = new Turno({
      motorista_id,
      taxi_id,
      inicio,
      fim
    });
  

    //aplicar aqui func que verifica todos os parametros
    //por agr serve

    // Salvar o táxi no banco de dados
    await turno.save();
    // Enviar a resposta com o táxi recém-criado e a lista de táxis
    res.status(201).json( turno );
  });

