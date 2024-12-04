const express = require('express');
const app = express();
const port = 4000;

app.use(express.json());

app.use('/relatorios', require('./routes/relatorios'));

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});