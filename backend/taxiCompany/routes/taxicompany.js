var express = require('express');
var router = express.Router();

const taxi_controller = require("../controllers/taxiController");
const motoristas_controller = require("../controllers/motoristasController");
const prices_controller = require("../controllers/pricesController");
const turnos_controller = require("../controllers/turnosController");
const viagem_controller = require("../controllers/viagemController");
const pedidos_controller = require("../controllers/pedidosViagemController");


//TAXIS
router.get("/taxis", taxi_controller.taxi_list);

router.post("/taxis", taxi_controller.taxi_create);

router.get("/taxis/:id", taxi_controller.taxi_get);

router.delete("/taxis/:id", taxi_controller.taxi_delete_post);


//PRICES
router.get("/prices", prices_controller.price_get);

router.put("/prices", prices_controller.price_update);

router.post("/prices", prices_controller.price_create);

//MOTORISTAS
router.get("/motoristas", motoristas_controller.motoristas_list);

router.get("/motoristas/:id", motoristas_controller.get_motorista_by_id);

router.post("/motoristas", motoristas_controller.motorista_create);

router.delete("/motoristas/:id", motoristas_controller.motorista_delete_post);

router.get("/pedidos", pedidos_controller.pedido_list);

//TURNOS
router.get("/turnos",turnos_controller.get_turnos_list);

router.get("/turnos/:motorista_id",turnos_controller.get_turnos_by_motorista);

router.post("/turnos",turnos_controller.turno_create);

router.post("/pedidos", pedidos_controller.pedido_create);
router.post("/viagem", viagem_controller.viagem_post)
router.delete("/turnos/:id",turnos_controller.turno_delete);

router.delete("/turnos/motorista/:motorista_id",turnos_controller.turno_delete_by_motorista);

router.get("/viagem/viagem-atual/:motorista_id", viagem_controller.viagem_mais_recente_turno_atual)

//PEDIDOS
router.get("/pedidos",pedidos_controller.pedido_list);

router.post("/pedidos",pedidos_controller.pedido_create);

router.delete("/pedidos/:id",pedidos_controller.pedido_delete);

router.put("/pedidos/:id",pedidos_controller.pedido_update);

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;
