const express = require('express');
const router = express.Router();
const Album = require('../models/Album'); // Músicas estão dentro de álbuns
// const Song = require('../models/Song'); // Song não é um modelo direto, mas um schema
const auth = require('../middleware/auth');


// @route   GET /api/songs/top
// @desc    Obter as N músicas mais tocadas de todos os álbuns
// @access  Public
router.get('/top', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10; // Limite padrão de 10

        // Agregação para buscar as músicas mais tocadas em todos os álbuns
        const topSongs = await Album.aggregate([
            { $unwind: '$songs' }, // Desconstrói o array de músicas em documentos separados
            { $sort: { 'songs.viewsCount': -1 } }, // Ordena por viewsCount decrescente
            { $limit: limit }, // Limita ao número desejado
            {
                $project: { // Seleciona os campos que queremos da música e do álbum pai
                    _id: '$songs._id',
                    title: '$songs.title',
                    durationMs: '$songs.durationMs',
                    audioUrl: '$songs.audioUrl',
                    viewsCount: '$songs.viewsCount',
                    genreIds: '$songs.genreIds',
                    featuredArtistsIds: '$songs.featuredArtistsIds',
                    albumId: '$_id',
                    albumTitle: '$title',
                    albumCover: '$coverUrl'
                }
            },
            // Opcional: populate featuredArtistsIds e genreIds aqui se desejar detalhes imediatos
            // Isso requer um lookup para cada um, tornando a agregação mais complexa.
            // Para simplicidade, vamos deixar como IDs por enquanto.
        ]);

        // Se quiser popular os artistas e gêneros aqui, precisaria de mais etapas de $lookup
        // Ou o frontend faz uma segunda requisição para obter os detalhes dos IDs

        res.json(topSongs);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erro no servidor');
    }
});

// @route   GET /api/songs/album/:albumId
// @desc    Obter todas as músicas de um álbum específico
// @access  Public
router.get('/album/:albumId', async (req, res) => {
    try {
        const album = await Album.findById(req.params.albumId)
            .populate('artistId', 'name') // Popula o artista do álbum
            .populate('songs.featuredArtistsIds', 'name') // Popula artistas de cada música
            .populate('songs.genreIds', 'name'); // Popula gêneros de cada música

        if (!album) {
            return res.status(404).json({ msg: 'Álbum não encontrado.' });
        }

        res.json(album.songs); // Retorna apenas as músicas do álbum
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erro no servidor');
    }
});


module.exports = router;