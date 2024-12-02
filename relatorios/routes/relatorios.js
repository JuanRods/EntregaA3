const express = require('express');
const relatoriosController = require('../controllers/relatorioController');

const router = express.Router();

// Rota para produtos mais vendidos
router.get('/produtos-mais-vendidos', relatoriosController.produtosMaisVendidos);

// Outras rotas de relatórios podem ser adicionadas aqui

module.exports = router;
