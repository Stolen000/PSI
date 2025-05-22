const Viagem = require("../models/viagem");
const Turno = require("../models/turno");
const asyncHandler = require("express-async-handler");



exports.get_viagens_list = asyncHandler(async (req, res, next) => {
  const allViagens = await Viagem.find().exec();
  res.json(allViagens);
});

exports.viagem_create = asyncHandler(async (req, res, next) => {
  const { motorista_id, sequencia, turno_id, num_pessoas, coordenadas_origem, coordenadas_destino, pedido_id} = req.body;
  console.log("Dentro do create viagem do backend", pedido_id);
  try {
    console.log("Dados recebidos no backend:", req.body); // log full request body

    if (!turno_id || !motorista_id || !sequencia || !num_pessoas || !coordenadas_origem || !coordenadas_destino) {
      return res.status(400).json({ error: 'Missing required fields.' });
    }

    const viagem = new Viagem({
      turno_id,
      motorista_id,
      sequencia,
      num_pessoas,
      coordenadas_origem,
      coordenadas_destino,
      pedido_id
    });

    console.log("Viagem criada para guardar na base de dados:", viagem); // log Mongoose object
    console.log(viagem.pedido_id);
    await viagem.save();

    res.status(201).json(viagem);
  } catch (err) {
    console.error("Erro ao criar viagem:", err);
    res.status(500).json({ error: "Erro interno do servidor" });
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

  //funcao que recebe um Date que eh suposto ser a atualizaçao do inicioTime da viagem com base no id
exports.viagem_update_inicio = asyncHandler(async (req, res, next) => { 
    const viagem = await Viagem.findById(req.params.id);
    if (!viagem) {
        const err = new Error("Viagem não encontrada");
        err.status = 404;
        return next(err);
    }
    const { inicio_viagem } = req.body;
    if (!inicio_viagem) {
        const err = new Error("Inicio da viagem não pode ser nulo");
        err.status = 400;
        return next(err);
    }
    viagem.inicio_viagem = inicio_viagem;
    await viagem.save();
    res.status(200).json(viagem);
});

exports.viagem_update_fim = asyncHandler(async (req, res, next) => {
    const viagem = await Viagem.findById(req.params.id);
    if (!viagem) {
        const err = new Error("Viagem não encontrada");
        err.status = 404;
        return next(err);
    }
    const { fim_viagem } = req.body;
    if (!fim_viagem) {
        const err = new Error("Fim da viagem não pode ser nulo");
        err.status = 400;
        return next(err);
    }
    viagem.fim_viagem = fim_viagem; 
    await viagem.save();
    res.status(200).json(viagem);
});


exports.viagem_delete_by_id = asyncHandler(async (req, res, next)=> {
    const viagem = await Viagem.findByIdAndDelete(req.params.id);
    res.status(200).json(viagem);
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


exports.viagens_delete_all = asyncHandler(async (req, res, next) => {
  //console.log("Estou aqui");
    try {
      //console.log("Estou aqui 2");
        const result = await Viagem.deleteMany();
        //console.log("Estou aqui 3");
        res.status(200).json({ message: `Todas as viagens foram apagadas (${result.deletedCount} removidas).` });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao apagar viagens' });
    }
});


exports.get_viagem_by_taxi = asyncHandler(async (req, res, next) => {
  const taxiId = req.params.taxi_id;

  try {
    const turnos = await Turno.find({ taxi_id: taxiId });
    console.log("Turnos encontrados:", turnos);
    if (!turnos || turnos.length === 0) {
      return res.status(200).json({ status: -1 }); // Nenhum turno encontrado para esse táxi
    }

    // 2. Extrair os _ids dos turnos
    const turnoIds = turnos.map(turno => turno._id);

    // 3. Buscar se existe ao menos uma viagem associada a qualquer um desses turnos
    const viagem = await Viagem.findOne({ turno_id: { $in: turnoIds } });
    console.log("Viagem encontrada:", viagem);
    if (viagem) {
      return res.status(200).json({ status: 0 }); // Existe viagem → táxi não pode ser alterado
    } else {
      return res.status(200).json({ status: -1 }); // Nenhuma viagem associada → táxi pode ser alterado
    }

  } catch (err) {
    console.error("Erro ao buscar viagens do táxi:", err);
    res.status(500).json({ error: 'Erro interno ao buscar viagens do táxi' });
  }
});

