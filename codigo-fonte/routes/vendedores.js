const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Função para tratar erros de conexão ao banco
const handleDatabaseError = (err) => {
    if (err.code === 'ECONNREFUSED') {
        return 'Falha ao conectar ao banco de dados. O servidor pode estar inativo ou a configuração de rede está incorreta.';
    }
    return 'Erro ao conectar ao banco de dados. Detalhes: ' + err.message;
};

// Lista Vendedor
router.get('/listar', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM vendedores');
        res.json({
            message: 'Vendedores listados com sucesso!',
            vendedores: rows
        });
    } catch (err) {
        // Trata erro de conexão ou outro tipo de erro
        const errorMessage = handleDatabaseError(err);
        res.status(500).json({ error: errorMessage });
    }
});

// Insere Vendedor
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
        const errorMessage = handleDatabaseError(err);
        res.status(500).json({
            message: 'Não foi possível adicionar o vendedor ao sistema.',
            error: errorMessage
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

        res.json({ message: 'Vendedor atualizado com sucesso!', id, nome, email, salario });
    } catch (err) {
        const errorMessage = handleDatabaseError(err);
        res.status(500).json({ error: errorMessage });
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

        res.status(204).send();
    } catch (err) {
        // Trata erro de conexão ou outro tipo de erro
        const errorMessage = handleDatabaseError(err);
        res.status(500).json({ error: errorMessage });
    }
});

module.exports = router;
