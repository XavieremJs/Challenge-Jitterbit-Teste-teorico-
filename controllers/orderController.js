const Order = require('../models/orderModel');

// Mapear dados de entrada
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

// Criar novo pedido
exports.createOrder = async (req, res, next) => {
    try {
        const data = req.body;
        
        if (!data.numeroPedido || !data.valorTotal || !data.items) {
            return res.status(400).json({ 
                erro: 'Campos obrigatórios: numeroPedido, valorTotal, items' 
            });
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

// Listar todos os pedidos
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

// Obter pedido por ID
exports.getOrderById = async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id);
        
        if (!order) {
            return res.status(404).json({ erro: 'Pedido não encontrado' });
        }
        
        res.status(200).json(order);
    } catch (error) {
        next(error);
    }
};

// Atualizar pedido
exports.updateOrder = async (req, res, next) => {
    try {
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

// Deletar pedido
exports.deleteOrder = async (req, res, next) => {
    try {
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