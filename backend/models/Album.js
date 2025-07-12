const mongoose = require('mongoose');
const songSchema = require('./Song'); // Importa o schema de música

const albumSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    releaseDate: {
        type: Date,
        required: true
    },
    coverUrl: {
        type: String,
        required: false
    },
    type: {
        type: String,
        enum: ['Album', 'Single', 'EP'], // Tipos de álbum permitidos
        required: true
    },
    artistId: { // Referência ao artista principal do álbum
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Artist',
        required: true
    },
    songs: [songSchema] // Array de subdocumentos Song
});

const Album = mongoose.model('Album', albumSchema);

module.exports = Album;