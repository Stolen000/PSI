
const Viagem = require("../models/viagem");
const Turno = require("../models/turno");
const asyncHandler = require("express-async-handler");



exports.get_viagens_list = asyncHandler(async (req, res, next) => {
  const allViagens = await Viagem.find().exec();
  res.json(allViagens);
});

exports.viagem_create = asyncHandler(async (req, res, next) => {
  const { turno_id, motorista_id, sequencia, num_pessoas, coordenadas_origem, coordenadas_destino} = req.body;
  try{
    if(!turno_id || !motorista_id ||  !sequencia || !num_pessoas || !coordenadas_origem || !coordenadas_destino){
      return res.status(400).json({ error: 'Missing required fields.' });
    }

    const viagem = new Viagem({
      turno_id,
      motorista_id,
      sequencia,
      num_pessoas,
      coordenadas_origem,
      coordenadas_destino
    });
    await viagem.save();

    res.status(201).json( viagem );}

  catch(err) {
  }
});

exports.get_viagem_by_id = asyncHandler(async (req, res, next) => {
  const viagem = await Viagem.findById(req.params.id);
  if(!viagem){
    const err = new Error("Taxi não encontrado");
    err.status = 404;
    return next(err); 
  }
  res.json(viagem);
}
);

exports.viagens_by_motorista = asyncHandler(async (req, res, next) => {
  let motorista_id = req.params.motorista_id;
  try{
    const motorista = await Motorista.findById(motoristaId).exec();
    if (!motorista) {
      return res.status(404).json({ message: 'Motorista não encontrado' });
    }
    const viagens = await Viagem.find({ motorista_id: motorista_id }).exec();

    if (!viagens || viagens.length === 0) {
      return res.status(404).json({ message: 'Nenhumas viagens encontradas para este motorista' });
    }
    res.json(viagens);
  }catch (err){
    next(err);
  }
});

exports.viagem_atual_by_motorista = asyncHandler(async (req, res, next) => {
  let motorista_id = req.params.motorista_id;

  try {
    // Get the current time
    const currentTime = new Date();

    // Find the turno for the motorista where the current time is between inicio and fim
    const turno = await Turno.findOne({
      motorista_id: motorista_id,
      "periodo.inicio": { $lte: currentTime }, // Start time must be before or equal to current time
      "periodo.fim": { $gte: currentTime }     // End time must be after or equal to current time
    });

    if (!turno) {
      return res.status(404).json({ message: "Turno não encontrado para o motorista dado" });
    }

    // Check the viagens_realizadas
    const viagensRealizadas = turno.viagens_realizadas;

    //Encontra a viagem atual
    const viagem = await Viagem.findOne({
      turno_id: turno._id,
      sequencia: viagensRealizadas,
      inicio_viagem: { $ne: null }, // not equal null
      fim_viagem: { $eq: null }     // equal null
    });

    if (!viagem) {
      return res.status(404).json({ message: "Viagem não encontrada ou já finalizada" });
    }
    res.json(viagem);
    
  } catch (err) {
    next(err);
  }
});



























exports.viagem_post = asyncHandler(async (req, res, next) => {
  const { turno_id, inicio_viagem, fim_viagem, num_pessoas, local_partida, local_chegada } = req.body;
  
  // 1. Buscar o turno para obter o número de viagens realizadas
  const turno = await Turno.findById(turno_id);
  
  if (!turno) {
    return res.status(404).json({ message: "Turno não encontrado" });
  }

  // 2. Determinar a sequência (incrementa o número de viagens realizadas)
  const sequencia = turno.viagens_realizadas + 1;

  // 3. Criar a nova viagem
  const viagem = new Viagem({
    turno_id,
    sequencia,
    inicio_viagem,
    fim_viagem,
    num_pessoas,
    local_partida,
    local_chegada
  });

  // 4. Salvar a nova viagem
  await viagem.save();

  // 5. Atualizar o número de viagens realizadas no turno
  turno.viagens_realizadas += 1;
  await turno.save();

  res.status(201).json(viagem);
});


exports.viagens_do_motorista = asyncHandler(async (req, res, next) => {
    const { motorista_id } = req.body;
  
    // 1. Buscar todos os turnos do motorista
    const turnos = await Turno.find({ motorista_id });
  
    if (turnos.length === 0) {
      return res.status(404).json({ message: "Nenhum turno encontrado para este motorista." });
    }
  
    // 2. Extrair os ids dos turnos
    const turnoIds = turnos.map(turno => turno._id);
  
    // 3. Buscar todas as viagens associadas a esses turnos
    const viagens = await Viagem.find({ turno_id: { $in: turnoIds } });
  
    res.status(200).json(viagens);
  });

exports.viagem_mais_recente_turno_atual = asyncHandler(async (req, res) => {
  const { motorista_id } = req.params;
  const agora = new Date();

  // Buscar turno atual
  const turnoAtual = await Turno.findOne({
      motorista_id,
      inicio_turno: { $lte: agora },
      fim_turno: { $gte: agora }
  });

  if (!turnoAtual) {
      return res.status(404).json({ message: "Turno atual não encontrado" });
  }

  // Buscar viagem com maior sequência
  const ultimaViagem = await Viagem.findOne({ turno_id: turnoAtual._id }).sort({ sequencia: -1 });

  res.status(200).json({
      turno: turnoAtual,
      viagem: ultimaViagem || null
  });
});
