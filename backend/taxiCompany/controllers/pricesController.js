const Prices = require("../models/prices");
const asyncHandler = require("express-async-handler");




exports.price_get = asyncHandler(async (req, res, next) => {
    const prices = await Prices.findOne();
    if (!prices) {
        return res.status(404).json({ message: "Prices nao existem." });
    }
    res.status(200).json(prices);
});

exports.price_update = asyncHandler(async (req, res, next) => {
    const { basic_price, luxurious_price, nocturne_tax } = req.body;

    //Valida o input para existencia + negativos
    if (
      !basic_price || !luxurious_price || !nocturne_tax ||
      isNaN(basic_price) || basic_price <= 0 ||
      isNaN(luxurious_price) || luxurious_price <= 0 ||
      isNaN(nocturne_tax) || nocturne_tax < 0
    ) {
      return res.status(400).json({ error: "Invalid input data" });
    }
  
    //Vai buscar o unico preco na db
    let prices = await Prices.findOne();
  
    // Criar caso n exista
    if (!prices) {
      prices = new Prices({ basic_price, luxurious_price, nocturne_tax });
    } else {
    //se ja existe preço, so dar update
      prices.basic_price = basic_price;
      prices.luxurious_price = luxurious_price;
      prices.nocturne_tax = nocturne_tax;
    }
  
    // ✅ 5. Save to DB
    await prices.save();
  
    // ✅ 6. Respond
    res.status(200).json({ message: "Prices updated successfully", prices });
  });