// server.js
require('dotenv').config(); // <-- TEM QUE SER A PRIMEIRA LINHA EXECUTÁVEL!

console.log('MONGODB_URI do .env:', process.env.MONGODB_URI);

const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');

// Importar as rotas
const userRoutes = require('./routes/userRoutes');
const songRoutes = require('./routes/songRoutes');
const artistRoutes = require('./routes/artistRoutes');
const albumRoutes = require('./routes/albumRoutes');
const genreRoutes = require('./routes/genreRoutes');
const playlistRoutes = require('./routes/playlistRoutes');
const spotifyAuthRoutes = require('./routes/spotifyAuthRoutes');


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
app.use('/api/users', userRoutes); // <-- ADICIONE ESTA LINHA: Todas as rotas em userRoutes //    serão prefixadas com '/api/users'
app.use('/api/songs', songRoutes);    
app.use('/api/artists', artistRoutes);
app.use('/api/albums', albumRoutes);
app.use('/api/genres', genreRoutes);
app.use('/api/playlists', playlistRoutes);
app.use('/api/spotify', spotifyAuthRoutes);





// Definir a porta
const PORT = process.env.PORT || 5000;

// Iniciar o Servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});