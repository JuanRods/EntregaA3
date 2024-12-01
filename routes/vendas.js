const express = require('express');
const router = express.Router();
const produtos = require('./produtos');  // Acesso ao estoque de produtos
const vendedores = require('./vendedores');  // Acesso aos vendedores
const clientes = require('./clientes');  // Acesso aos clientes

let vendas = [
    { id: 1, produtoId: 1, vendedorId: 2, clienteId: 3, quantidade: 2, total: 700, status: 'finalizado' },
    { id: 2, produtoId: 3, vendedorId: 1, clienteId: 1, quantidade: 1, total: 1200, status: 'finalizado' },
];

// Rota para listar uma venda específica
router.get('/:id', (req, res) => {
    const { id } = req.params; // Captura o ID da URL
    const venda = vendas.find(v => v.id === parseInt(id)); // Busca a venda pelo ID

    if (venda) {
        res.json(venda); // Retorna a venda encontrada
    } else {
        res.status(404).json({ message: 'Venda não encontrada' }); // Caso não encontre
    }
});


// Rota para listar todas as vendas
router.get('/', (req, res) => {
    res.json(vendas);
});

// Rota para adicionar uma nova venda
router.post('/', (req, res) => {
    const { produtoId, vendedorId, clienteId, quantidade, total } = req.body;

    // Verificar se o produto e o vendedor existem
    const produto = produtos.find(p => p.id === produtoId);
    const vendedor = vendedores.find(v => v.id === vendedorId);
    const cliente = clientes.find(c => c.id === clienteId);

    if (!produto || !vendedor || !cliente) {
        return res.status(404).json({ message: 'Produto, Vendedor ou Cliente não encontrado' });
    }

    // Verificar se há estoque suficiente
    if (produto.estoque < quantidade) {
        return res.status(400).json({ message: 'Estoque insuficiente' });
    }

    const novaVenda = {
        id: vendas.length + 1,
        produtoId,
        vendedorId,
        clienteId,
        quantidade,
        total,
        status: 'finalizado',
    };

    vendas.push(novaVenda);
    produto.estoque -= quantidade;  // Atualizar estoque

    res.status(201).json(novaVenda);
});

// Rota para cancelar uma venda
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    let venda = vendas.find(v => v.id == id);

    if (!venda) {
        return res.status(404).json({ message: 'Venda não encontrada' });
    }

    venda.status = 'cancelado';
    const produto = produtos.find(p => p.id === venda.produtoId);
    produto.estoque += venda.quantidade;  // Reverter estoque

    res.json({ message: 'Venda cancelada com sucesso', venda });
});

// Rota para gerar relatório de vendas por cliente
router.get('/relatorio/clientes/:clienteId', (req, res) => {
    const { clienteId } = req.params;
    const vendasCliente = vendas.filter(v => v.clienteId == clienteId);
    
    if (vendasCliente.length === 0) {
        return res.status(404).json({ message: 'Nenhuma venda encontrada para este cliente' });
    }

    res.json(vendasCliente);
});

module.exports = router;
