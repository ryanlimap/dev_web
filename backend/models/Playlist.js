const mongoose = require('mongoose');

// Schema para os itens da playlist (música e metadados da playlist)
const playlistItemSchema = new mongoose.Schema({
    songId: { // Referência ao _id da música (que está aninhada em um Album)
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Album' // Referenciamos Album, pois a música está "dentro" dele e precisamos do contexto
                     // Na prática, ao popular, buscaríamos a música dentro do álbum
        , required: true
    },
    addedDate: {
        type: Date,
        default: Date.now
    },
    order: { // Para manter a ordem das músicas na playlist
        type: Number,
        required: true
    }
});

const playlistSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: false,
        maxlength: 500
    },
    creatorId: { // Referência ao usuário que criou a playlist
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    creationDate: {
        type: Date,
        default: Date.now
    },
    isPublic: {
        type: Boolean,
        default: true
    },
    coverUrl: {
        type: String,
        required: false
    },
    songs: [playlistItemSchema] // Array de subdocumentos para os itens da playlist
});

const Playlist = mongoose.model('Playlist', playlistSchema);

module.exports = Playlist;