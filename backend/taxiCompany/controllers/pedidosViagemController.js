const Pedido = require("../models/pedido_viagem");
const Taxi = require("../models/taxi");
const asyncHandler = require("express-async-handler");  
const Motorista = require("../models/motorista");



exports.pedido_list = asyncHandler(async (req, res, next) => {
    const allPedidos = await Pedido.find()
      .lean()  // Convert the result to plain JavaScript objects
      .exec();
    res.json(allPedidos);
  });


  exports.pedido_create = asyncHandler(async (req, res, next) => {

    console.log("Pedido recebido:", JSON.stringify(req.body, null, 2));

    const { cliente_nome,
        cliente_nif,
        cliente_genero, 
          morada_origem,
          coordenadas_origem, 
          morada_destino, 
          coordenadas_destino,
          nivel_conforto, 
          numero_pessoas, 
          estado,
          tempo_estimado,
          custo_estimado} = req.body;

      // Criar o objeto Pedido
      const pedido = new Pedido({
          cliente_nome : cliente_nome,
          cliente_nif : cliente_nif,
          cliente_genero : cliente_genero,
          morada_origem : morada_origem,
          coordenadas_origem : coordenadas_origem,
          morada_destino : morada_destino,
          coordenadas_destino : coordenadas_destino,
          nivel_conforto : nivel_conforto,
          numero_pessoas : numero_pessoas,
          estado : estado,
          tempo_estimado : tempo_estimado,
          custo_estimado : custo_estimado
      });
  
      // Salvar o pedido no banco de dados
      await pedido.save();
  
      // e) Buscar todos os pedidos e ordená-los pela data de criação (mais recente primeiro)
      const todosPedidos = await Pedido.find().sort({ createdAt: -1 });
  
      // Enviar a resposta com o pedido recém-criado e a lista de pedidos
      res.status(201).json({ pedido, pedidos: todosPedidos });
  }
);

exports.pedido_delete = asyncHandler(async (req, res, next) => {
    const pedidoId = req.params.id;
  
    // Verifica se o pedido existe
    const pedido = await Pedido.findById(pedidoId);
    if (!pedido) {
      return res.status(404).json({ message: "Pedido não encontrado" });
    }
  
    // Remove o pedido
    await Pedido.findByIdAndDelete(pedidoId);
  
    // Envia a resposta de sucesso
    res.status(200).json({ message: "Pedido removido com sucesso" });
  }
);  

exports.aceitar_pedido = asyncHandler(async (req, res, next) => {
    const pedidoId = req.body.id; // Obtém o ID do pedido a partir do corpo da requisição
    const motoristaId = req.body.motoristaId; // Obtém o ID do motorista
    const taxiId = req.body.taxiId; // Obtém o ID do taxi
    const distanciaMotorista = req.body.distanciaMotorista; // Obtém a distância para o motorista
    const turno_id = req.body.turno_id;

    // Verifica se o ID do pedido foi enviado
    if (!pedidoId) {
        return res.status(400).json({ message: "ID do pedido é necessário." });
    }

    // Encontra o pedido no banco de dados
    const pedido = await Pedido.findById(pedidoId);
    
    // Verifica se o pedido foi encontrado
    if (!pedido) {
        return res.status(404).json({ message: "Pedido não encontrado." });
    }

    // Atualiza o estado do pedido para "aceite"
    pedido.estado = 'aceite';
    
    // Atualiza os dados do motorista, taxi e distância
    pedido.motorista = motoristaId;
    pedido.taxi = taxiId;
    pedido.distancia_motorista = distanciaMotorista;
    pedido.turno_id = turno_id;
    
    // Salva a atualização do pedido no banco de dados
    await pedido.save();
    
    // Retorna a resposta com o pedido atualizado
    res.status(200).json({ message: "Pedido aceito com sucesso.", pedido });
});



exports.pedido_update = asyncHandler(async (req, res, next) => {  
    const pedidoId = req.params.id;
  
    // Verifica se o pedido existe
    const pedido = await Pedido.findById(pedidoId);
    if (!pedido) {
      return res.status(404).json({ message: "Pedido não encontrado" });
    }
  
    // Atualiza os campos do pedido com os dados recebidos
    Object.assign(pedido, req.body);
  
    // Salva as alterações no banco de dados
    await pedido.save();
  
    // Envia a resposta com o pedido atualizado
    res.status(200).json({ message: "Pedido atualizado com sucesso", pedido });
  } 
);
