const mongoose = require('mongoose');

const songSchema = new mongoose.Schema({
    // Não definimos _id aqui diretamente, o Mongoose gera para subdocumentos
    title: {
        type: String,
        required: true,
        trim: true
    },
    durationMs: { // Duração em milissegundos
        type: Number,
        required: true,
        min: 1 // Mínimo de 1ms
    },
    audioUrl: {
        type: String,
        required: true
    },
    viewsCount: {
        type: Number,
        default: 0
    },
    genreIds: [{ // Referência a múltiplos gêneros (Muitos para Muitos)
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Genre'
    }],
    featuredArtistsIds: [{ // Artistas que colaboraram na música (Muitos para Muitos)
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Artist'
    }]
});

// Nota: Não chamamos mongoose.model() aqui, pois Song será um subdocumento
// ou pode ser usado como um modelo autônomo se necessário em outras partes.
// Para fins de aninhamento em Album, exportamos o schema.
module.exports = songSchema;