const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Lista Vendedores
router.get('/listar', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM vendedores');
        res.json({
            message: 'Vendedores listados com sucesso!',
            vendedores: rows
        });
    } catch (err) {
        res.status(500).json({
            error: 'Erro ao listar os vendedores. Detalhes: ' + err.message
        });
    }
});

// Insere Vendedor
router.post('/inserir', async (req, res) => {
    const { nome, email, salario } = req.body;
    try {
        const [vendedorExistente] = await db.query('SELECT * FROM vendedores WHERE email = ?', [email]);
        if (vendedorExistente.length > 0) {
            return res.status(400).json({
                message: 'Já existe um vendedor cadastrado com este e-mail.'
            });
        }
        const [result] = await db.query(
            'INSERT INTO vendedores (nome, email, salario) VALUES (?, ?, ?)',
            [nome, email, salario]
        );
        const novoVendedor = {
            id: result.insertId,
            nome,
            email,
            salario
        };
        res.status(201).json({
            message: 'Vendedor foi adicionado com sucesso ao sistema.',
            vendedor: novoVendedor
        });
    } catch (err) {
        res.status(500).json({
            error: 'Erro ao inserir vendedor. Detalhes: ' + err.message
        });
    }
});

// Busca um Vendedor específico
router.get('/buscar/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await db.query('SELECT * FROM vendedores WHERE id = ?', [id]);
        if (rows.length === 0) {
            return res.status(404).json({
                message: 'Vendedor não encontrado.'
            });
        }
        res.json({
            message: 'Vendedor encontrado com sucesso!',
            vendedor: rows[0]
        });
    } catch (err) {
        res.status(500).json({
            error: 'Erro ao buscar vendedor. Detalhes: ' + err.message
        });
    }
});

// Atualiza Vendedor
router.put('/att/:id', async (req, res) => {
    const { id } = req.params;
    const { nome, email, salario } = req.body;
    try {
        const [result] = await db.query(
            'UPDATE vendedores SET nome = ?, email = ?, salario = ? WHERE id = ?',
            [nome, email, salario, id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Vendedor não encontrado' });
        }
        res.json({
            message: 'Vendedor atualizado com sucesso!',
            vendedor: { id, nome, email, salario }
        });
    } catch (err) {
        res.status(500).json({
            error: 'Erro ao atualizar vendedor. Detalhes: ' + err.message
        });
    }
});

// Deleta Vendedor
router.delete('/delete/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await db.query('DELETE FROM vendedores WHERE id = ?', [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Vendedor não encontrado' });
        }
        res.json({
            message: 'Vendedor deletado com sucesso'
        });
    } catch (err) {
        res.status(500).json({
            error: 'Erro ao deletar vendedor. Detalhes: ' + err.message
        });
    }
});

module.exports = router;
