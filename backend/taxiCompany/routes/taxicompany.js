var express = require('express');
var router = express.Router();

const taxi_controller = require("../controllers/taxiController");
const motoristas_controller = require("../controllers/motoristasController");
const prices_controller = require("../controllers/pricesController");
const turnos_controller = require("../controllers/turnosController");
const viagens_controller = require("../controllers/viagemController");
const pedidos_controller = require("../controllers/pedidosViagemController");


//TAXIS
router.get("/taxis", taxi_controller.taxi_list);

router.post("/taxis", taxi_controller.taxi_create);

router.get("/taxis/:id", taxi_controller.taxi_get);

router.delete("/taxis/:id", taxi_controller.taxi_delete_post);

router.put("/taxis/:id", taxi_controller.taxi_update_post);

//PRICES
router.get("/prices", prices_controller.price_get);

router.put("/prices", prices_controller.price_update);

router.post("/prices", prices_controller.price_create);

//MOTORISTAS
router.get("/motoristas", motoristas_controller.motoristas_list);

router.get("/motoristas/:id", motoristas_controller.get_motorista_by_id);

router.post("/motoristas", motoristas_controller.motorista_create);

router.delete("/motoristas/:id", motoristas_controller.motorista_delete_post);

router.put("/motoristas/:id", motoristas_controller.put_motorista_by_id);

//TURNOS
router.get("/turnos",turnos_controller.get_turnos_list);

router.get("/turnos/taxi/:taxi_id",turnos_controller.get_turnos_taxi);

router.get("/turnos/:motorista_id",turnos_controller.get_turnos_by_motorista);
//router.get("/turnos/motorista/:motorista_id",turnos_controller.get_turnos_by_motorista);

router.get("/turnos/turno/:id", turnos_controller.get_turno_by_id);

router.patch("/turnos/maisum/:id", turnos_controller.patch_turno_mais_um);

router.post("/turnos",turnos_controller.turno_create);

router.delete("/turnos/:id",turnos_controller.turno_delete);

router.delete("/turnos/motorista/:motorista_id",turnos_controller.turno_delete_by_motorista);

//PEDIDOS

router.get("/pedidos", pedidos_controller.pedido_list);

router.post("/pedidos",pedidos_controller.pedido_create);

router.delete("/pedidos/:id",pedidos_controller.pedido_delete);

router.put("/pedidos/:id/aceitar-pedido", pedidos_controller.aceitar_pedido);

router.put("/pedidos/:id",pedidos_controller.pedido_update);

router.put("/pedidos/:id/aguardar", pedidos_controller.aguardar_motorista);

router.put("/pedidos/:id/iniciar", pedidos_controller.iniciar_pedido_viagem);

router.put("/pedidos/:id/terminar", pedidos_controller.terminar_pedido_viagem);

//Viagens 
router.get("/viagens", viagens_controller.get_viagens_list);

router.get("/viagens/:id", viagens_controller.get_viagem_by_id);

router.get("/viagens/motorista/:id_motorista/total", viagens_controller.get_viagens_motorista);

router.post("/viagens", viagens_controller.viagem_create);

router.get("/viagens/viagem-atual/:motorista_id", viagens_controller.viagem_atual_by_motorista);

router.get("/viagens/:motorista_id", viagens_controller.viagens_by_motorista);

router.put("/viagens/:id/inicio", viagens_controller.viagem_update_inicio);

router.put("/viagens/:id/fim", viagens_controller.viagem_update_fim);

router.delete("/viagens/:id", viagens_controller.viagem_delete_by_id);

router.delete('/delete-all', viagens_controller.viagens_delete_all);

router.get("/viagens/taxi/:taxi_id", viagens_controller.get_viagem_by_taxi);




/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;
