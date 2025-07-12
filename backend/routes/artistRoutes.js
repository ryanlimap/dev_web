const express = require('express');
const router = express.Router();
const Artist = require('../models/Artist');
const auth = require('../middleware/auth'); // Importa o middleware de autenticação

// @route   POST /api/artists
// @desc    Criar um novo artista
// @access  Private (somente admins ou usuários logados podem criar, ajuste conforme sua regra)
router.post('/', auth, async (req, res) => {
    const { name, biography, profilePictureUrl } = req.body;

    try {
        let artist = await Artist.findOne({ name });
        if (artist) {
            return res.status(400).json({ msg: 'Artista com este nome já existe.' });
        }

        artist = new Artist({
            name,
            biography,
            profilePictureUrl
        });

        await artist.save();
        res.status(201).json(artist);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erro no servidor');
    }
});

// @route   GET /api/artists
// @desc    Obter todos os artistas
// @access  Public
router.get('/', async (req, res) => {
    try {
        const artists = await Artist.find().sort({ name: 1 }); // Ordena por nome
        res.json(artists);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erro no servidor');
    }
});

// @route   GET /api/artists/:id
// @desc    Obter um artista por ID
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const artist = await Artist.findById(req.params.id);
        if (!artist) {
            return res.status(404).json({ msg: 'Artista não encontrado.' });
        }
        res.json(artist);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') { // Erro se o ID não for um ObjectId válido
            return res.status(400).json({ msg: 'ID de artista inválido.' });
        }
        res.status(500).send('Erro no servidor');
    }
});

// @route   PUT /api/artists/:id
// @desc    Atualizar um artista
// @access  Private
router.put('/:id', auth, async (req, res) => {
    const { name, biography, profilePictureUrl, followersCount } = req.body;

    try {
        let artist = await Artist.findById(req.params.id);
        if (!artist) {
            return res.status(404).json({ msg: 'Artista não encontrado.' });
        }

        // Atualiza os campos
        artist.name = name || artist.name;
        artist.biography = biography || artist.biography;
        artist.profilePictureUrl = profilePictureUrl || artist.profilePictureUrl;
        artist.followersCount = followersCount !== undefined ? followersCount : artist.followersCount;


        await artist.save();
        res.json(artist);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(400).json({ msg: 'ID de artista inválido.' });
        }
        res.status(500).send('Erro no servidor');
    }
});

// @route   DELETE /api/artists/:id
// @desc    Excluir um artista
// @access  Private
router.delete('/:id', auth, async (req, res) => {
    try {
        const artist = await Artist.findByIdAndDelete(req.params.id);
        if (!artist) {
            return res.status(404).json({ msg: 'Artista não encontrado.' });
        }
        res.json({ msg: 'Artista removido com sucesso.' });
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(400).json({ msg: 'ID de artista inválido.' });
        }
        res.status(500).send('Erro no servidor');
    }
});


module.exports = router;