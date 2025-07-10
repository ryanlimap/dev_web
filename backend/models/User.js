const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true, // Garante que cada username seja único
        trim: true,   // Remove espaços em branco do início e fim
        minlength: 3
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true, // Converte o email para minúsculas antes de salvar
        // Expressão regular básica para validação de email
        match: [/.+@.+\..+/, 'Por favor, insira um email válido']
    },
    password: { // Será armazenada como hash (criptografada)
        type: String,
        required: true,
        minlength: 6 // Senha mínima
    },
    registrationDate: {
        type: Date,
        default: Date.now // Define a data atual por padrão
    },
    birthDate: {
        type: Date,
        required: false // Não é obrigatório
    },
    country: {
        type: String,
        required: false
    },
    subscriptionType: {
        type: String,
        enum: ['Free', 'Premium'], // Define as opções válidas
        default: 'Free'
    },
    profilePictureUrl: {
        type: String,
        required: false
    },
    followedArtists: [{ // Array de IDs de artistas que o usuário segue
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Artist' // Referencia o modelo 'Artist'
    }],
    favoriteSongs: [{ // Array de IDs de músicas favoritas
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Song' // Referencia o modelo 'Song'
    }]
});

const User = mongoose.model('User', userSchema);

module.exports = User;