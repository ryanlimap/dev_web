const express = require('express');
const router = express.Router();
const Playlist = require('../models/Playlist');
const Album = require('../models/Album'); // Para buscar a música por ID
const User = require('../models/User'); // Para verificar o criador
const auth = require('../middleware/auth');
const Playlist = require('../models/Playlist');  
const Song = require('../models/Song'); 

// @route   POST /api/playlists
// @desc    Criar uma nova playlist
// @access  Private
router.post('/', auth, async (req, res) => {
    const { name, description, isPublic, coverUrl, songs } = req.body;

    try {
        // req.user.id vem do middleware de autenticação (ID do usuário logado)
        const creatorId = req.user.id;

        // Opcional: verificar se o criador realmente existe (o auth já garante que é um ID válido)
        const user = await User.findById(creatorId);
        if (!user) {
            return res.status(404).json({ msg: 'Usuário criador não encontrado.' });
        }

        // Validação das músicas na playlist (se fornecidas)
        if (songs && songs.length > 0) {
            for (const item of songs) {
                // Para verificar se o songId é válido e corresponde a uma música em algum álbum
                // Isso requer uma busca mais complexa, pois as músicas são aninhadas.
                // Uma forma simplificada para validação inicial: verificar se é um ObjectId válido
                if (!mongoose.Types.ObjectId.isValid(item.songId)) {
                    return res.status(400).json({ msg: `ID de música inválido: ${item.songId}` });
                }
                // Validação mais profunda pode ser feita aqui, buscando o álbum e a música dentro dele.
                // Exemplo simplificado: Apenas verificar se o ID existe em algum álbum
                const albumContainingSong = await Album.findOne({ 'songs._id': item.songId });
                if (!albumContainingSong) {
                    return res.status(400).json({ msg: `Música com ID ${item.songId} não encontrada em nenhum álbum.` });
                }
            }
        }

        const newPlaylist = new Playlist({
            name,
            description,
            creatorId,
            isPublic,
            coverUrl,
            songs // O array de songs já contém songId, addedDate, order
        });

        await newPlaylist.save();
        res.status(201).json(newPlaylist);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erro no servidor');
    }
});

// @route   GET /api/playlists
// @desc    Obter todas as playlists (popula criador e músicas)
// @access  Public
router.get('/', async (req, res) => {
    try {
        const playlists = await Playlist.find()
            .populate('creatorId', 'username profilePictureUrl')
            // Para popular detalhes das músicas, é mais complexo devido ao aninhamento.
            // Isso é um placeholder. A "população" de músicas aninhadas em álbuns
            // geralmente é feita em uma etapa separada ou com um pipeline de agregação.
            // Por enquanto, vamos retornar apenas os songIds.
            .sort({ creationDate: -1 });
        res.json(playlists);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erro no servidor');
    }
});

// @route   GET /api/playlists/:id
// @desc    Obter uma playlist por ID (popula criador e tenta popular músicas)
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const playlist = await Playlist.findById(req.params.id)
            .populate('creatorId', 'username profilePictureUrl');

        if (!playlist) {
            return res.status(404).json({ msg: 'Playlist não encontrada.' });
        }

        // Lógica para popular músicas detalhadas da playlist:
        // Precisa buscar os álbuns que contêm os songIds da playlist
        // e depois extrair as músicas específicas.
        const populatedSongs = [];
        for (const item of playlist.songs) {
            const album = await Album.findOne({ 'songs._id': item.songId })
                .populate('songs.featuredArtistsIds', 'name')
                .populate('songs.genreIds', 'name');

            if (album) {
                const songDetail = album.songs.id(item.songId);
                if (songDetail) {
                    populatedSongs.push({
                        ...songDetail.toObject(), // Converte subdocumento para objeto JS
                        addedDate: item.addedDate,
                        order: item.order
                    });
                }
            }
        }

        // Retorna a playlist com as músicas "populadas"
        res.json({ ...playlist.toObject(), songs: populatedSongs });

    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(400).json({ msg: 'ID de playlist inválido.' });
        }
        res.status(500).send('Erro no servidor');
    }
});

// @route   PUT /api/playlists/:id
// @desc    Atualizar uma playlist (sem atualizar músicas diretamente aqui)
// @access  Private
router.put('/:id', auth, async (req, res) => {
    const { name, description, isPublic, coverUrl } = req.body;

    try {
        let playlist = await Playlist.findById(req.params.id);
        if (!playlist) {
            return res.status(404).json({ msg: 'Playlist não encontrada.' });
        }

        // Opcional: Apenas o criador pode editar
        if (playlist.creatorId.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Não autorizado: Você não é o criador desta playlist.' });
        }

        playlist.name = name || playlist.name;
        playlist.description = description || playlist.description;
        playlist.isPublic = isPublic !== undefined ? isPublic : playlist.isPublic;
        playlist.coverUrl = coverUrl || playlist.coverUrl;

        await playlist.save();
        res.json(playlist);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(400).json({ msg: 'ID de playlist inválido.' });
        }
        res.status(500).send('Erro no servidor');
    }
});

// @route   DELETE /api/playlists/:id
// @desc    Excluir uma playlist
// @access  Private
router.delete('/:id', auth, async (req, res) => {
    try {
        const playlist = await Playlist.findById(req.params.id);
        if (!playlist) {
            return res.status(404).json({ msg: 'Playlist não encontrada.' });
        }

        // Opcional: Apenas o criador pode excluir
        if (playlist.creatorId.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Não autorizado: Você não é o criador desta playlist.' });
        }

        await playlist.deleteOne(); // Mongoose 6+ use .deleteOne()
        res.json({ msg: 'Playlist removida com sucesso.' });
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(400).json({ msg: 'ID de playlist inválido.' });
        }
        res.status(500).send('Erro no servidor');
    }
});

// --- Rotas para Gerenciar Músicas em uma Playlist ---

// @route   POST /api/playlists/:playlistId/songs
// @desc    Adicionar uma música a uma playlist
// @access  Private
router.post('/:playlistId/songs', auth, async (req, res) => {
    const { songId } = req.body; // Apenas o ID da música é necessário

    try {
        const playlist = await Playlist.findById(req.params.playlistId);
        if (!playlist) {
            return res.status(404).json({ msg: 'Playlist não encontrada.' });
        }

        // Opcional: Apenas o criador pode adicionar/remover músicas
        if (playlist.creatorId.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Não autorizado: Você não é o criador desta playlist.' });
        }

        // Verificar se a música realmente existe em algum álbum
        const albumContainingSong = await Album.findOne({ 'songs._id': songId });
        if (!albumContainingSong || !albumContainingSong.songs.id(songId)) {
            return res.status(400).json({ msg: 'Música não encontrada em nenhum álbum.' });
        }

        // Opcional: Verificar se a música já está na playlist
        const existingSong = playlist.songs.find(s => s.songId.toString() === songId);
        if (existingSong) {
            return res.status(400).json({ msg: 'Música já existe na playlist.' });
        }

        // Adicionar a música ao array de songs da playlist
        playlist.songs.push({
            songId,
            addedDate: new Date(),
            order: playlist.songs.length + 1 // Simple order, pode ser ajustado
        });

        await playlist.save();
        res.json(playlist.songs[playlist.songs.length - 1]); // Retorna o item adicionado
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erro no servidor');
    }
});

// @route   DELETE /api/playlists/:playlistId/songs/:songId
// @desc    Remover uma música de uma playlist
// @access  Private
router.delete('/:playlistId/songs/:songId', auth, async (req, res) => {
    try {
        const playlist = await Playlist.findById(req.params.playlistId);
        if (!playlist) {
            return res.status(404).json({ msg: 'Playlist não encontrada.' });
        }

        // Opcional: Apenas o criador pode adicionar/remover músicas
        if (playlist.creatorId.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Não autorizado: Você não é o criador desta playlist.' });
        }

        // Filtrar a música para remover
        const originalLength = playlist.songs.length;
        playlist.songs = playlist.songs.filter(item => item.songId.toString() !== req.params.songId);

        if (playlist.songs.length === originalLength) {
            return res.status(404).json({ msg: 'Música não encontrada nesta playlist.' });
        }

        await playlist.save();
        res.json({ msg: 'Música removida da playlist com sucesso.' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erro no servidor');
    }
});

// Aleatoriza as musicas
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];  // Troca os elementos
    }
    return array;
}

// Pega as musicas
router.get('/:playlistId/musicas', async (req, res) => {
    try {
        const { playlistId } = req.params;
        const playlist = await Playlist.findById(playlistId).populate('musicas');
        if (!playlist) return res.status(404).send('Playlist não encontrada');
        const shuffledSongs = shuffleArray(playlist.musicas);
        res.status(200).json(shuffledSongs); 
    } catch (error) {
        res.status(500).send('Erro ao obter músicas da playlist');
    }
});


module.exports = router;