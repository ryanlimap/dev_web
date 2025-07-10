const jwt = require('jsonwebtoken');
const config = require('config');

// Middleware para proteger rotas. Verifica a validade do JWT.
module.exports = function (req, res, next) {
    // Obter o token do cabeçalho
    const token = req.header('x-auth-token');

    // Verificar se não há token
    if (!token) {
        return res.status(401).json({ msg: 'Nenhum token, autorização negada.' });
    }

    try {
        // Verificar o token
        const decoded = jwt.verify(token, config.get('jwtSecret'));

        // Anexar o usuário decodificado ao objeto de requisição
        // Isso permite acessar req.user.id nas rotas protegidas
        req.user = decoded.user;
        next(); // Passa para o próximo middleware/função de rota
    } catch (err) {
        res.status(401).json({ msg: 'Token inválido.' });
    }
};