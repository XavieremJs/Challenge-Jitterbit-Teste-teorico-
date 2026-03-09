
/**
 * Controller de autenticação
 * Gera tokens JWT para acesso à API
 */
const jwt = require('jsonwebtoken');

// Usuário fixo para demonstração (em produção usar banco de dados)
const DEMO_USER = {
    id: 1,
    username: 'admin',
    password: 'admin123',
};

/**
 * POST /auth/login
 * Retorna um token JWT se as credenciais forem válidas
 */
exports.login = (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({
            error: 'Username e password são obrigatórios.',
        });
    }

    // Valida credenciais
    if (username !== DEMO_USER.username || password !== DEMO_USER.password) {
        return res.status(401).json({
            error: 'Credenciais inválidas.',
        });
    }

    // Gera o token JWT (expira em 1 hora)
    const token = jwt.sign(
        { id: DEMO_USER.id, username: DEMO_USER.username },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    );

    return res.status(200).json({
        mensagem: 'Login realizado com sucesso.',
        token,
        expira_em: '1h',
    });
};