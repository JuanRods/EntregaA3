const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Criar Cliente
router.post('/add', async (req, res) => {
    const { nome, email, telefone, endereco } = req.body; // Recebe os dados do cliente no corpo da requisição
    try {
        // Insere os dados do cliente na tabela 'clientes' do banco de dados
        const [result] = await db.query(
            'INSERT INTO clientes (nome, email, telefone, endereco) VALUES (?, ?, ?, ?)', 
            [nome, email, telefone, endereco]
        );
        // Retorna os dados do cliente recém-criado, incluindo o ID gerado
        res.status(201).json({
            message: 'Cliente criado com sucesso!',
            id: result.insertId, 
            nome, 
            email, 
            telefone, 
            endereco
        });
    } catch (err) {
        // Se ocorrer um erro ao inserir, retorna uma mensagem de erro
        res.status(500).json({
            error: 'Erro ao criar o cliente. Detalhes: ' + err.message
        });
    }
});

// Listar Clientes
router.get('/listar', async (req, res) => {
    try {
        // Faz a consulta para listar todos os clientes cadastrados
        const [rows] = await db.query('SELECT * FROM clientes');
        // Retorna os clientes encontrados
        res.json({
            message: 'Clientes listados com sucesso!',
            clientes: rows
        });
    } catch (err) {
        // Em caso de erro ao buscar os clientes, retorna uma mensagem de erro
        res.status(500).json({
            error: 'Erro ao listar os clientes. Detalhes: ' + err.message
        });
    }
});

// Buscar um Cliente específico
router.get('/buscar/:id', async (req, res) => {
    const { id } = req.params; // Pega o ID do cliente da URL
    try {
        // Faz a consulta para buscar o cliente específico pelo ID
        const [rows] = await db.query('SELECT * FROM clientes WHERE id = ?', [id]);
        
        if (rows.length === 0) {
            // Se não encontrar o cliente, retorna uma mensagem informando que não foi encontrado
            res.status(404).json({
                message: `Cliente com ID ${id} não encontrado.`
            });
        } else {
            // Se o cliente for encontrado, retorna os dados do cliente
            res.json({
                message: 'Cliente encontrado com sucesso!',
                cliente: rows[0]
            });
        }
    } catch (err) {
        // Em caso de erro ao buscar o cliente, retorna uma mensagem de erro
        res.status(500).json({
            error: 'Erro ao buscar o cliente. Detalhes: ' + err.message
        });
    }
});

// Atualizar Cliente
router.put('/att/:id', async (req, res) => {
    const { id } = req.params; // Pega o ID do cliente da URL
    const { nome, email, telefone, endereco } = req.body; // Recebe os dados atualizados do cliente
    try {
        // Atualiza os dados do cliente na tabela 'clientes' do banco de dados
        await db.query(
            'UPDATE clientes SET nome = ?, email = ?, telefone = ?, endereco = ? WHERE id = ?',
            [nome, email, telefone, endereco, id]
        );
        // Retorna uma mensagem de sucesso após a atualização
        res.json({
            message: `Cliente com ID ${id} atualizado com sucesso!`
        });
    } catch (err) {
        // Em caso de erro ao atualizar, retorna uma mensagem de erro
        res.status(500).json({
            error: 'Erro ao atualizar o cliente. Detalhes: ' + err.message
        });
    }
});

// Deletar Cliente
router.delete('/delete/:id', async (req, res) => {
    const { id } = req.params; // Pega o ID do cliente da URL
    try {
        // Deleta o cliente da tabela 'clientes' pelo ID
        await db.query('DELETE FROM clientes WHERE id = ?', [id]);
        // Retorna uma mensagem de sucesso após a exclusão
        res.json({
            message: `Cliente com ID ${id} deletado com sucesso!`
        });
    } catch (err) {
        // Em caso de erro ao deletar, retorna uma mensagem de erro
        res.status(500).json({
            error: 'Erro ao deletar o cliente. Detalhes: ' + err.message
        });
    }
});

module.exports = router;
