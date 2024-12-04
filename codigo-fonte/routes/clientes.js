const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Cria Cliente
router.post('/add', async (req, res) => {
    const { nome, email, telefone, endereco } = req.body; 
    try {
        const [result] = await db.query(
            'INSERT INTO clientes (nome, email, telefone, endereco) VALUES (?, ?, ?, ?)', 
            [nome, email, telefone, endereco]
        );
        
        res.status(201).json({
            message: 'Cliente criado com sucesso!',
            id: result.insertId, 
            nome, 
            email, 
            telefone, 
            endereco
        });

    } catch (err) {
        res.status(500).json({
            error: 'Erro ao criar o cliente. Detalhes: ' + err.message
        });
    }
});

// Lista Clientes
router.get('/listar', async (req, res) => {
    try {
       
        const [rows] = await db.query('SELECT * FROM clientes');
       
        res.json({
            message: 'Clientes listados com sucesso!',
            clientes: rows
        });
    } catch (err) {
        res.status(500).json({
            error: 'Erro ao listar os clientes. Detalhes: ' + err.message
        });
    }
});

// Busca um Cliente específico
router.get('/buscar/:id', async (req, res) => {
    const { id } = req.params;
    try {
       
        const [rows] = await db.query('SELECT * FROM clientes WHERE id = ?', [id]);
        
        if (rows.length === 0) {
            
            res.status(404).json({
                message: `Cliente com ID ${id} não encontrado.`
            });
        } else {
           
            res.json({
                message: 'Cliente encontrado com sucesso!',
                cliente: rows[0]
            });
        }
    } catch (err) {
        
        res.status(500).json({
            error: 'Erro ao buscar o cliente. Detalhes: ' + err.message
        });
    }
});

// Atualiza Cliente
router.put('/att/:id', async (req, res) => {
    const { id } = req.params; 
    const { nome, email, telefone, endereco } = req.body; 
    try {
        
        await db.query(
            'UPDATE clientes SET nome = ?, email = ?, telefone = ?, endereco = ? WHERE id = ?',
            [nome, email, telefone, endereco, id]
        );
       
        res.json({
            message: `Cliente com ID ${id} atualizado com sucesso!`
        });
    } catch (err) {
 
        res.status(500).json({
            error: 'Erro ao atualizar o cliente. Detalhes: ' + err.message
        });
    }
});

// Deleta Cliente
router.delete('/delete/:id', async (req, res) => {
    const { id } = req.params; 
    try {
       
        await db.query('DELETE FROM clientes WHERE id = ?', [id]);
       
        res.json({
            message: `Cliente com ID ${id} deletado com sucesso!`
        });
    } catch (err) {
        
        res.status(500).json({
            error: 'Erro ao deletar o cliente. Detalhes: ' + err.message
        });
    }
});

module.exports = router;
