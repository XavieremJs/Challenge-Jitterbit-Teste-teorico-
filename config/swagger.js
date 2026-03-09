/**
 * Configuração do Swagger para documentação da API
 */
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API de Gestão de Pedidos',
            version: '1.0.0',
            description:
                'API REST para criação, leitura, atualização e exclusão de pedidos. ' +
                'Use POST /auth/login com `{ "username": "admin", "password": "admin123" }` para obter o token JWT.',
        },
        servers: [{ url: 'http://localhost:3000' }],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
            schemas: {
                // Schema de entrada (request body)
                PedidoInput: {
                    type: 'object',
                    required: ['numeroPedido', 'valorTotal', 'dataCriacao', 'items'],
                    properties: {
                        numeroPedido: { type: 'string', example: 'v10089015vdb-01' },
                        valorTotal:   { type: 'number', example: 10000 },
                        dataCriacao:  { type: 'string', format: 'date-time', example: '2023-07-19T12:24:11.529Z' },
                        items: {
                            type: 'array',
                            items: {
                                type: 'object',
                                required: ['idItem', 'quantidadeItem', 'valorItem'],
                                properties: {
                                    idItem:         { type: 'string', example: '2434' },
                                    quantidadeItem: { type: 'number', example: 1 },
                                    valorItem:      { type: 'number', example: 1000 },
                                },
                            },
                        },
                    },
                },
                // Schema salvo no MongoDB (após mapping)
                PedidoDB: {
                    type: 'object',
                    properties: {
                        _id:          { type: 'string', example: '64dab8a0f6b7183237d307f6' },
                        orderId:      { type: 'string', example: 'v10089015vdb-01' },
                        value:        { type: 'number', example: 10000 },
                        creationDate: { type: 'string', format: 'date-time' },
                        items: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    productId: { type: 'number', example: 2434 },
                                    quantity:  { type: 'number', example: 1 },
                                    price:     { type: 'number', example: 1000 },
                                    _id:       { type: 'string' },
                                },
                            },
                        },
                        __v: { type: 'number', example: 0 },
                    },
                },
                // Schema de login
                LoginInput: {
                    type: 'object',
                    required: ['username', 'password'],
                    properties: {
                        username: { type: 'string', example: 'admin' },
                        password: { type: 'string', example: 'admin123' },
                    },
                },
            },
        },
        // Todas as rotas de /order exigem JWT por padrão
        security: [{ bearerAuth: [] }],

        paths: {
            // ── AUTH ──────────────────────────────────────────────
            '/auth/login': {
                post: {
                    tags: ['Autenticação'],
                    summary: 'Gerar token JWT',
                    security: [],          // login não precisa de token
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/LoginInput' },
                            },
                        },
                    },
                    responses: {
                        200: {
                            description: 'Token gerado com sucesso',
                            content: {
                                'application/json': {
                                    schema: {
                                        type: 'object',
                                        properties: {
                                            mensagem:  { type: 'string' },
                                            token:     { type: 'string' },
                                            expira_em: { type: 'string', example: '1h' },
                                        },
                                    },
                                },
                            },
                        },
                        401: { description: 'Credenciais inválidas' },
                    },
                },
            },

            // ── ORDERS ────────────────────────────────────────────
            '/order': {
                post: {
                    tags: ['Pedidos'],
                    summary: 'Criar novo pedido',
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/PedidoInput' },
                            },
                        },
                    },
                    responses: {
                        201: {
                            description: 'Pedido criado com sucesso',
                            content: { 'application/json': { schema: { $ref: '#/components/schemas/PedidoDB' } } },
                        },
                        400: { description: 'Dados inválidos' },
                        401: { description: 'Não autorizado – token JWT necessário' },
                    },
                },
            },

            '/order/list': {
                get: {
                    tags: ['Pedidos'],
                    summary: 'Listar todos os pedidos',
                    responses: {
                        200: {
                            description: 'Lista de pedidos',
                            content: {
                                'application/json': {
                                    schema: {
                                        type: 'object',
                                        properties: {
                                            total:    { type: 'number' },
                                            ordenes: { type: 'array', items: { $ref: '#/components/schemas/PedidoDB' } },
                                        },
                                    },
                                },
                            },
                        },
                        401: { description: 'Não autorizado' },
                    },
                },
            },

            '/order/{id}': {
                get: {
                    tags: ['Pedidos'],
                    summary: 'Obter pedido por ID',
                    parameters: [
                        { name: 'id', in: 'path', required: true, schema: { type: 'string' }, example: 'v10089015vdb-01' },
                    ],
                    responses: {
                        200: { description: 'Pedido encontrado', content: { 'application/json': { schema: { $ref: '#/components/schemas/PedidoDB' } } } },
                        404: { description: 'Pedido não encontrado' },
                        401: { description: 'Não autorizado' },
                    },
                },
                put: {
                    tags: ['Pedidos'],
                    summary: 'Atualizar pedido',
                    parameters: [
                        { name: 'id', in: 'path', required: true, schema: { type: 'string' } },
                    ],
                    requestBody: {
                        required: true,
                        content: { 'application/json': { schema: { $ref: '#/components/schemas/PedidoInput' } } },
                    },
                    responses: {
                        200: { description: 'Pedido atualizado' },
                        404: { description: 'Pedido não encontrado' },
                        401: { description: 'Não autorizado' },
                    },
                },
                delete: {
                    tags: ['Pedidos'],
                    summary: 'Deletar pedido',
                    parameters: [
                        { name: 'id', in: 'path', required: true, schema: { type: 'string' } },
                    ],
                    responses: {
                        200: { description: 'Pedido deletado' },
                        404: { description: 'Pedido não encontrado' },
                        401: { description: 'Não autorizado' },
                    },
                },
            },
        },
    },
    apis: [], // Definições inline acima, sem JSDoc em arquivos separados
};

const swaggerSpec = swaggerJsdoc(options);

/**
 * Registra o Swagger UI na aplicação Express
 * @param {import('express').Application} app
 */
const setupSwagger = (app) => {
    console.log('🔧 Paths en swagger:', Object.keys(swaggerSpec.paths || {}));
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    console.log('📄 Swagger disponível em http://localhost:3000/api-docs');
};

module.exports = setupSwagger;