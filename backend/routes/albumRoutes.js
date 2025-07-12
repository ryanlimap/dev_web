const express = require('express');
const router = express.Router();
const Album = require('../models/Album');
const Artist = require('../models/Artist'); // Para verificar se o artista existe
const Genre = require('../models/Genre');   // Para verificar se os gêneros existem
const auth = require('../middleware/auth');

// @route   POST /api/albums
// @desc    Criar um novo álbum com suas músicas
// @access  Private
router.post('/', auth, async (req, res) => {
    const { title, releaseDate, coverUrl, type, artistId, songs } = req.body;

    try {
        // Verificar se o artista existe
        const artist = await Artist.findById(artistId);
        if (!artist) {
            return res.status(400).json({ msg: 'Artista principal não encontrado.' });
        }

        // Para cada música, verificar se os featuredArtists e genres existem
        if (songs && songs.length > 0) {
            for (const song of songs) {
                if (song.featuredArtistsIds && song.featuredArtistsIds.length > 0) {
                    for (const featArtistId of song.featuredArtistsIds) {
                        const featArtist = await Artist.findById(featArtistId);
                        if (!featArtist) {
                            return res.status(400).json({ msg: `Artista colaborador com ID ${featArtistId} não encontrado.` });
                        }
                    }
                }
                if (song.genreIds && song.genreIds.length > 0) {
                    for (const genreId of song.genreIds) {
                        const genre = await Genre.findById(genreId);
                        if (!genre) {
                            return res.status(400).json({ msg: `Gênero com ID ${genreId} não encontrado.` });
                        }
                    }
                }
            }
        }

        const newAlbum = new Album({
            title,
            releaseDate,
            coverUrl,
            type,
            artistId,
            songs // As músicas serão salvas como subdocumentos
        });

        await newAlbum.save();
        res.status(201).json(newAlbum);
    } catch (err) {
        console.error(err.message);
        if (err.name === 'ValidationError') { // Erros de validação do Mongoose
            return res.status(400).json({ msg: err.message });
        }
        res.status(500).send('Erro no servidor');
    }
});

// @route   GET /api/albums
// @desc    Obter todos os álbuns (popula o artista principal)
// @access  Public
router.get('/', async (req, res) => {
    try {
        // Popula o campo artistId com os detalhes do artista
        const albums = await Album.find().populate('artistId', 'name profilePictureUrl');
        res.json(albums);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erro no servidor');
    }
});

// @route   GET /api/albums/:id
// @desc    Obter um álbum por ID (popula o artista principal e os featuredArtists/genres das músicas)
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const album = await Album.findById(req.params.id)
            .populate('artistId', 'name profilePictureUrl')
            // Para popular os featuredArtists e genres dentro dos subdocumentos de músicas
            .populate('songs.featuredArtistsIds', 'name')
            .populate('songs.genreIds', 'name');

        if (!album) {
            return res.status(404).json({ msg: 'Álbum não encontrado.' });
        }
        res.json(album);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(400).json({ msg: 'ID de álbum inválido.' });
        }
        res.status(500).send('Erro no servidor');
    }
});

// @route   PUT /api/albums/:id
// @desc    Atualizar um álbum (sem atualizar músicas diretamente aqui, use rotas específicas para músicas)
// @access  Private
router.put('/:id', auth, async (req, res) => {
    const { title, releaseDate, coverUrl, type, artistId } = req.body;

    try {
        let album = await Album.findById(req.params.id);
        if (!album) {
            return res.status(404).json({ msg: 'Álbum não encontrado.' });
        }

        // Se o artistId for alterado, verificar se o novo artista existe
        if (artistId && album.artistId.toString() !== artistId) {
            const artist = await Artist.findById(artistId);
            if (!artist) {
                return res.status(400).json({ msg: 'Novo artista principal não encontrado.' });
            }
            album.artistId = artistId;
        }

        album.title = title || album.title;
        album.releaseDate = releaseDate ? new Date(releaseDate) : album.releaseDate;
        album.coverUrl = coverUrl || album.coverUrl;
        album.type = type || album.type;

        await album.save();
        res.json(album);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(400).json({ msg: 'ID de álbum inválido.' });
        }
        res.status(500).send('Erro no servidor');
    }
});

// @route   DELETE /api/albums/:id
// @desc    Excluir um álbum
// @access  Private
router.delete('/:id', auth, async (req, res) => {
    try {
        const album = await Album.findByIdAndDelete(req.params.id);
        if (!album) {
            return res.status(404).json({ msg: 'Álbum não encontrado.' });
        }
        res.json({ msg: 'Álbum removido com sucesso.' });
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(400).json({ msg: 'ID de álbum inválido.' });
        }
        res.status(500).send('Erro no servidor');
    }
});

// --- Rotas para Músicas dentro de um Álbum ---

// @route   POST /api/albums/:albumId/songs
// @desc    Adicionar uma nova música a um álbum existente
// @access  Private
router.post('/:albumId/songs', auth, async (req, res) => {
    const { title, durationMs, audioUrl, genreIds, featuredArtistsIds } = req.body;

    try {
        const album = await Album.findById(req.params.albumId);
        if (!album) {
            return res.status(404).json({ msg: 'Álbum não encontrado.' });
        }

        // Validações para featuredArtists e genres, similar ao POST de álbum
        if (featuredArtistsIds && featuredArtistsIds.length > 0) {
            for (const featArtistId of featuredArtistsIds) {
                const featArtist = await Artist.findById(featArtistId);
                if (!featArtist) {
                    return res.status(400).json({ msg: `Artista colaborador com ID ${featArtistId} não encontrado.` });
                }
            }
        }
        if (genreIds && genreIds.length > 0) {
            for (const genreId of genreIds) {
                const genre = await Genre.findById(genreId);
                if (!genre) {
                    return res.status(400).json({ msg: `Gênero com ID ${genreId} não encontrado.` });
                }
            }
        }

        // Cria a nova música como um subdocumento
        album.songs.push({
            title,
            durationMs,
            audioUrl,
            genreIds,
            featuredArtistsIds
        });

        await album.save();
        // Retorna o álbum atualizado ou apenas a nova música adicionada
        res.status(201).json(album.songs[album.songs.length - 1]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erro no servidor');
    }
});

// @route   PUT /api/albums/:albumId/songs/:songId
// @desc    Atualizar uma música específica dentro de um álbum
// @access  Private
router.put('/:albumId/songs/:songId', auth, async (req, res) => {
    const { title, durationMs, audioUrl, genreIds, featuredArtistsIds, viewsCount } = req.body;

    try {
        const album = await Album.findById(req.params.albumId);
        if (!album) {
            return res.status(404).json({ msg: 'Álbum não encontrado.' });
        }

        // Encontra a música pelo ID do subdocumento
        const song = album.songs.id(req.params.songId);
        if (!song) {
            return res.status(404).json({ msg: 'Música não encontrada neste álbum.' });
        }

        // Validações para featuredArtists e genres, se forem atualizados
        if (featuredArtistsIds && featuredArtistsIds.length > 0) {
            for (const featArtistId of featuredArtistsIds) {
                const featArtist = await Artist.findById(featArtistId);
                if (!featArtist) {
                    return res.status(400).json({ msg: `Artista colaborador com ID ${featArtistId} não encontrado.` });
                }
            }
        }
        if (genreIds && genreIds.length > 0) {
            for (const genreId of genreIds) {
                const genre = await Genre.findById(genreId);
                if (!genre) {
                    return res.status(400).json({ msg: `Gênero com ID ${genreId} não encontrado.` });
                }
            }
        }

        // Atualiza os campos da música
        song.title = title || song.title;
        song.durationMs = durationMs || song.durationMs;
        song.audioUrl = audioUrl || song.audioUrl;
        song.genreIds = genreIds || song.genreIds;
        song.featuredArtistsIds = featuredArtistsIds || song.featuredArtistsIds;
        song.viewsCount = viewsCount !== undefined ? viewsCount : song.viewsCount;


        await album.save(); // Salva o documento do álbum pai
        res.json(song); // Retorna a música atualizada
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erro no servidor');
    }
});

// @route   DELETE /api/albums/:albumId/songs/:songId
// @desc    Remover uma música específica de um álbum
// @access  Private
router.delete('/:albumId/songs/:songId', auth, async (req, res) => {
    try {
        const album = await Album.findById(req.params.albumId);
        if (!album) {
            return res.status(404).json({ msg: 'Álbum não encontrado.' });
        }

        // Remove a música do array de subdocumentos
        album.songs.id(req.params.songId).deleteOne(); // Mongoose 6+ use .deleteOne()

        await album.save();
        res.json({ msg: 'Música removida do álbum com sucesso.' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erro no servidor');
    }
});

module.exports = router;