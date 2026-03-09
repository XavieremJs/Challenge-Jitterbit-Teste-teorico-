/**
 * Configuração de conexão com MongoDB Atlas
 */
const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 5000,
            heartbeatFrequencyMS: 10000
        });
        console.log('✅ Conectado ao MongoDB Atlas');
    } catch (error) {
        console.error('❌ Erro de conexão:', error.message);
        process.exit(1);
    }
};

module.exports = connectDB;