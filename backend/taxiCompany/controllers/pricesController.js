const Price = require("../models/prices");
const asyncHandler = require("express-async-handler");



exports.price_create = asyncHandler(async (req, res, next) => {
  const { basic_price, luxurious_price, nocturne_tax } = req.body;
  try {
    // Create a new price
    const price = new Price({
      basic_price: basic_price,
      luxurious_price: luxurious_price , 
      nocturne_tax: nocturne_tax,
    });
    // Save the hero to the database
    await price.save();

    // Return a success response with the created hero's details
    res.status(201).json({
      message: "Price created successfully",
      price: {
        basic_price: price.basic_price,
        luxurious_priceet: price.luxurious_price,
        nocturne_tax: price.nocturne_tax,
      },
    });
  } catch (err) {
    next(err);
  }
});


exports.price_get = asyncHandler(async (req, res, next) => {
    const prices = await Price.findOne();
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
    let prices = await Price.findOne();
  
    // Criar caso n exista
    if (!prices) {
      prices = new Price({ basic_price, luxurious_price, nocturne_tax });
    } else {
    //se ja existe preço, so dar update
      prices.basic_price = basic_price;
      prices.luxurious_price = luxurious_price;
      prices.nocturne_tax = nocturne_tax;
    }
    await prices.save();

    res.status(200).json({ message: "Prices updated successfully", prices });
  });