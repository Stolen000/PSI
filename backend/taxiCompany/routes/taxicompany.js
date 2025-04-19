var express = require('express');
var router = express.Router();

const taxi_controller = require("../controllers/taxiController");

router.get("/taxis", taxi_controller.taxi_list);

router.post("/taxis", taxi_controller.taxi_create);


router.get("/prices", prices_controller.price_get);

router.put("/prices", prices_controller.price_update);


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;
