const mongoose = require('mongoose');

/**
 * Schema de item dentro de um pedido
 */
const ItemSchema = new mongoose.Schema({
    productId: { type: Number, required: true },
    quantity:  { type: Number, required: true, min: [1, 'Quantidade deve ser maior que zero'] },
    price:     { type: Number, required: true, min: [0, 'Preço não pode ser negativo'] }
});

/**
 * Schema principal do pedido
 */
const OrderSchema = new mongoose.Schema({
    orderId:      { type: String, required: [true, 'numeroPedido é obrigatório'], unique: true },
    value:        { type: Number, required: [true, 'valorTotal é obrigatório'],   min: [0, 'Valor não pode ser negativo'] },
    creationDate: { type: Date,   required: [true, 'dataCriacao é obrigatória'] },
    items:        { type: [ItemSchema], validate: {
        validator: (arr) => arr.length > 0,
        message: 'O pedido deve ter ao menos 1 item'
    }}
});

module.exports = mongoose.model('Order', OrderSchema);