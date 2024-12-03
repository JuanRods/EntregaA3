const express = require('express');
const router = express.Router();
const db = require('../config/db'); // Importando a configuração do banco de dados

// Rota para listar todos os vendedores
router.get('/listar', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM vendedores');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Rota para adicionar um novo vendedor
router.post('/inserir', async (req, res) => {
    const { nome, email, salario } = req.body;
    try {
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
            message: 'Não foi possível adicionar o vendedor ao sistema.',
            error: err.message
        });
    }
});


// Rota para atualizar um vendedor
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

        res.json({ id, nome, email, salario });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Rota para excluir um vendedor
router.delete('/delete/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await db.query('DELETE FROM vendedores WHERE id = ?', [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Vendedor não encontrado' });
        }

        res.status(204).send();
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
