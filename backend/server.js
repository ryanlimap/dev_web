// server.js
require('dotenv').config(); // <-- TEM QUE SER A PRIMEIRA LINHA EXECUTÁVEL!

console.log('MONGODB_URI do .env:', process.env.MONGODB_URI);

const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');

// Importar as rotas
const userRoutes = require('./routes/userRoutes');

const app = express();

// Conectar ao Banco de Dados (deve ser chamado depois do dotenv.config())
connectDB();

// Middlewares
app.use(express.json()); // Permite que o Express leia JSON no corpo das requisições
app.use(cors());

// Rota de Teste Simples
app.get('/', (req, res) => {
    res.send('API do Spotify Clone funcionando!');
});

// Usar as rotas
app.use('/api/users', userRoutes); // <-- ADICIONE ESTA LINHA: Todas as rotas em userRoutes
                                  //    serão prefixadas com '/api/users'

// Definir a porta
const PORT = process.env.PORT || 5000;

// Iniciar o Servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});