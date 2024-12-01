const db = require('./config/db');

async function seedDatabase() {
    try {
      
        console.log('Banco de dados inicializado com sucesso!');
        process.exit(0); 
    } catch (err) {
        console.error('Erro ao inicializar o banco de dados:', err.message);
        process.exit(1); 
    }
}

seedDatabase();
