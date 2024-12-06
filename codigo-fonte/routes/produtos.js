const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Lista um Produtos
router.get('/listar', async (req, res) => {
    try {

        const [rows] = await db.query('SELECT * FROM produtos');

        res.json({
            message: 'Produtos listados com sucesso!',
            produtos: rows
        });
    } catch (err) {
        res.status(500).json({
            error: 'Erro ao listar os produtos. Detalhes: ' + err.message
        });
    }
});

// Insere um Produto
router.post('/inserir', async (req, res) => {
    const { nome, preco, estoque } = req.body;
    try {

        const [result] = await db.query(
            'INSERT INTO produtos (nome, preco, estoque) VALUES (?, ?, ?)',
            [nome, preco, estoque]
        );
        res.status(201).json({
            message: 'Produto inserido com sucesso!',
            id: result.insertId,
            nome,
            preco,
            estoque
        });
    } catch (err) {
        res.status(500).json({
            error: 'Erro ao inserir o produto. Detalhes: ' + err.message
        });
    }
});

// Busca um Produto específico
router.get('/buscar/:id', async (req, res) => {
    const { id } = req.params;

    try {
        
        const [rows] = await db.query('SELECT * FROM produtos WHERE id = ?', [id]);

        if (rows.length === 0) {
            return res.status(404).json({
                message: 'Produto não encontrado.'
            });
        }
        res.json({
            message: 'Produto encontrado com sucesso!',
            produto: rows[0]
        });
    } catch (err) {
        res.status(500).json({
            error: 'Erro ao buscar o produto. Detalhes: ' + err.message
        });
    }
});

// Atualiza um produto
router.put('/att/:id', async (req, res) => {
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
        res.status(500).json({
            error: 'Erro ao atualizar o produto. Detalhes: ' + err.message
        });
    }
});

// Deleta um produto
router.delete('/delete/:id', async (req, res) => {
    const { id } = req.params;

    try {

        const [produto] = await db.query('SELECT * FROM produtos WHERE id = ?', [id]);

        if (produto.length === 0) {
            return res.status(404).json({ message: 'Produto não encontrado' });
        }

        await db.query('DELETE FROM produtos WHERE id = ?', [id]);

        res.json({ message: 'Produto deletado com sucesso!' });
    } catch (err) {
        res.status(500).json({
            error: 'Erro ao deletar o produto. Detalhes: ' + err.message
        });
    }
});

module.exports = router;
