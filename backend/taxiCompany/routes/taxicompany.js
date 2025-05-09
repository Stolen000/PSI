var express = require('express');
var router = express.Router();

const taxi_controller = require("../controllers/taxiController");
const motoristas_controller = require("../controllers/motoristasController");
const prices_controller = require("../controllers/pricesController");
const turnos_controller = require("../controllers/turnosController");



router.get("/taxis", taxi_controller.taxi_list);

router.post("/taxis", taxi_controller.taxi_create);

router.get("/prices", prices_controller.price_get);

router.put("/prices", prices_controller.price_update);

router.post("/prices", prices_controller.price_create);

router.get("/motoristas", motoristas_controller.motoristas_list);

router.get("/motoristas/:id", motoristas_controller.get_motorista_by_id);

router.post("/motoristas", motoristas_controller.motorista_create);

router.delete("/motoristas/:id", motoristas_controller.motorista_delete_post);

router.get("/turnos",turnos_controller.get_turnos_list);

router.get("/turnos/:motorista_id",turnos_controller.get_turnos_by_motorista);




/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;
