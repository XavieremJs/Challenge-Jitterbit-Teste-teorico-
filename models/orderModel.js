const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    orderId: { type: String, required: true, unique: true },
    value: { type: Number, required: true },
    creationDate: { type: Date, required: true },
    items: [{
        productId: Number,
        quantity: Number,
        price: Number
    }]
});

module.exports = mongoose.model('Order', OrderSchema);