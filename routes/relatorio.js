const express = require('express');
const router = express.Router();
const vendas = require('./vendas');
const produtos = require('./produtos');
const clientes = require('./clientes');

// Relatório de produtos mais vendidos
router.get('/produtos-mais-vendidos', (req, res) => {
    const vendasCount = vendas.reduce((acc, venda) => {
        acc[venda.produtoId] = (acc[venda.produtoId] || 0) + venda.quantidade;
        return acc;
    }, {});

    const produtosMaisVendidos = Object.keys(vendasCount).map(produtoId => {
        const produto = produtos.find(p => p.id == produtoId);
        return { produto, quantidadeVendida: vendasCount[produtoId] };
    }).sort((a, b) => b.quantidadeVendida - a.quantidadeVendida);

    res.json(produtosMaisVendidos);
});

// Relatório de consumo médio do cliente
router.get('/consumo-medio/:clienteId', (req, res) => {
    const { clienteId } = req.params;
    const vendasCliente = vendas.filter(v => v.clienteId == clienteId);
    
    if (vendasCliente.length === 0) {
        return res.status(404).json({ message: 'Nenhuma venda encontrada para este cliente' });
    }

    const totalGasto = vendasCliente.reduce((sum, venda) => sum + venda.total, 0);
    const consumoMedio = totalGasto / vendasCliente.length;

    res.json({ clienteId, consumoMedio });
});

module.exports = router;
