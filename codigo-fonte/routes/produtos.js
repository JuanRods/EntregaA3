const express = require('express');
const router = express.Router();
const db = require('../config/db');  // A instância do banco de dados

// Rota para listar todos os produtos
router.get('/listar', async (req, res) => {
    try {
        // Consulta todos os produtos cadastrados no banco de dados
        const [rows] = await db.query('SELECT * FROM produtos');
        // Retorna os produtos encontrados
        res.json({
            message: 'Produtos listados com sucesso!',
            produtos: rows
        });
    } catch (err) {
        // Em caso de erro ao listar os produtos, retorna uma mensagem de erro
        res.status(500).json({
            error: 'Erro ao listar os produtos. Detalhes: ' + err.message
        });
    }
});

// Rota para adicionar um novo produto
router.post('/inserir', async (req, res) => {
    const { nome, preco, estoque } = req.body;  // Recebe os dados do novo produto
    try {
        // Insere o novo produto na tabela 'produtos' no banco de dados
        const [result] = await db.query(
            'INSERT INTO produtos (nome, preco, estoque) VALUES (?, ?, ?)',
            [nome, preco, estoque]
        );
        // Retorna os dados do produto recém-adicionado, incluindo o ID gerado
        res.status(201).json({
            message: 'Produto inserido com sucesso!',
            id: result.insertId,
            nome,
            preco,
            estoque
        });
    } catch (err) {
        // Em caso de erro ao adicionar o produto, retorna uma mensagem de erro
        res.status(500).json({
            error: 'Erro ao inserir o produto. Detalhes: ' + err.message
        });
    }
});

// Rota para atualizar um produto
router.put('/att/:id', async (req, res) => {
    const { id } = req.params;  // Recebe o ID do produto a ser atualizado
    const { nome, preco, estoque } = req.body;  // Recebe os dados atualizados do produto
    try {
        // Atualiza os dados do produto na tabela 'produtos' no banco de dados
        const [result] = await db.query(
            'UPDATE produtos SET nome = ?, preco = ?, estoque = ? WHERE id = ?',
            [nome, preco, estoque, id]
        );

        if (result.affectedRows === 0) {
            // Se nenhum produto foi afetado pela atualização, significa que o produto não foi encontrado
            return res.status(404).json({ message: 'Produto não encontrado' });
        }

        // Retorna uma mensagem de sucesso após a atualização
        res.json({ message: 'Produto atualizado com sucesso!' });
    } catch (err) {
        // Em caso de erro ao atualizar, retorna uma mensagem de erro
        res.status(500).json({
            error: 'Erro ao atualizar o produto. Detalhes: ' + err.message
        });
    }
});

// Rota para deletar um produto
router.delete('/delete/:id', async (req, res) => {
    const { id } = req.params;  // Recebe o ID do produto a ser deletado

    try {
        // Verificar se o produto existe antes de tentar deletar
        const [produto] = await db.query('SELECT * FROM produtos WHERE id = ?', [id]);

        if (produto.length === 0) {
            // Se o produto não for encontrado, retorna um erro 404
            return res.status(404).json({ message: 'Produto não encontrado' });
        }

        // Deleta o produto da tabela 'produtos' no banco de dados
        await db.query('DELETE FROM produtos WHERE id = ?', [id]);

        // Retorna uma mensagem de sucesso após a exclusão
        res.json({ message: 'Produto deletado com sucesso!' });
    } catch (err) {
        // Em caso de erro ao deletar, retorna uma mensagem de erro
        res.status(500).json({
            error: 'Erro ao deletar o produto. Detalhes: ' + err.message
        });
    }
});

module.exports = router;
