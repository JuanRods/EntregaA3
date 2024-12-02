const express = require('express');
const router = express.Router();
const db = require('../config/db');  // Usando a instância de db com transações
const produtos = require('./produtos');  // Acesso aos produtos
const vendedores = require('./vendedores');  // Acesso aos vendedores
const clientes = require('./clientes');  // Acesso aos clientes

// Rota para adicionar uma nova venda
router.post('/', async (req, res) => {
    const { produtoId, vendedorId, clienteId, quantidade, total } = req.body;

    // Iniciar uma transação
    const connection = await db.getConnection();
    await connection.beginTransaction();

    try {
        // Verificar se o produto, vendedor e cliente existem
        const [produto] = await connection.query('SELECT * FROM produtos WHERE id = ?', [produtoId]);
        const [vendedor] = await connection.query('SELECT * FROM vendedores WHERE id = ?', [vendedorId]);
        const [cliente] = await connection.query('SELECT * FROM clientes WHERE id = ?', [clienteId]);

        if (!produto || !vendedor || !cliente) {
            // Se algum não for encontrado, reverter a transação
            await connection.rollback();
            return res.status(404).json({ message: 'Produto, Vendedor ou Cliente não encontrado' });
        }

        // Verificar se há estoque suficiente
        if (produto.estoque < quantidade) {
            await connection.rollback();  // Reverter transação em caso de estoque insuficiente
            return res.status(400).json({ message: 'Estoque insuficiente' });
        }

        // Inserir a venda
        const [result] = await connection.query(
            'INSERT INTO vendas (produto_id, vendedor_id, cliente_id, quantidade, total, status) VALUES (?, ?, ?, ?, ?, ?)', 
            [produtoId, vendedorId, clienteId, quantidade, total, 'finalizado']
        );

        // Atualizar o estoque do produto
        await connection.query('UPDATE produtos SET estoque = estoque - ? WHERE id = ?', [quantidade, produtoId]);

        // Se tudo ocorreu bem, commit na transação
        await connection.commit();

        // Resposta com a venda realizada
        res.status(201).json({
            id: result.insertId,
            produtoId,
            vendedorId,
            clienteId,
            quantidade,
            total,
            status: 'finalizado'
        });
    } catch (err) {
        // Caso algum erro aconteça, reverter a transação
        await connection.rollback();
        console.error('Erro ao processar a venda:', err.message);
        res.status(500).json({ error: 'Erro ao processar a venda. Tente novamente mais tarde.' });
    } finally {
        // Libera a conexão após a operação
        connection.release();
    }
});

module.exports = router;
