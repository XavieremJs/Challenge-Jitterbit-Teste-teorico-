/**
 * Controller de Pedidos
 * Operações CRUD para gestão de pedidos
 */
const mongoose = require('mongoose');
const Order = require('../models/orderModel');

/**
 * Mapeia os dados de entrada para o formato do modelo
 * @param {Object} data - Dados brutos da requisição
 * @returns {Object} Dados mapeados para o schema
 */
const mapOrderData = (data) => ({
    orderId: data.numeroPedido,
    value: data.valorTotal,
    creationDate: new Date(data.dataCriacao),
    items: data.items.map(i => ({
        productId: i.idItem,
        quantity: i.quantidadeItem,
        price: i.valorItem
    }))
});

/**
 * Valida se os campos obrigatórios estão presentes no body
 * @param {Object} data - Dados da requisição
 * @returns {string|null} Mensagem de erro ou null se válido
 */
const validateOrderBody = (data) => {
    if (!data.numeroPedido) return 'Campo obrigatório ausente: numeroPedido';
    if (!data.valorTotal)   return 'Campo obrigatório ausente: valorTotal';
    if (!data.dataCriacao)  return 'Campo obrigatório ausente: dataCriacao';
    if (!data.items || !Array.isArray(data.items) || data.items.length === 0)
        return 'Campo obrigatório ausente ou vazio: items (deve ser um array com ao menos 1 item)';
    return null;
};

/**
 * POST /order
 * Cria um novo pedido
 */
exports.createOrder = async (req, res, next) => {
    try {
        const data = req.body;

        const validationError = validateOrderBody(data);
        if (validationError) {
            return res.status(400).json({ erro: validationError });
        }

        const mappedOrder = mapOrderData(data);
        const order = new Order(mappedOrder);
        await order.save();

        res.status(201).json({
            mensagem: 'Pedido criado com sucesso',
            pedido: order
        });
    } catch (error) {
        next(error);
    }
};

/**
 * GET /order/list
 * Retorna todos os pedidos ordenados por data de criação (mais recente primeiro)
 */
exports.getAllOrders = async (req, res, next) => {
    try {
        const orders = await Order.find().sort({ creationDate: -1 });

        res.status(200).json({
            total: orders.length,
            pedidos: orders
        });
    } catch (error) {
        next(error);
    }
};

/**
 * GET /order/:id
 * Retorna um pedido pelo ID do MongoDB
 */
exports.getOrderById = async (req, res, next) => {
    try {
        // Valida se o ID tem formato válido de ObjectId
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ erro: 'ID inválido. Formato esperado: ObjectId do MongoDB' });
        }

        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ erro: 'Pedido não encontrado' });
        }

        res.status(200).json(order);
    } catch (error) {
        next(error);
    }
};

/**
 * PUT /order/:id
 * Atualiza um pedido existente
 */
exports.updateOrder = async (req, res, next) => {
    try {
        // Valida se o ID tem formato válido de ObjectId
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ erro: 'ID inválido. Formato esperado: ObjectId do MongoDB' });
        }

        // Valida campos obrigatórios antes de mapear
        const validationError = validateOrderBody(req.body);
        if (validationError) {
            return res.status(400).json({ erro: validationError });
        }

        const mappedOrder = mapOrderData(req.body);
        const order = await Order.findByIdAndUpdate(
            req.params.id,
            mappedOrder,
            { new: true, runValidators: true }
        );

        if (!order) {
            return res.status(404).json({ erro: 'Pedido não encontrado' });
        }

        res.status(200).json({
            mensagem: 'Pedido atualizado com sucesso',
            pedido: order
        });
    } catch (error) {
        next(error);
    }
};

/**
 * DELETE /order/:id
 * Remove um pedido pelo ID
 */
exports.deleteOrder = async (req, res, next) => {
    try {
        // Valida se o ID tem formato válido de ObjectId
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ erro: 'ID inválido. Formato esperado: ObjectId do MongoDB' });
        }

        const order = await Order.findByIdAndDelete(req.params.id);

        if (!order) {
            return res.status(404).json({ erro: 'Pedido não encontrado' });
        }

        res.status(200).json({
            mensagem: 'Pedido deletado com sucesso',
            pedido: order
        });
    } catch (error) {
        next(error);
    }
};