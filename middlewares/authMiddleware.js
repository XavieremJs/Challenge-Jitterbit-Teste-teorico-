/**
 * Middleware de autenticação JWT
 * Verifica se o token Bearer é válido antes de acessar rotas protegidas
 */
const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers['authorization'];

    // Verifica se o header Authorization existe
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            error: 'Acesso negado. Token não fornecido.',
        });
    }

    const token = authHeader.split(' ')[1];

    try {
        // Verifica e decodifica o token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({
            error: 'Token inválido ou expirado.',
        });
    }
};

module.exports = authMiddleware