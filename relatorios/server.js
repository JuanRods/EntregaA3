const express = require('express');
const relatoriosRoutes = require('./routes/relatorios');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());
app.use('/api/relatorios', relatoriosRoutes);

app.listen(PORT, () => {
  console.log(`Serviço de relatórios rodando na porta ${PORT}`);
});
