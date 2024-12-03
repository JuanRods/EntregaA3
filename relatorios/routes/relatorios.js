const express = require('express');
const router = express.Router();
const db = require('../config/db'); // A instância do banco de dados

// Rota para gerar relatório de vendas
router.get('/', async (req, res) => {
    try {
        // Consultar vendas totais por produto
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

        // Determinar os produtos mais e menos vendidos
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

module.exports = router;