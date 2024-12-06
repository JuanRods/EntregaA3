const express = require('express');
const router = express.Router();
const db = require('../config/db');

router.get('/produto-mais-vendido', async (req, res) => {

    try {

        const [result] = await db.query(
            `SELECT 
                p.id AS produto_id, 
                p.nome AS produto_nome, 
                SUM(i.quantidade) AS total_vendido
             FROM itens_pedido i
             JOIN produtos p ON i.produto_id = p.id
             GROUP BY p.id
             ORDER BY total_vendido DESC`
        );

        if (result.length === 0) {
            return res.status(404).json({ message: 'Nenhum dado de venda encontrado.' });
        }

        const maisVendido = result[0];

        const menosVendido = result[result.length - 1];

        res.json({
            totalProdutosVendidos: result.length,
            maisVendido: {
                produto_id: maisVendido.produto_id,
                nome: maisVendido.produto_nome,
                quantidade: maisVendido.total_vendido
            },
            menosVendido: {
                produto_id: menosVendido.produto_id,
                nome: menosVendido.produto_nome,
                quantidade: menosVendido.total_vendido
            },
            detalhamento: result
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/produtos-por-cliente', async (req, res) => {

    try {

        const [result] = await db.query(
            `SELECT 
                c.id AS cliente_id, 
                c.nome AS cliente_nome, 
                p.nome AS produto_nome, 
                SUM(i.quantidade) AS quantidade_comprada
             FROM itens_pedido i
             JOIN pedidos o ON i.pedido_id = o.id
             JOIN clientes c ON o.cliente_id = c.id
             JOIN produtos p ON i.produto_id = p.id
             GROUP BY c.id, p.id
             ORDER BY c.id, quantidade_comprada DESC`
        );

        if (result.length === 0) {
            return res.status(404).json({ message: 'Nenhum dado de consumo encontrado.' });
        }

        res.json({ detalhamento: result });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/consumo-medio', async (req, res) => {

    try {

        const [result] = await db.query(
            `SELECT 
                c.id AS cliente_id, 
                c.nome AS cliente_nome, 
                AVG(i.quantidade * i.preco_unitario) AS consumo_medio
             FROM itens_pedido i
             JOIN pedidos o ON i.pedido_id = o.id
             JOIN clientes c ON o.cliente_id = c.id
             GROUP BY c.id
             ORDER BY consumo_medio DESC`
        );

        if (result.length === 0) {
            return res.status(404).json({ message: 'Nenhum dado de consumo médio encontrado.' });
        }

        res.json({ detalhamento: result });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/baixo-estoque', async (req, res) => {

    try {

        const [result] = await db.query(
            `SELECT 
                id AS produto_id, 
                nome AS produto_nome, 
                estoque
             FROM produtos
             WHERE estoque < 10
             ORDER BY estoque ASC`
        );

        if (result.length === 0) {
            return res.status(404).json({ message: 'Nenhum produto com baixo estoque encontrado.' });
        }

        res.json({ detalhamento: result });
        
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;