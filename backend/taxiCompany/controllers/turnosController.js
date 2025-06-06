const Turno = require("../models/turno");
const Motorista = require("../models/motorista");
const asyncHandler = require("express-async-handler");


exports.get_turnos_list = asyncHandler(async (req, res, next) => {
  const allTurno = await Turno.find()
    .exec();
  res.json(allTurno);
});

exports.patch_turno_mais_um = asyncHandler(async (req, res, next) => {
  const turno = await Turno.findById(req.params.id);
  if (!turno) {
    const err = new Error("Turno não encontrado");
    err.status = 404;
    return next(err); 
  }
  // Increment viagens_realizadas by 1
  turno.viagens_realizadas += 1;

  // Save the updated turno
  await turno.save();

  res.json(turno);  
});

exports.get_turnos_taxi = asyncHandler(async (req, res, next) => {
  const taxiId = req.params.taxi_id;
  const turnos = await Turno.find({ taxi_id: taxiId });
  res.json({ turnos });
});

exports.get_turno_by_id = asyncHandler(async (req, res, next) => {
  const turno = await Turno.findById(req.params.id);
  if(!turno){
    const err = new Error("Taxi não encontrado");
    err.status = 404;
    return next(err); 
  }
  res.json(turno);
}
);

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
      
      if(!turnos){
        return res.status(404).json({ message: 'Erro no buscar turnos por motorista' });
      }
      res.json(turnos); // Return the list of turnos
  } catch (err) {
      next(err); // Pass errors to the error handler middleware
  }
});


exports.turno_create = asyncHandler(async (req, res, next) => {
    const { motorista_id, taxi_id, periodo, viagens_realizadas } = req.body;
    try{
      if (!motorista_id || !taxi_id || !periodo || !periodo.inicio || !periodo.fim) {
        return res.status(400).json({ error: 'Missing required fields.' });
      }
      // Criar o objeto Taxi
      const turno = new Turno({
        motorista_id,
        taxi_id,
        periodo,
        viagens_realizadas
      });
      //aplicar aqui func que verifica todos os parametros
      //por agr serve

      // Salvar o táxi no banco de dados
      await turno.save();
      // Enviar a resposta com o táxi recém-criado e a lista de táxis
      res.status(201).json( turno );}
    catch(err) {
      console.error("Error saving turno:", err);
      res.status(500).json({ error: "Internal server error", details: err.message });
    }
  });

exports.turno_delete = asyncHandler(async (req, res, next) => {
  let turno = await Turno.findByIdAndDelete(req.params.id);
  if(!turno){
    const err = new Error("Turno não encontrado");
    err.status = 404;
    return next(err);
  }
  res.json({ message: "Turno deletado com sucesso", turno });
});


//Funcao apenas backend
exports.turno_delete_by_motorista = asyncHandler(async (req, res, next) => {
  let motoristaId = req.params.motorista_id;
  let result = await Turno.deleteMany({ motorista: motoristaId });
    if (result.deletedCount === 0) {
      const err = new Error("Nenhum turno encontrado para esse motorista");
      err.status = 404;
      return next(err);
    }
    res.json({message: "Turnos deletados com sucesso", deletedCount: result.deletedCount});
});



