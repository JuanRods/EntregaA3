const express = require('express');
const router = express.Router();
const db = require('../config/db');  // A instância do banco de dados

// Rota para listar todos os produtos
router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM produtos');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Rota para adicionar um novo produto
router.post('/', async (req, res) => {
    const { nome, preco, estoque } = req.body;
    try {
        const [result] = await db.query(
            'INSERT INTO produtos (nome, preco, estoque) VALUES (?, ?, ?)',
            [nome, preco, estoque]
        );
        res.status(201).json({
            id: result.insertId,
            nome,
            preco,
            estoque
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Rota para atualizar um produto
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { nome, preco, estoque } = req.body;
    try {
        const [result] = await db.query(
            'UPDATE produtos SET nome = ?, preco = ?, estoque = ? WHERE id = ?',
            [nome, preco, estoque, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Produto não encontrado' });
        }

        res.json({ message: 'Produto atualizado com sucesso!' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Rota para gerar relatório de produtos com baixo estoque
router.get('/relatorio/baixo-estoque', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM produtos WHERE estoque < 5');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
