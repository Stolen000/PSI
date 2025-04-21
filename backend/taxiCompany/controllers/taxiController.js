const Taxi = require("../models/taxi");
const asyncHandler = require("express-async-handler");


exports.taxi_list = asyncHandler(async (req, res, next) => {
    const allTaxis = await Taxi.find()
      .lean()  // Convert the result to plain JavaScript objects
      .exec();
    res.json(allTaxis);
  });


  exports.taxi_create = asyncHandler(async (req, res, next) => {
    const { number, marca, modelo, ano_de_compra, nivel_de_conforto } = req.body;
  
    // a) Validação da matrícula (não pode ser só números ou só letras)
    const matriculaRegex = /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]+$/;
    if (!matriculaRegex.test(number)) {
      return res.status(400).json({ message: 'Matrícula inválida. Deve conter tanto letras quanto números.' });
    }
  
    //criar os tipos marca
    //e tipo modelo
    //abrir instancias deles aqui para verificar se existem e sao validos

    //const marcasValidas = ['Toyota', 'Volkswagen', 'Honda', 'Ford']; // Liste as marcas válidas aqui
    //const modelosValidos = ['Corolla', 'Gol', 'Civic', 'Focus']; // Liste os modelos válidos aqui
  
    if (!marcasValidas.includes(marca)) {
      return res.status(400).json({ message: 'Marca inválida.' });
    }
  
    if (!modelosValidos.includes(modelo)) {
      return res.status(400).json({ message: 'Modelo inválido.' });
    }
  
    // c) Verificação do ano de compra (não pode ser maior que o ano atual)
    const anoAtual = new Date().getFullYear();
    if (ano_de_compra > anoAtual) {
      return res.status(400).json({ message: 'O ano de compra não pode ser superior ao ano atual.' });
    }
  
    // d) Validação do nível de conforto (deve satisfazer a RIA 16)
    const niveisDeConfortoValidos = ['basico', 'intermedio']; // Adapte conforme a RIA 16
    if (!niveisDeConfortoValidos.includes(nivel_de_conforto)) {
      return res.status(400).json({ message: 'Nível de conforto inválido.' });
    }
  
    // Criar o objeto Taxi
    const taxi = new Taxi({
      number,
      marca,
      modelo,
      ano_de_compra,
      nivel_de_conforto
    });
  
    // Salvar o táxi no banco de dados
    await taxi.save();
  
    // e) Buscar todos os táxis e ordená-los pela data de criação (mais recente primeiro)
    const todosTaxis = await Taxi.find().sort({ createdAt: -1 });
  
    // Enviar a resposta com o táxi recém-criado e a lista de táxis
    res.status(201).json({ taxi, taxis: todosTaxis });
  });
