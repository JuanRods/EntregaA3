const express = require('express');
const router = express.Router();
const db = require('../config/db');  // A instância do banco de dados

// Rota para listar todos os pedidos
router.get('/', async (req, res) => {
    try {
        const [pedidos] = await db.query('SELECT * FROM pedidos');
        res.json(pedidos);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Rota para criar um novo pedido de venda
router.post('/', async (req, res) => {
    const { itens } = req.body;  // Expectativa de que 'itens' seja um array de objetos com {produto_id, quantidade}

    try {
        // Iniciar uma transação
        await db.query('START TRANSACTION');

        // Inserir o pedido
        const [resultPedido] = await db.query('INSERT INTO pedidos (status) VALUES (?)', ['pendente']);
        const pedidoId = resultPedido.insertId;

        // Inserir os itens do pedido
        for (const item of itens) {
            const { produto_id, quantidade } = item;

            // Verificar se o estoque do produto é suficiente
            const [produto] = await db.query('SELECT estoque, preco FROM produtos WHERE id = ?', [produto_id]);
            if (produto.length === 0) {
                return res.status(404).json({ message: 'Produto não encontrado' });
            }

            if (produto[0].estoque < quantidade) {
                return res.status(400).json({ message: `Estoque insuficiente para o produto ${produto_id}` });
            }

            // Inserir item do pedido
            await db.query('INSERT INTO itens_pedido (pedido_id, produto_id, quantidade, preco_unitario) VALUES (?, ?, ?, ?)', 
                [pedidoId, produto_id, quantidade, produto[0].preco]);

            // Atualizar o estoque do produto
            await db.query('UPDATE produtos SET estoque = estoque - ? WHERE id = ?', [quantidade, produto_id]);
        }

        // Finalizar a transação
        await db.query('COMMIT');
        res.status(201).json({ message: 'Pedido criado com sucesso!', pedidoId });
    } catch (err) {
        // Reverter transação em caso de erro
        await db.query('ROLLBACK');
        res.status(500).json({ error: err.message });
    }
});

// Rota para cancelar um pedido
router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        // Iniciar uma transação
        await db.query('START TRANSACTION');

        // Verificar se o pedido existe
        const [pedido] = await db.query('SELECT * FROM pedidos WHERE id = ?', [id]);
        if (pedido.length === 0) {
            return res.status(404).json({ message: 'Pedido não encontrado' });
        }

        // Cancelar o pedido
        await db.query('UPDATE pedidos SET status = ? WHERE id = ?', ['cancelado', id]);

        // Recuperar os itens do pedido
        const [itens] = await db.query('SELECT * FROM itens_pedido WHERE pedido_id = ?', [id]);

        // Reverter a quantidade dos produtos no estoque
        for (const item of itens) {
            const { produto_id, quantidade } = item;
            await db.query('UPDATE produtos SET estoque = estoque + ? WHERE id = ?', [quantidade, produto_id]);
        }

        // Finalizar a transação
        await db.query('COMMIT');
        res.json({ message: 'Pedido cancelado com sucesso!' });
    } catch (err) {
        // Reverter transação em caso de erro
        await db.query('ROLLBACK');
        res.status(500).json({ error: err.message });
    }
});

router.get('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        // Buscar o pedido pelo ID
        const [pedido] = await db.query('SELECT * FROM pedidos WHERE id = ?', [id]);

        if (pedido.length === 0) {
            return res.status(404).json({ message: 'Pedido não encontrado.' });
        }

        // Buscar os itens relacionados ao pedido
        const [itens] = await db.query(
            `SELECT i.produto_id, p.nome AS produto_nome, i.quantidade, i.preco_unitario 
             FROM itens_pedido i
             JOIN produtos p ON i.produto_id = p.id
             WHERE i.pedido_id = ?`,
            [id]
        );

        res.json({
            pedido: pedido[0], // Dados do pedido
            itens: itens       // Lista de itens do pedido
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


module.exports = router;
