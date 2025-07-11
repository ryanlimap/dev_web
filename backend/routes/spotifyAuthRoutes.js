const express = require('express');
const router = express.Router();
const querystring = require('querystring');
const axios = require('axios');
const config = require('config'); // Para acessar as configurações do Spotify

// Credenciais do Spotify (obtidas do config/default.json)
const client_id = config.get('spotifyClientId');
const client_secret = config.get('spotifyClientSecret');
const redirect_uri = config.get('spotifyRedirectUri');

// Endpoints oficiais do Spotify para Autorização e Token
const SPOTIFY_AUTHORIZE_URL = 'https://accounts.spotify.com/authorize';
const SPOTIFY_TOKEN_URL = 'https://accounts.spotify.com/api/token';

// @route   GET /api/spotify/login
// @desc    Redirecionar para o Spotify Login
router.get('/login', (req, res) => {
    // Escopos (permissões) que você deseja solicitar do usuário
    // user-read-private e user-read-email são bons para começar
    // Você pode adicionar mais escopos conforme a necessidade do seu app
    const scope = 'user-read-private user-read-email user-read-email user-read-playback-state user-modify-playback-state streaming playlist-read-private playlist-read-collaborative user-library-read user-top-read user-read-recently-played';

    const queryParams = querystring.stringify({
        response_type: 'code',
        client_id: client_id,
        scope: scope,
        redirect_uri: redirect_uri,
        // state: 'qualquer_string_aleatoria_para_seguranca' // Opcional, mas recomendado para CSRF
    });

    res.redirect(`${SPOTIFY_AUTHORIZE_URL}?${queryParams}`);
});

// @route   GET /api/spotify/callback
// @desc    Trocar o código de autorização por um token de acesso
router.get('/callback', async (req, res) => {
    const code = req.query.code; // O código de autorização retornado pelo Spotify

    // Se houver um erro no callback (ex: usuário negou acesso)
    if (req.query.error) {
        console.error('Erro de callback do Spotify:', req.query.error);
        // Redirecione para uma página de erro no seu frontend ou exiba uma mensagem
        return res.redirect('/error?message=' + encodeURIComponent(req.query.error));
    }

    try {
        const response = await axios.post(
            SPOTIFY_TOKEN_URL, // Endpoint oficial para trocar código por token
            querystring.stringify({
                grant_type: 'authorization_code',
                code: code,
                redirect_uri: redirect_uri,
                // client_id e client_secret são incluídos no corpo da requisição ou como Basic Auth
                // Para Basic Auth, as credenciais seriam passadas no header Authorization
                // Mas para querystring.stringify, passá-las no corpo é comum também
            }),
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    // A autenticação Basic Auth é preferível para o endpoint /api/token
                    'Authorization': 'Basic ' + (Buffer.from(client_id + ':' + client_secret).toString('base64'))
                },
            }
        );

        const { access_token, refresh_token, expires_in } = response.data;

        // Geralmente, aqui você:
        // 1. Salvaria o access_token e refresh_token (associados ao usuário) no seu DB se precisar deles no backend.
        // 2. Redirecionaria o usuário para o frontend, passando os tokens
        //    (ex: para um dashboard do usuário onde o frontend pode usar esses tokens)
        //    Você pode passar via query params, cookies ou body de um POST para o frontend.

        // Exemplo: Redirecionar para o frontend com os tokens (via query params)
        // O frontend então os pega da URL e os armazena (ex: no localStorage)
        res.redirect(`http://localhost:4200/callback?access_token=${access_token}&refresh_token=${refresh_token}&expires_in=${expires_in}`);

        // Ou se você quiser apenas ver no backend para testes:
        // res.json({
        //     access_token,
        //     refresh_token,
        //     expires_in,
        // });

    } catch (error) {
        console.error('Erro ao obter token do Spotify:', error.response?.data || error.message);
        // Redirecione para uma página de erro no seu frontend ou exiba uma mensagem
        res.redirect('/error?message=' + encodeURIComponent('Erro ao obter token do Spotify'));
        // Ou para testes, apenas retorne o JSON de erro
        // res.status(500).json({ error: 'Erro ao obter token do Spotify', details: error.response?.data });
    }
});

// @route   GET /api/spotify/refresh_token
// @desc    Obter um novo access_token usando o refresh_token
// @access  Public (chamado pelo frontend quando o access_token expira)
router.get('/refresh_token', async (req, res) => {
    const refresh_token = req.query.refresh_token;

    try {
        const response = await axios.post(
            SPOTIFY_TOKEN_URL,
            querystring.stringify({
                grant_type: 'refresh_token',
                refresh_token: refresh_token,
                client_id: client_id,
                client_secret: client_secret // Em refresh, pode ser Basic Auth ou no corpo
            }),
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': 'Basic ' + (Buffer.from(client_id + ':' + client_secret).toString('base64'))
                },
            }
        );

        const { access_token, expires_in } = response.data;

        res.json({
            access_token,
            expires_in,
        });

    } catch (error) {
        console.error('Erro ao renovar token:', error.response?.data || error.message);
        res.status(500).json({ error: 'Erro ao renovar token do Spotify' });
    }
});


module.exports = router;