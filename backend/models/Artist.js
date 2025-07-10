const mongoose = require('mongoose');

const artistSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    biography: {
        type: String,
        required: false,
        maxlength: 1000 // Limite de caracteres para a biografia
    },
    profilePictureUrl: {
        type: String,
        required: false
    },
    followersCount: {
        type: Number,
        default: 0 // Inicia com zero seguidores
    }
    // Não precisamos de um array de álbuns aqui, pois os álbuns referenciam o artista.
    // Isso evita documentos muito grandes e duplicação de dados.
});

const Artist = mongoose.model('Artist', artistSchema);

module.exports = Artist;