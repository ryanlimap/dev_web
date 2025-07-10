const mongoose = require('mongoose');
require('dotenv').config(); // <-- ESSA LINHA É CRÍTICA!

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            // useNewUrlParser: true, // Remover se estiver usando Mongoose 6+
            // useUnifiedTopology: true, // Remover se estiver usando Mongoose 6+
        });
        console.log('MongoDB Conectado com Sucesso!');
    } catch (err) {
        console.error('Erro ao conectar ao MongoDB:', err.message);
        // Sair do processo com falha
        process.exit(1);
    }
};

module.exports = connectDB;