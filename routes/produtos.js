const express = require('express');
const router = express.Router();

let produtos = [
    { id: 1, nome: 'Placa-mãe', preco: 350, estoque: 10 },
    { id: 2, nome: 'Memória RAM', preco: 200, estoque: 5 },
    { id: 3, nome: 'Processador', preco: 1200, estoque: 2 },
];

// Rota para listar todos os produtos
router.get('/', (req, res) => {
    res.json(produtos);
});

// Rota para adicionar um novo produto
router.post('/', (req, res) => {
    const { nome, preco, estoque } = req.body;
    const novoProduto = { id: produtos.length + 1, nome, preco, estoque };
    produtos.push(novoProduto);
    res.status(201).json(novoProduto);
});

// Rota para atualizar um produto
router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { nome, preco, estoque } = req.body;
    let produto = produtos.find(p => p.id == id);

    if (!produto) {
        return res.status(404).json({ message: 'Produto não encontrado' });
    }

    produto.nome = nome;
    produto.preco = preco;
    produto.estoque = estoque;
    res.json(produto);
});

// Rota para gerar relatório de produtos com baixo estoque
router.get('/relatorio/baixo-estoque', (req, res) => {
    const baixoEstoque = produtos.filter(p => p.estoque < 5);
    res.json(baixoEstoque);
});

module.exports = router;
