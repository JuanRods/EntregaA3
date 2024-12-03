const express = require('express');
const app = express();
const port = 4000;
app.use(express.json());

//Rotas Principais
app.use('/relatorios', require('./routes/relatorios'));

//Inicia o Servidor
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});