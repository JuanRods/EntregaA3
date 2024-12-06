const express = require('express');
const router = express.Router();
const db = require('../config/db');  

router.get('/listar', async (req, res) => {
    try {
        const [pedidos] = await db.query('SELECT id FROM pedidos');
        const pedidosDetalhados = [];

        for (const pedido of pedidos) {
            const pedidoId = pedido.id;

            // Obter os detalhes do pedido
            const [pedidoDetalhe] = await db.query('SELECT * FROM pedidos WHERE id = ?', [pedidoId]);
            const [cliente] = await db.query('SELECT id, nome FROM clientes WHERE id = ?', [pedidoDetalhe[0].cliente_id]);
            const [itens] = await db.query(
                `SELECT i.produto_id, p.nome AS produto_nome, i.quantidade, i.preco_unitario, 
                        (i.quantidade * i.preco_unitario) AS total_item
                 FROM itens_pedido i
                 JOIN produtos p ON i.produto_id = p.id
                 WHERE i.pedido_id = ?`,
                [pedidoId]
            );

            // Garantir que total_item seja um número e calcular o total corretamente
            const total = itens.reduce((acc, item) => {
                return acc + (parseFloat(item.total_item) || 0);  // Garantir que total_item seja tratado como número
            }, 0);

            // Formatar o pedido detalhado
            pedidosDetalhados.push({
                id: pedidoId,
                cliente: {
                    id: cliente[0].id,
                    nome: cliente[0].nome,
                },
                itens: itens,
                total,  // Total como número
                status: pedidoDetalhe[0].status,
            });
        }

        res.json({
            message: 'Pedidos listados com sucesso!',
            pedidos: pedidosDetalhados,
        });

    } catch (err) {
        res.status(500).json({ error: 'Erro ao listar os pedidos. Detalhes: ' + err.message });
    }
});



// Insere Venda
router.post('/inserir', async (req, res) => {
    const { cliente_id, itens } = req.body; 
    try {
        const [cliente] = await db.query('SELECT * FROM clientes WHERE id = ?', [cliente_id]);
        if (cliente.length === 0) {
            return res.status(404).json({ message: 'Cliente não encontrado' });
        }
        await db.query('START TRANSACTION');
        const [resultPedido] = await db.query('INSERT INTO pedidos (cliente_id, status) VALUES (?, ?)', [cliente_id, 'pendente']);
        const pedidoId = resultPedido.insertId; 
        for (const item of itens) {
            const { produto_id, quantidade } = item;
            const [produto] = await db.query('SELECT estoque, preco FROM produtos WHERE id = ?', [produto_id]);
            if (produto.length === 0) {
                return res.status(404).json({ message: 'Produto não encontrado' });
            }
            if (produto[0].estoque < quantidade) {
                return res.status(400).json({ message: `Estoque insuficiente para o produto ${produto_id}` });
            }
            await db.query('INSERT INTO itens_pedido (pedido_id, produto_id, quantidade, preco_unitario) VALUES (?, ?, ?, ?)', 
                [pedidoId, produto_id, quantidade, produto[0].preco]);
            await db.query('UPDATE produtos SET estoque = estoque - ? WHERE id = ?', [quantidade, produto_id]);

        }
        await db.query('COMMIT');
        res.status(201).json({ message: 'Pedido criado com sucesso!', pedidoId });
    } catch (err) {
        await db.query('ROLLBACK');
        res.status(500).json({ error: 'Erro ao criar o pedido. Detalhes: ' + err.message });
    }
});

// Busca Venda
router.get('/buscar/:id', async (req, res) => {
    const { id } = req.params;
    try {
        // Busca o pedido pelo ID
        const [pedido] = await db.query('SELECT * FROM pedidos WHERE id = ?', [id]);
        if (pedido.length === 0) {
            return res.status(404).json({ message: 'Pedido não encontrado.' });
        }

        // Busca o cliente associado ao pedido
        const [cliente] = await db.query('SELECT * FROM clientes WHERE id = ?', [pedido[0].cliente_id]);

        // Busca os itens do pedido
        const [itens] = await db.query(
            `SELECT i.produto_id, p.nome AS produto_nome, i.quantidade, i.preco_unitario 
             FROM itens_pedido i
             JOIN produtos p ON i.produto_id = p.id
             WHERE i.pedido_id = ?`,
            [id]
        );

        // Calcular o total do pedido
        const total = itens.reduce((acc, item) => acc + (parseFloat(item.quantidade) * parseFloat(item.preco_unitario)), 0);

        res.json({
            pedido: pedido[0],
            cliente: cliente[0],
            itens: itens,
            total: total // Total calculado como número
        });
    } catch (err) {
        res.status(500).json({ error: 'Erro ao buscar o pedido. Detalhes: ' + err.message });
    }
});

// Atualiza uma Venda
router.put('/att/:id', async (req, res) => {
    const { id } = req.params;
    const { itens } = req.body;
    try {
        const [pedido] = await db.query('SELECT * FROM pedidos WHERE id = ?', [id]);
        if (pedido.length === 0) {
            return res.status(404).json({ message: 'Pedido não encontrado.' });
        }
        if (pedido[0].status !== 'pendente') {
            return res.status(400).json({ message: 'Apenas pedidos com status "pendente" podem ser atualizados.' });
        }
        await db.query('START TRANSACTION');
        const [itensAntigos] = await db.query('SELECT * FROM itens_pedido WHERE pedido_id = ?', [id]);
        for (const item of itensAntigos) {
            const { produto_id, quantidade } = item;
            await db.query('UPDATE produtos SET estoque = estoque + ? WHERE id = ?', [quantidade, produto_id]);
        }
        await db.query('DELETE FROM itens_pedido WHERE pedido_id = ?', [id]);
        let total = 0;
        for (const item of itens) {
            const { produto_id, quantidade } = item;
            const [produto] = await db.query('SELECT estoque, preco FROM produtos WHERE id = ?', [produto_id]);
            if (produto.length === 0) {
                throw new Error(`Produto com ID ${produto_id} não encontrado.`);
            }
            if (produto[0].estoque < quantidade) {
                throw new Error(`Estoque insuficiente para o produto com ID ${produto_id}.`);
            }
            await db.query('INSERT INTO itens_pedido (pedido_id, produto_id, quantidade, preco_unitario) VALUES (?, ?, ?, ?)', 
                [id, produto_id, quantidade, produto[0].preco]);
            await db.query('UPDATE produtos SET estoque = estoque - ? WHERE id = ?', [quantidade, produto_id]);
            total += produto[0].preco * quantidade;
        }
        await db.query('COMMIT');
        const [cliente] = await db.query('SELECT id, nome FROM clientes WHERE id = ?', [pedido[0].cliente_id]);
        const [itensAtualizados] = await db.query(
            `SELECT i.produto_id, p.nome AS produto_nome, i.quantidade, i.preco_unitario 
             FROM itens_pedido i
             JOIN produtos p ON i.produto_id = p.id
             WHERE i.pedido_id = ?`,
            [id]
        );
        res.json({
            message: 'Pedido atualizado com sucesso!',
            pedido: {
                id,
                cliente: cliente[0],
                itens: itensAtualizados,
                total
            }
        });
    } catch (err) {
        await db.query('ROLLBACK');
        res.status(500).json({ error: 'Erro ao atualizar o pedido. Detalhes: ' + err.message });
    }
});


//Conclui um Venda
router.put('/concluir/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const [pedido] = await db.query('SELECT * FROM pedidos WHERE id = ?', [id]);
        if (pedido.length === 0) {
            return res.status(404).json({ message: 'Pedido não encontrado.' });
        }
        if (pedido[0].status === 'finalizado') {
            return res.status(400).json({ message: 'Este pedido já foi finalizado.' });
        }
        if (pedido[0].status === 'cancelado') {
            return res.status(400).json({ message: 'Não é possível concluir um pedido cancelado.' });
        }
        await db.query('UPDATE pedidos SET status = ? WHERE id = ?', ['finalizado', id]);
        res.json({ message: 'Venda concluída com sucesso!' });
    } catch (err) {
        res.status(500).json({ error: 'Erro ao concluir o pedido. Detalhes: ' + err.message });
    }
});

// Cancela Venda
router.delete('/cancelar/:id', async (req, res) => {
    const { id } = req.params; 
    try {
        await db.query('START TRANSACTION');
        const [pedido] = await db.query('SELECT * FROM pedidos WHERE id = ?', [id]);
        if (pedido.length === 0) {
            return res.status(404).json({ message: 'Pedido não encontrado' });
        }
        await db.query('UPDATE pedidos SET status = ? WHERE id = ?', ['cancelado', id]);
        const [itens] = await db.query('SELECT * FROM itens_pedido WHERE pedido_id = ?', [id]);
        for (const item of itens) {
            const { produto_id, quantidade } = item;
            await db.query('UPDATE produtos SET estoque = estoque + ? WHERE id = ?', [quantidade, produto_id]);
        }
        await db.query('COMMIT');
        res.json({ message: 'Pedido cancelado com sucesso!' });
    } catch (err) {
        await db.query('ROLLBACK');
        res.status(500).json({ error: 'Erro ao cancelar o pedido. Detalhes: ' + err.message });
    }
});

module.exports = router;
