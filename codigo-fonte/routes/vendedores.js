const express = require('express');
const router = express.Router();
const db = require('../config/db'); // Importando a configuração do banco de dados

// Função para tratar erros de conexão ao banco
const handleDatabaseError = (err) => {
    if (err.code === 'ECONNREFUSED') {
        return 'Falha ao conectar ao banco de dados. O servidor pode estar inativo ou a configuração de rede está incorreta.';
    }
    return 'Erro ao conectar ao banco de dados. Detalhes: ' + err.message;
};

// Rota para listar todos os vendedores
router.get('/listar', async (req, res) => {
    try {
        // Consulta todos os vendedores cadastrados no banco de dados
        const [rows] = await db.query('SELECT * FROM vendedores');
        // Retorna a lista de vendedores encontrados
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

// Rota para adicionar um novo vendedor
router.post('/inserir', async (req, res) => {
    const { nome, email, salario } = req.body;  // Recebe os dados do novo vendedor

    try {
        // Insere o novo vendedor no banco de dados
        const [result] = await db.query(
            'INSERT INTO vendedores (nome, email, salario) VALUES (?, ?, ?)',
            [nome, email, salario]
        );
        
        // Cria o objeto do novo vendedor com o ID retornado pelo banco
        const novoVendedor = {
            id: result.insertId,
            nome,
            email,
            salario
        };

        // Retorna uma mensagem de sucesso com o vendedor criado
        res.status(201).json({
            message: 'Vendedor foi adicionado com sucesso ao sistema.',
            vendedor: novoVendedor
        });
    } catch (err) {
        // Trata erro de conexão ou outro tipo de erro
        const errorMessage = handleDatabaseError(err);
        res.status(500).json({
            message: 'Não foi possível adicionar o vendedor ao sistema.',
            error: errorMessage
        });
    }
});

// Rota para atualizar um vendedor existente
router.put('/att/:id', async (req, res) => {
    const { id } = req.params;  // Recebe o ID do vendedor a ser atualizado
    const { nome, email, salario } = req.body;  // Recebe os novos dados do vendedor

    try {
        // Atualiza os dados do vendedor no banco de dados
        const [result] = await db.query(
            'UPDATE vendedores SET nome = ?, email = ?, salario = ? WHERE id = ?',
            [nome, email, salario, id]
        );

        // Verifica se o vendedor foi encontrado e atualizado
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Vendedor não encontrado' });
        }

        // Retorna os dados do vendedor atualizado
        res.json({ message: 'Vendedor atualizado com sucesso!', id, nome, email, salario });
    } catch (err) {
        // Trata erro de conexão ou outro tipo de erro
        const errorMessage = handleDatabaseError(err);
        res.status(500).json({ error: errorMessage });
    }
});

// Rota para excluir um vendedor
router.delete('/delete/:id', async (req, res) => {
    const { id } = req.params;  // Recebe o ID do vendedor a ser excluído

    try {
        // Exclui o vendedor do banco de dados
        const [result] = await db.query('DELETE FROM vendedores WHERE id = ?', [id]);

        // Verifica se o vendedor foi encontrado e excluído
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Vendedor não encontrado' });
        }

        // Retorna uma resposta de sucesso com código 204 (sem conteúdo)
        res.status(204).send();
    } catch (err) {
        // Trata erro de conexão ou outro tipo de erro
        const errorMessage = handleDatabaseError(err);
        res.status(500).json({ error: errorMessage });
    }
});

module.exports = router;
