const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); // <-- Importar jsonwebtoken
const config = require('config');     // <-- Importar config
const User = require('../models/User'); 
const Song = require('../models/Song'); 

// @route   POST /api/users/register
// @desc    Registrar um novo usuário
// @access  Public
router.post('/register', async (req, res) => {
    const { username, email, password, birthDate, country } = req.body;

    try {
        // 1. Verificar se o usuário já existe (por email ou username)
        let userByEmail = await User.findOne({ email });
        if (userByEmail) {
            return res.status(400).json({ msg: 'Email já registrado.' });
        }

        let userByUsername = await User.findOne({ username });
        if (userByUsername) {
            return res.status(400).json({ msg: 'Nome de usuário já existe.' });
        }

        // 2. Criar um novo usuário
        const newUser = new User({
            username,
            email,
            password,
            birthDate,
            country
        });

        // 3. Hash da senha
        const salt = await bcrypt.genSalt(10);
        newUser.password = await bcrypt.hash(password, salt);

        // 4. Salvar o usuário no banco de dados
        await newUser.save();

        // 5. Gerar e retornar JWT (opcionalmente no registro, mas mais comum no login)
        // Para fins de simplificação, vamos gerar o token apenas no login.
        res.status(201).json({ msg: 'Usuário registrado com sucesso!', user: { id: newUser._id, username: newUser.username, email: newUser.email } });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erro no servidor');
    }
});

// @route   POST /api/users/login
// @desc    Autenticar usuário e obter token
// @access  Public
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // 1. Verificar se o usuário existe pelo email
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: 'Credenciais inválidas.' }); // Mensagem genérica para segurança
        }

        // 2. Comparar a senha fornecida com a senha hashed no DB
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Credenciais inválidas.' });
        }

        // 3. Criar o payload do JWT (informações que queremos no token)
        const payload = {
            user: {
                id: user.id // O ID do usuário no MongoDB
            }
        };

        // 4. Assinar o token JWT
        jwt.sign(
            payload,
            config.get('jwtSecret'), // A chave secreta do seu default.json
            { expiresIn: config.get('jwtExpiration') }, // Tempo de expiração (ex: '1h')
            (err, token) => {
                if (err) throw err;
                res.json({ token }); // Retorna o token para o cliente
            }
        );

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erro no servidor');
    }
});


// Favoritar músicas
router.post('/:userId/favoritar/:musicaId', async (req, res) => {
    try {
        const { userId, musicaId } = req.params;
        const user = await User.findById(userId);
        if (!user) return res.status(404).send('Usuário não encontrado');
        const song = await Song.findById(musicaId);
        if (!song) return res.status(404).send('Música não encontrada');
        if (user.favoritas.includes(musicaId)) {
            return res.status(400).send('Música já está nos favoritos');
        }
        user.favoritas.push(musicaId);
        await user.save();

        res.status(200).send('Música adicionada aos favoritos');
    } catch (error) {
        res.status(500).send('Erro ao adicionar música aos favoritos');
    }
});

// Remove a música dos favoritos
router.delete('/:userId/favoritar/:musicaId', async (req, res) => {
    try {
        const { userId, musicaId } = req.params;
        const user = await User.findById(userId);
        if (!user) return res.status(404).send('Usuário não encontrado');
        user.favoritas = user.favoritas.filter(id => id.toString() !== musicaId);
        await user.save();
        res.status(200).send('Música removida dos favoritos');
    } catch (error) {
        res.status(500).send('Erro ao remover música dos favoritos');
    }
});

// Obter músicas favoritas
router.get('/:userId/favoritos', async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await User.findById(userId).populate('favoritas');
        if (!user) return res.status(404).send('Usuário não encontrado');

        res.status(200).json(user.favoritas);
    } catch (error) {
        res.status(500).send('Erro ao obter músicas favoritas');
    }
});

module.exports = router;