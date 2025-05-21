const express = require('express');
const router = express.Router();
const AguaModel = require('../models/aguaModel');

router.post('/adicionar', async (req, res) => {
  const { tempo, consumo } = req.body;
  if (!tempo || !consumo) return res.status(400).json({ erro: 'Dados inválidos' });

  const existe = await AguaModel.existeRegistro(tempo);
  if (existe) return res.status(400).json({ erro: 'Registro duplicado' });

  await AguaModel.adicionar(tempo, consumo);
  res.json({ sucesso: true });
});

router.get('/', async (req, res) => {
  const dados = await AguaModel.todos();
  res.json(dados);
});

module.exports = router;