/**
 * Middleware para tratamento centralizado de erros
 */
const errorHandler = (err, req, res, next) => {
    console.error('❌ Erro:', err.message);
    
    // Erro de validação do Mongoose
    if (err.name === 'ValidationError') {
        return res.status(400).json({
            erro: 'Dados inválidos',
            detalhes: Object.values(err.errors).map(e => e.message)
        });
    }
    
    // Erro de ID inválido
    if (err.name === 'CastError') {
        return res.status(400).json({
            erro: 'ID inválido'
        });
    }
    
    // Erro genérico
    res.status(err.status || 500).json({
        erro: err.message || 'Erro interno do servidor'
    });
};

module.exports = errorHandler;