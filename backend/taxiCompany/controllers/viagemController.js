const Turno = require("../models/turno");
const Viagem = require("../models/viagem");
const asyncHandler = require("express-async-handler");

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
