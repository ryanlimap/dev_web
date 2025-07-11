const express = require('express');
const router = express.Router();
const Genre = require('../models/Genre');
const auth = require('../middleware/auth');

// @route   POST /api/genres
// @desc    Criar um novo gênero
// @access  Private
router.post('/', auth, async (req, res) => {
    const { name } = req.body;

    try {
        let genre = await Genre.findOne({ name });
        if (genre) {
            return res.status(400).json({ msg: 'Gênero com este nome já existe.' });
        }

        genre = new Genre({ name });

        await genre.save();
        res.status(201).json(genre);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erro no servidor');
    }
});

// @route   GET /api/genres
// @desc    Obter todos os gêneros
// @access  Public
router.get('/', async (req, res) => {
    try {
        const genres = await Genre.find().sort({ name: 1 });
        res.json(genres);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erro no servidor');
    }
});

// @route   GET /api/genres/:id
// @desc    Obter um gênero por ID
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const genre = await Genre.findById(req.params.id);
        if (!genre) {
            return res.status(404).json({ msg: 'Gênero não encontrado.' });
        }
        res.json(genre);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(400).json({ msg: 'ID de gênero inválido.' });
        }
        res.status(500).send('Erro no servidor');
    }
});

// @route   PUT /api/genres/:id
// @desc    Atualizar um gênero
// @access  Private
router.put('/:id', auth, async (req, res) => {
    const { name } = req.body;

    try {
        let genre = await Genre.findById(req.params.id);
        if (!genre) {
            return res.status(404).json({ msg: 'Gênero não encontrado.' });
        }

        genre.name = name || genre.name; // Atualiza o nome

        await genre.save();
        res.json(genre);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(400).json({ msg: 'ID de gênero inválido.' });
        }
        res.status(500).send('Erro no servidor');
    }
});

// @route   DELETE /api/genres/:id
// @desc    Excluir um gênero
// @access  Private
router.delete('/:id', auth, async (req, res) => {
    try {
        const genre = await Genre.findByIdAndDelete(req.params.id);
        if (!genre) {
            return res.status(404).json({ msg: 'Gênero não encontrado.' });
        }
        res.json({ msg: 'Gênero removido com sucesso.' });
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(400).json({ msg: 'ID de gênero inválido.' });
        }
        res.status(500).send('Erro no servidor');
    }
});

module.exports = router;