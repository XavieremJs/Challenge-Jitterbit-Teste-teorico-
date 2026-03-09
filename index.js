
/**
 * Servidor principal - API de Gestão de Pedidos
 * Inclui: MongoDB, JWT, Swagger
 */
require('dotenv').config();
const express      = require('express');
const connectDB    = require('./config/database');
const setupSwagger = require('./config/swagger');
const orderRoutes  = require('./routes/orderRoutes');
const authRoutes   = require('./routes/authRoutes');
const errorHandler = require('./middlewares/errorHandler');
const authMiddleware = require('./middlewares/authMiddleware');

const app = express();

// ── Middlewares globais ──────────────────────────────────────────
app.use(express.json());

// ── Conexão ao banco de dados ────────────────────────────────────
connectDB();

// ── Documentação Swagger (pública) ──────────────────────────────
setupSwagger(app);

// ── Rota raíz ───────────────────────────────────────────────────
app.get('/', (req, res) => {
    res.status(200).json({
        mensagem: 'API de Gestão de Pedidos',
        versao: '1.0.0',
        documentacao: 'http://localhost:3000/api-docs',
        endpoints: {
            'POST /auth/login':  'Obter token JWT (username: admin, password: admin123)',
            'POST /order':       'Criar novo pedido            [JWT obrigatório]',
            'GET /order/list':   'Listar todos os pedidos      [JWT obrigatório]',
            'GET /order/:id':    'Obter pedido por ID          [JWT obrigatório]',
            'PUT /order/:id':    'Atualizar pedido             [JWT obrigatório]',
            'DELETE /order/:id': 'Deletar pedido               [JWT obrigatório]',
        },
    });
});

// ── Rotas públicas ───────────────────────────────────────────────
app.use('/auth', authRoutes);

// ── Rotas protegidas por JWT ─────────────────────────────────────
app.use('/order', authMiddleware, orderRoutes);

// ── Tratamento de erros (deve ser o último middleware) ───────────
app.use(errorHandler);

// ── Iniciar servidor ─────────────────────────────────────────────
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
    console.log(`📄 Documentação:  http://localhost:${PORT}/api-docs`);
});